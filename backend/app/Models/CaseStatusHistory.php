<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStatusHistory extends Model
{
    use HasFactory;

    protected $table = 'case_status_histories';

    protected $fillable = [
        'medical_case_id',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    public function medicalCase()
    {
        return $this->belongsTo(MedicalCase::class, 'medical_case_id');
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
