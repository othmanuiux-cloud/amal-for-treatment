<?php

namespace App\Traits;

trait HasRoles
{
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    public function canAccessAdmin(): bool
    {
        return $this->isAdmin();
    }

    public function canVerifyCases(): bool
    {
        return $this->isVolunteer() || $this->isAdmin();
    }

    public function canSubmitCases(): bool
    {
        return $this->isPatient();
    }

    public function canApproveCases(): bool
    {
        return $this->isAdmin();
    }
}
