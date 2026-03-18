<?php

namespace App\Policies;

use App\Models\CaseDocument;
use App\Models\User;

class DocumentPolicy
{
    public function download(User $user, CaseDocument $document): bool
    {
        $medicalCase = $document->medicalCase;

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

    public function delete(User $user, CaseDocument $document): bool
    {
        $medicalCase = $document->medicalCase;

        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isPatient()) {
            return $medicalCase->user_id === $user->id && $medicalCase->isPending();
        }

        return false;
    }
}
