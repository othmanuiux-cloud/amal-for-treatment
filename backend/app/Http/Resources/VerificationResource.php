<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'case_id' => $this->medical_case_id,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'verification_notes' => $this->verification_notes,
            'evidence_file_path' => $this->evidence_file_path,
            'is_first_verifier' => $this->is_first_verifier,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            
            'volunteer' => new UserResource($this->whenLoaded('volunteer')),
        ];
    }

    protected function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'قيد الانتظار',
            'approved' => 'موافق',
            'rejected' => 'مرفوض',
            default => $this->status,
        };
    }
}
