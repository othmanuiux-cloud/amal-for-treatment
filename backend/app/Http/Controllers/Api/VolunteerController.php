<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResource;
use App\Models\MedicalCase;
use App\Models\CaseStatusHistory;
use App\Models\Verification;
use App\Helpers\NotificationHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VolunteerController extends Controller
{
    public function cases(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        
        // Get cases assigned to this volunteer OR available in their country
        $cases = MedicalCase::with(['user', 'documents', 'assignedVolunteer'])
            ->where(function ($query) use ($user) {
                // Cases specifically assigned to this volunteer
                $query->where('assigned_to', $user->id)
                    // OR cases in their country that are pending (for auto-assignment fallback)
                    ->orWhere(function ($q) use ($user) {
                        $q->where('hospital_country', $user->country)
                          ->whereNull('assigned_to')
                          ->where('status', 'pending');
                    });
            })
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->paginate(15);

        return CaseResource::collection($cases);
    }

    public function show(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $user = $request->user();
        
        // Check if user has access to this case
        if ($medicalCase->assigned_to !== $user->id && 
            $medicalCase->hospital_country !== $user->country) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => new CaseResource($medicalCase->load(['user', 'documents', 'assignedVolunteer', 'verifications.volunteer', 'statusHistory'])),
        ]);
    }

    public function startVerification(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate(['notes' => 'nullable|string']);

        if (!$medicalCase->canBeVerified()) {
            return response()->json([
                'message' => 'Case cannot be verified at this stage',
            ], 400);
        }

        if ($medicalCase->hospital_country !== $request->user()->country) {
            return response()->json([
                'message' => 'You can only verify cases in your assigned country',
            ], 403);
        }

        $existingVerification = Verification::where('medical_case_id', $medicalCase->id)
            ->where('volunteer_id', $request->user()->id)
            ->first();

        if ($existingVerification) {
            return response()->json([
                'message' => 'You have already started a verification for this case',
            ], 400);
        }

        Verification::create([
            'medical_case_id' => $medicalCase->id,
            'volunteer_id' => $request->user()->id,
            'status' => 'pending',
            'is_first_verifier' => !$medicalCase->verifications()->exists(),
        ]);

        if ($medicalCase->status === 'pending') {
            $oldStatus = $medicalCase->status;
            $medicalCase->update(['status' => 'verifying']);

            CaseStatusHistory::create([
                'medical_case_id' => $medicalCase->id,
                'old_status' => $oldStatus,
                'new_status' => 'verifying',
                'changed_by' => $request->user()->id,
                'notes' => 'Verification started by volunteer',
            ]);

            // Notify patient
            NotificationHelper::caseUnderReview(
                $medicalCase->user_id,
                $medicalCase->id,
                $medicalCase->patient_name
            );
        }

        return response()->json([
            'message' => 'Verification started successfully',
            'case' => new CaseResource($medicalCase->load(['verifications.volunteer', 'documents'])),
        ]);
    }

    public function submitVerification(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:approved,rejected'],
            'notes' => ['required', 'string'],
            'evidence_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $verification = Verification::where('medical_case_id', $medicalCase->id)
            ->where('volunteer_id', $request->user()->id)
            ->firstOrFail();

        $evidencePath = null;
        if ($request->hasFile('evidence_file')) {
            $evidencePath = $request->file('evidence_file')->store('verifications', 'private');
        }

        $verification->update([
            'status' => $request->status,
            'verification_notes' => $request->notes,
            'evidence_file_path' => $evidencePath,
        ]);

        $approvedCount = Verification::where('medical_case_id', $medicalCase->id)
            ->where('status', 'approved')
            ->count();

        if ($approvedCount >= 2) {
            $oldStatus = $medicalCase->status;
            $medicalCase->update(['status' => 'verified']);

            CaseStatusHistory::create([
                'medical_case_id' => $medicalCase->id,
                'old_status' => $oldStatus,
                'new_status' => 'verified',
                'changed_by' => $request->user()->id,
                'notes' => 'Case verified by volunteers',
            ]);

            // Notify patient
            NotificationHelper::caseVerified(
                $medicalCase->user_id,
                $medicalCase->id,
                $medicalCase->patient_name
            );
        }

        return response()->json([
            'message' => 'Verification submitted successfully',
            'verification' => new \App\Http\Resources\VerificationResource($verification),
        ]);
    }
}
