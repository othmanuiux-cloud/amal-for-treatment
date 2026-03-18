<?php

namespace App\Services;

use App\Models\User;
use App\Models\MedicalCase;
use App\Models\Notification;
use App\Helpers\NotificationHelper;

class CaseAssignmentService
{
    /**
     * Automatically assign a case to the best available volunteer
     * Priority: Same city → Same country → Any available
     */
    public function assignCase(MedicalCase $case): ?User
    {
        $country = $case->hospital_country;
        $city = $case->city;

        // 1. Try to find volunteer in the same city
        $volunteer = $this->findVolunteer($country, $city);
        
        if ($volunteer) {
            return $this->assignToVolunteer($case, $volunteer, 'city');
        }

        // 2. Try to find volunteer in the same country
        $volunteer = $this->findVolunteer($country, null);
        
        if ($volunteer) {
            return $this->assignToVolunteer($case, $volunteer, 'country');
        }

        // 3. Find any available volunteer
        $volunteer = $this->findVolunteer(null, null);
        
        if ($volunteer) {
            return $this->assignToVolunteer($case, $volunteer, 'any');
        }

        // No volunteer found - case remains unassigned
        return null;
    }

    /**
     * Find an available volunteer based on criteria
     */
    private function findVolunteer(?string $country, ?string $city): ?User
    {
        $query = User::where('role', 'volunteer')
            ->where('is_active', true)
            ->where('available_for_cases', true);

        if ($city) {
            $query->where('city', $city);
        }

        if ($country) {
            $query->where('country', $country);
        }

        return $query->orderBy('assigned_cases_count', 'asc')
            ->orderBy('last_assigned_at', 'asc')
            ->first();
    }

    /**
     * Assign case to a specific volunteer
     */
    private function assignToVolunteer(MedicalCase $case, User $volunteer, string $method): User
    {
        // Update case with assignment
        $case->update([
            'assigned_to' => $volunteer->id,
            'assigned_at' => now(),
            'assignment_method' => 'auto',
            'assignment_notes' => $this->getAssignmentNote($method),
            'status' => 'verifying', // Auto-start verification
        ]);

        // Update volunteer stats
        $volunteer->update([
            'assigned_cases_count' => $volunteer->assigned_cases_count + 1,
            'last_assigned_at' => now(),
        ]);

        // Create status history
        \App\Models\CaseStatusHistory::create([
            'medical_case_id' => $case->id,
            'old_status' => 'pending',
            'new_status' => 'verifying',
            'changed_by' => $volunteer->id,
            'notes' => 'Case automatically assigned to volunteer: ' . $volunteer->name,
        ]);

        // Send notifications
        $this->sendNotifications($case, $volunteer);

        return $volunteer;
    }

    /**
     * Get assignment note based on method
     */
    private function getAssignmentNote(string $method): string
    {
        return match($method) {
            'city' => 'تم الإسناد التلقائي - تطابق في المدينة',
            'country' => 'تم الإسناد التلقائي - تطابق في الدولة',
            'any' => 'تم الإسناد التلقائي - لا توجد متطوعين في المنطقة',
            default => 'تم الإسناد التلقائي',
        };
    }

    /**
     * Send notifications to volunteer and patient
     */
    private function sendNotifications(MedicalCase $case, User $volunteer): void
    {
        // Notify volunteer
        NotificationHelper::caseAssignedToVolunteer(
            $volunteer->id,
            $case->id,
            $case->patient_name,
            $case->hospital_country,
            $case->city
        );

        // Notify patient
        NotificationHelper::caseUnderReview(
            $case->user_id,
            $case->id,
            $case->patient_name
        );
    }

    /**
     * Manually assign a case to a specific volunteer
     */
    public function manualAssign(MedicalCase $case, User $volunteer, ?string $notes = null): bool
    {
        // Update case
        $case->update([
            'assigned_to' => $volunteer->id,
            'assigned_at' => now(),
            'assignment_method' => 'manual',
            'assignment_notes' => $notes ?? 'تم الإسناد اليدوي من قبل الإدارة',
            'status' => 'verifying',
        ]);

        // Update volunteer stats
        $volunteer->update([
            'assigned_cases_count' => $volunteer->assigned_cases_count + 1,
            'last_assigned_at' => now(),
        ]);

        // Create status history
        \App\Models\CaseStatusHistory::create([
            'medical_case_id' => $case->id,
            'old_status' => $case->getOriginal('status'),
            'new_status' => 'verifying',
            'changed_by' => auth()->id(),
            'notes' => 'تم الإسناد اليدوي لـ: ' . $volunteer->name,
        ]);

        // Send notifications
        $this->sendNotifications($case, $volunteer);

        return true;
    }

    /**
     * Reassign case to another volunteer
     */
    public function reassign(MedicalCase $case, User $newVolunteer, ?string $reason = null): bool
    {
        $oldVolunteer = $case->assigned_to ? User::find($case->assigned_to) : null;

        // Update case
        $case->update([
            'assigned_to' => $newVolunteer->id,
            'assigned_at' => now(),
            'assignment_method' => $case->assignment_method ?? 'auto',
            'assignment_notes' => $reason ? "إعادة إسناد: $reason" : 'تم إعادة الإسناد',
        ]);

        // Update new volunteer stats
        $newVolunteer->update([
            'assigned_cases_count' => $newVolunteer->assigned_cases_count + 1,
            'last_assigned_at' => now(),
        ]);

        // Notify new volunteer
        NotificationHelper::caseAssignedToVolunteer(
            $newVolunteer->id,
            $case->id,
            $case->patient_name,
            $case->hospital_country,
            $case->city
        );

        return true;
    }

    /**
     * Get assignment statistics
     */
    public function getStats(): array
    {
        return [
            'total_assigned' => MedicalCase::whereNotNull('assigned_to')->count(),
            'unassigned' => MedicalCase::whereNull('assigned_to')
                ->whereIn('status', ['pending', 'verifying'])->count(),
            'by_method' => [
                'auto' => MedicalCase::where('assignment_method', 'auto')->count(),
                'manual' => MedicalCase::where('assignment_method', 'manual')->count(),
            ],
        ];
    }
}
