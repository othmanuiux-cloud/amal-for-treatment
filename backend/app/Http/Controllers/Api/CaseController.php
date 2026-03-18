<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Http\Resources\CaseResource;
use App\Models\MedicalCase;
use App\Models\CaseDocument;
use App\Models\CaseStatusHistory;
use App\Helpers\NotificationHelper;
use App\Services\CaseAssignmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class CaseController extends Controller
{
    protected $assignmentService;

    public function __construct()
    {
        $this->assignmentService = new CaseAssignmentService();
    }
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = MedicalCase::with(['user', 'documents', 'verifications']);

        if ($request->user()->isPatient()) {
            $query->where('user_id', $request->user()->id);
        } elseif ($request->user()->isVolunteer()) {
            $query->where('hospital_country', $request->user()->country);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('country')) {
            $query->byCountry($request->country);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        $cases = $query->orderBy('created_at', 'desc')->paginate(15);

        return CaseResource::collection($cases);
    }

    public function store(StoreCaseRequest $request): JsonResponse
    {
        $case = MedicalCase::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
            'consent_given' => true,
            'consent_date' => now(),
            'status' => 'pending',
        ]);

        CaseStatusHistory::create([
            'medical_case_id' => $case->id,
            'old_status' => null,
            'new_status' => 'pending',
            'changed_by' => $request->user()->id,
            'notes' => 'Case submitted by patient',
        ]);

        // Send confirmation notification to patient
        NotificationHelper::caseSubmitted(
            $request->user()->id,
            $case->id,
            $case->patient_name
        );

        // Try to automatically assign to a volunteer
        $assignedVolunteer = $this->assignmentService->assignCase($case);

        return response()->json([
            'message' => 'Case submitted successfully',
            'case' => new CaseResource($case->load(['documents', 'user', 'assignedVolunteer'])),
            'assignment' => $assignedVolunteer ? [
                'assigned' => true,
                'volunteer' => $assignedVolunteer->name,
                'method' => $case->assignment_method,
            ] : [
                'assigned' => false,
                'reason' => 'No available volunteers',
            ],
        ], 201);
    }

    public function show(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        if (!$request->user()->can('view', $medicalCase)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $medicalCase->incrementViews();

        return response()->json([
            'case' => new CaseResource($medicalCase->load(['documents', 'user', 'verifications.volunteer', 'statusHistory.changer'])),
        ]);
    }

    public function update(UpdateCaseRequest $request, MedicalCase $medicalCase): JsonResponse
    {
        if (!$request->user()->can('update', $medicalCase)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $medicalCase->update($request->validated());

        return response()->json([
            'message' => 'Case updated successfully',
            'case' => new CaseResource($medicalCase->load(['documents', 'user'])),
        ]);
    }

    public function destroy(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        if (!$request->user()->can('delete', $medicalCase)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        foreach ($medicalCase->documents as $document) {
            Storage::disk($document->file_disk)->delete($document->file_path);
        }

        $medicalCase->delete();

        return response()->json([
            'message' => 'Case deleted successfully',
        ]);
    }

    public function publish(Request $request, MedicalCase $medicalModel): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $medicalModel->update([
            'is_published' => true,
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Case published successfully',
            'case' => new CaseResource($medicalModel),
        ]);
    }

    public function publishedCases(Request $request): AnonymousResourceCollection
    {
        $cases = MedicalCase::with(['user', 'documents'])
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate(15);

        return CaseResource::collection($cases);
    }

    public function showPublic($id): JsonResponse
    {
        $medicalCase = MedicalCase::with(['user', 'documents', 'verifications.volunteer', 'statusHistory.changer'])
            ->where('id', $id)
            ->whereIn('status', ['pending', 'verifying', 'approved', 'verified'])
            ->firstOrFail();

        $medicalCase->incrementViews();

        return response()->json([
            'case' => new CaseResource($medicalCase),
        ]);
    }
}
