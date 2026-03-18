<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseResource;
use App\Http\Resources\UserResource;
use App\Models\MedicalCase;
use App\Models\CaseStatusHistory;
use App\Models\User;
use App\Helpers\NotificationHelper;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    // ✅ المستخدمين فقط (بدون المتطوعين)
    public function users(Request $request): AnonymousResourceCollection
    {
        $query = User::query();
        
        // استبعاد المتطوعين
        if ($request->has('exclude_volunteers')) {
            $query->where('role', '!=', 'volunteer')
                  ->orWhereNull('role');
        }
        
        // بحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // تصفية حسب الدور
        if ($request->has('role')) {
            $roles = explode(',', $request->role);
            $query->whereIn('role', $roles);
        }

        if ($request->has('country')) {
            $query->where('country', $request->country);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        
        return UserResource::collection($query->latest()->paginate(20));
    }
    
    // ✅ المتطوعين فقط
    public function volunteers(Request $request): AnonymousResourceCollection
    {
        $query = User::where('role', 'volunteer');
        
        // بحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        return UserResource::collection($query->latest()->paginate(20));
    }

    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => ['required', 'in:admin,volunteer,patient'],
        ]);

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function toggleUserStatus(Request $request, User $user): JsonResponse
    {
        $newActive = !$user->is_active;
        $status = $newActive ? 'active' : 'disabled';

        $user->update([
            'is_active' => $newActive,
            'status' => $status
        ]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function rejectVolunteer(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $user->update([
            'status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => $request->reason
        ]);

        return response()->json([
            'message' => 'Volunteer rejected successfully',
            'user' => new UserResource($user)
        ]);
    }

    public function bulkUpdateUserStatus(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'status' => 'required|in:active,disabled,rejected,pending',
            'reason' => 'nullable|string|max:500'
        ]);

        $isActive = $request->status === 'active';

        User::whereIn('id', $request->user_ids)->update([
            'status' => $request->status,
            'is_active' => $isActive,
            'rejection_reason' => $request->status === 'rejected' ? $request->reason : null
        ]);

        return response()->json([
            'message' => 'Bulk status update successful'
        ]);
    }

    public function casesForApproval(Request $request): AnonymousResourceCollection
    {
        $query = MedicalCase::with(['user', 'documents', 'verifications.volunteer']);

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_name', 'like', "%{$search}%")
                    ->orWhere('disease', 'like', "%{$search}%")
                    ->orWhere('hospital_name', 'like', "%{$search}%");
            });
        }

        $cases = $query->orderBy('created_at', 'desc')->paginate(15);

        return CaseResource::collection($cases);
    }

    public function getCase(MedicalCase $medicalCase): JsonResponse
    {
        return response()->json([
            'case' => new CaseResource($medicalCase->load(['documents', 'user', 'verifications.volunteer', 'statusHistory.changer'])),
        ]);
    }

    public function updateCase(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate([
            'patient_name' => ['sometimes', 'string', 'max:255'],
            'patient_age' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:150'],
            'patient_gender' => ['sometimes', 'nullable', 'in:male,female,other'],
            'disease' => ['sometimes', 'string', 'max:500'],
            'disease_category' => ['sometimes', 'nullable', 'string', 'max:200'],
            'hospital_name' => ['sometimes', 'string', 'max:500'],
            'hospital_country' => ['sometimes', 'string', 'max:100'],
            'hospital_address' => ['sometimes', 'nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'estimated_cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'nullable', 'string', 'size:3'],
            'description' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'nullable', 'in:low,medium,high,urgent'],
            'status' => ['sometimes', 'in:pending,verifying,verified,approved,rejected'],
        ]);

        $medicalCase->update($request->only([
            'patient_name',
            'patient_age',
            'patient_gender',
            'disease',
            'disease_category',
            'hospital_name',
            'hospital_country',
            'city',
            'hospital_address',
            'estimated_cost',
            'currency',
            'description',
            'priority',
            'status'
        ]));

        return response()->json([
            'message' => 'Case updated successfully',
            'case' => new CaseResource($medicalCase->load(['documents', 'user'])),
        ]);
    }

    public function deleteCase(MedicalCase $medicalCase): JsonResponse
    {
        foreach ($medicalCase->documents as $document) {
            if ($document->file_path && \Storage::disk($document->file_disk)->exists($document->file_path)) {
                \Storage::disk($document->file_disk)->delete($document->file_path);
            }
        }

        $medicalCase->delete();

        return response()->json([
            'message' => 'Case deleted successfully',
        ]);
    }

    public function approveCase(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        // Allow admins to approve cases from any active state
        if (in_array($medicalCase->status, ['approved', 'rejected'])) {
            return response()->json([
                'message' => 'Case is already ' . $medicalCase->status,
            ], 400);
        }

        $oldStatus = $medicalCase->status;
        $medicalCase->update([
            'status' => 'approved',
            'approval_notes' => $request->notes,
            'is_published' => true,
            'published_at' => now(),
        ]);

        CaseStatusHistory::create([
            'medical_case_id' => $medicalCase->id,
            'old_status' => $oldStatus,
            'new_status' => 'approved',
            'changed_by' => $request->user()->id,
            'notes' => $request->notes ?? 'Case approved by admin',
        ]);

        // Send notification to patient
        NotificationHelper::caseApproved(
            $medicalCase->user_id,
            $medicalCase->id,
            $medicalCase->patient_name
        );

        return response()->json([
            'message' => 'Case approved successfully',
            'case' => new CaseResource($medicalCase->load(['documents', 'user'])),
        ]);
    }

    public function rejectCase(Request $request, MedicalCase $medicalCase): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string'],
        ]);

        if (in_array($medicalCase->status, ['approved', 'rejected'])) {
            return response()->json([
                'message' => 'Case cannot be rejected',
            ], 400);
        }

        $oldStatus = $medicalCase->status;
        $medicalCase->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        CaseStatusHistory::create([
            'medical_case_id' => $medicalCase->id,
            'old_status' => $oldStatus,
            'new_status' => 'rejected',
            'changed_by' => $request->user()->id,
            'notes' => 'Case rejected: ' . $request->reason,
        ]);

        // Send notification to patient
        NotificationHelper::caseRejected(
            $medicalCase->user_id,
            $medicalCase->id,
            $medicalCase->patient_name,
            $request->reason
        );

        return response()->json([
            'message' => 'Case rejected',
            'case' => new CaseResource($medicalCase),
        ]);
    }

    public function statistics(Request $request): JsonResponse
    {
        // Self-healing: if any cases have null or invalid status, set them to pending
        MedicalCase::whereNull('status')
            ->orWhereNotIn('status', ['pending', 'verifying', 'verified', 'approved', 'rejected', 'completed', 'on_hold', 'cancelled'])
            ->update(['status' => 'pending']);

        $total = MedicalCase::count();
        $pending = MedicalCase::where('status', 'pending')->count();
        $verifying = MedicalCase::where('status', 'verifying')->count();
        $verified = MedicalCase::where('status', 'verified')->count();
        $approved = MedicalCase::where('status', 'approved')->count();
        $rejected = MedicalCase::where('status', 'rejected')->count();
        $completed = MedicalCase::where('status', 'completed')->count();
        $on_hold = MedicalCase::where('status', 'on_hold')->count();
        $cancelled = MedicalCase::where('status', 'cancelled')->count();

        // Sum specifically the categories we might want to display on the progress bar
        $sum = $pending + $verifying + $verified + $approved + $rejected + $completed + $on_hold + $cancelled;

        if ($total !== $sum) {
            \Log::warning("Dashboard stats mismatch: Total={$total}, Sum={$sum}");
        }

        $calcPercent = function ($count, $total) {
            return $total > 0 ? round(($count / $total) * 100) : 0;
        };

        // Primary list of statuses matches the sum to avoid user confusion
        $primaryStats = [
            'total_cases' => $total,
            'pending_cases' => $pending,
            'verifying_cases' => $verifying,
            'verified_cases' => $verified,
            'approved_cases' => $approved,
            'rejected_cases' => $rejected,
            'published_cases' => MedicalCase::where('is_published', true)->count(),

            'by_status' => [
                ['label' => 'بانتظار المراجعة', 'count' => $pending, 'percentage' => $calcPercent($pending, $total), 'color' => 'bg-amber-400'],
                ['label' => 'جاري التحقق', 'count' => $verifying, 'percentage' => $calcPercent($verifying, $total), 'color' => 'bg-blue-400'],
                ['label' => 'تم التحقق الأولي', 'count' => $verified, 'percentage' => $calcPercent($verified, $total), 'color' => 'bg-indigo-500'],
                ['label' => 'حالات معتمدة', 'count' => $approved, 'percentage' => $calcPercent($approved, $total), 'color' => 'bg-emerald-500'],
                ['label' => 'حالات مرفوضة', 'count' => $rejected, 'percentage' => $calcPercent($rejected, $total), 'color' => 'bg-rose-500'],
            ],

            'total_users' => User::count(),
            'total_patients' => User::where('role', 'patient')->count(),
            'total_volunteers' => User::where('role', 'volunteer')->count(),
            'total_admins' => User::where('role', 'admin')->count(),

            'volunteers' => [
                'active_count' => User::where('role', 'volunteer')->where('status', 'active')->count(),
                'total_count' => User::where('role', 'volunteer')->count(),
            ],

            'cases_by_country' => MedicalCase::selectRaw('hospital_country, COUNT(*) as count')
                ->groupBy('hospital_country')
                ->pluck('count', 'hospital_country'),
            
            'monthly_trends' => $this->getMonthlyTrends(),
        ];

        return response()->json(['statistics' => $primaryStats]);
    }

    private function getMonthlyTrends(): array
    {
        $trends = [];
        $months = [];
        
        // Generate last 6 months keys and names
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[$date->format('Y-m')] = [
                'name' => $date->translatedFormat('F'),
                'cases' => 0,
                'volunteers' => 0,
                'donations' => 0,
            ];
        }

        // Get cases growth and group in PHP
        MedicalCase::where('created_at', '>=', Carbon::now()->subMonths(6))
            ->get(['created_at'])
            ->each(function ($case) use (&$months) {
                $monthKey = $case->created_at->format('Y-m');
                if (isset($months[$monthKey])) {
                    $months[$monthKey]['cases']++;
                }
            });

        // Get volunteers growth and group in PHP
        User::where('role', 'volunteer')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->get(['created_at'])
            ->each(function ($user) use (&$months) {
                $monthKey = $user->created_at->format('Y-m');
                if (isset($months[$monthKey])) {
                    $months[$monthKey]['volunteers']++;
                }
            });

        foreach ($months as $m) {
            $trends[] = [
                'month' => $m['name'],
                'cases' => $m['cases'],
                'volunteers' => $m['volunteers'],
                'donations' => $m['donations'],
            ];
        }

        return $trends;
    }

    public function createUser(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,volunteer,patient'],
            'country' => ['required', 'string', 'max:100'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'country' => $request->country,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user),
        ], 201);
    }

    public function getUser(User $user): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'country' => ['sometimes', 'string', 'max:100'],
            'role' => ['sometimes', 'in:admin,volunteer,patient'],
        ]);

        $user->update($request->only(['name', 'email', 'phone', 'country', 'role']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function deleteUser(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'You cannot delete your own account',
            ], 400);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
