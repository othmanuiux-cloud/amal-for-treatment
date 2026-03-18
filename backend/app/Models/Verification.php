<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_case_id',
        'volunteer_id',
        'status',
        'verification_notes',
        'evidence_file_path',
        'is_first_verifier',
    ];

    protected $casts = [
        'is_first_verifier' => 'boolean',
    ];

    public const STATUSES = [
        'pending' => 'pending',
        'approved' => 'approved',
        'rejected' => 'rejected',
    ];

    public function medicalCase()
    {
        return $this->belongsTo(MedicalCase::class, 'medical_case_id');
    }

    public function volunteer()
    {
        return $this->belongsTo(User::class, 'volunteer_id');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function approve(string $notes = null): void
    {
        $this->update([
            'status' => 'approved',
            'verification_notes' => $notes ?? $this->verification_notes,
        ]);
    }

    public function reject(string $notes = null): void
    {
        $this->update([
            'status' => 'rejected',
            'verification_notes' => $notes ?? $this->verification_notes,
        ]);
    }
}
