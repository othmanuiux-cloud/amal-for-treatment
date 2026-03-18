<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_case_id',
        'file_path',
        'file_disk',
        'original_name',
        'mime_type',
        'file_type',
        'file_size',
        'is_verified',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public const FILE_TYPES = [
        'medical_report' => 'medical_report',
        'prescription' => 'prescription',
        'lab_result' => 'lab_result',
        'imaging' => 'imaging',
        'id_proof' => 'id_proof',
        'other' => 'other',
    ];

    public function medicalCase()
    {
        return $this->belongsTo(MedicalCase::class, 'medical_case_id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function isImage(): bool
    {
        return $this->mime_type && str_starts_with($this->mime_type, 'image/');
    }

    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }
}
