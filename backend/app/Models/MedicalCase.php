<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_name',
        'patient_age',
        'patient_gender',
        'patient_file_number',
        'disease',
        'disease_category',
        'hospital_name',
        'hospital_country',
        'hospital_address',
        'city',
        'estimated_cost',
        'currency',
        'description',
        'status',
        'rejection_reason',
        'approval_notes',
        'priority',
        'is_published',
        'published_at',
        'consent_given',
        'consent_date',
        'views',
        'assigned_to',
        'assigned_at',
        'assignment_notes',
        'assignment_method',
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
        'patient_age' => 'integer',
        'is_published' => 'boolean',
        'consent_given' => 'boolean',
        'published_at' => 'datetime',
        'consent_date' => 'datetime',
        'views' => 'integer',
    ];

    public const STATUSES = [
        'pending' => 'pending',
        'verifying' => 'verifying',
        'verified' => 'verified',
        'approved' => 'approved',
        'rejected' => 'rejected',
    ];

    public const PRIORITIES = [
        'low' => 'low',
        'medium' => 'medium',
        'high' => 'high',
        'urgent' => 'urgent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedVolunteer()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function documents()
    {
        return $this->hasMany(CaseDocument::class, 'medical_case_id');
    }

    public function verifications()
    {
        return $this->hasMany(Verification::class, 'medical_case_id');
    }

    public function statusHistory()
    {
        return $this->hasMany(CaseStatusHistory::class, 'medical_case_id');
    }

    public function approvedVerifications()
    {
        return $this->verifications()->where('status', 'approved');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isVerifying(): bool
    {
        return $this->status === 'verifying';
    }

    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function canBeVerified(): bool
    {
        return in_array($this->status, ['pending', 'verifying']);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeVerifying($query)
    {
        return $query->where('status', 'verifying');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCountry($query, string $country)
    {
        return $query->where('hospital_country', $country);
    }

    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
