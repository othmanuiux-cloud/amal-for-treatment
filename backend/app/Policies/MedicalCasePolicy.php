<?php

namespace App\Policies;

use App\Models\MedicalCase;
use App\Models\User;

class MedicalCasePolicy
{
    public function view(User $user, MedicalCase $medicalCase): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $medicalCase->user_id === $user->id;
        }

        if ($user->isVolunteer()) {
            return $medicalCase->hospital_country === $user->country;
        }

        return false;
    }

    public function update(User $user, MedicalCase $medicalCase): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $medicalCase->user_id === $user->id && $medicalCase->isPending();
        }

        return false;
    }

    public function delete(User $user, MedicalCase $medicalCase): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $medicalCase->user_id === $user->id && $medicalCase->isPending();
        }

        return false;
    }

    public function uploadDocument(User $user, MedicalCase $medicalCase): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $medicalCase->user_id === $user->id && in_array($medicalCase->status, ['pending', 'verifying']);
        }

        return false;
    }
}
