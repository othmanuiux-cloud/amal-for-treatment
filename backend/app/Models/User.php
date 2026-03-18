<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'country',
        'city',
        'phone',
        'phone_encrypted',
        'phone_iv',
        'avatar_path',
        'is_active',
        'status',
        'rejection_reason',
        'email_verified_at',
        'last_login_at',
        'available_for_cases',
        'assigned_cases_count',
        'last_assigned_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'phone_encrypted',
        'phone_iv',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function cases()
    {
        return $this->hasMany(MedicalCase::class, 'user_id');
    }

    public function medicalCases()
    {
        return $this->hasMany(MedicalCase::class, 'user_id');
    }

    public function assignedCases()
    {
        return $this->hasMany(MedicalCase::class, 'assigned_to');
    }

    public function verifications()
    {
        return $this->hasMany(Verification::class, 'volunteer_id');
    }

    public function userNotifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function unreadNotifications()
    {
        return $this->userNotifications()->whereNull('read_at');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isVolunteer(): bool
    {
        return $this->role === 'volunteer';
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function getDecryptedPhone(): ?string
    {
        if (!$this->phone_encrypted || !$this->phone_iv) {
            return null;
        }

        $cipher = 'aes-256-cbc';
        $decrypted = openssl_decrypt(
            $this->phone_encrypted,
            $cipher,
            config('app.key'),
            0,
            base64_decode($this->phone_iv)
        );

        return $decrypted ?: null;
    }
}
