<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_name' => $this->patient_name,
            'patient_age' => $this->patient_age,
            'patient_gender' => $this->patient_gender,
            'patient_file_number' => $this->patient_file_number,
            'disease' => $this->disease,
            'disease_category' => $this->disease_category,
            'hospital_name' => $this->hospital_name,
            'hospital_country' => $this->hospital_country,
            'city' => $this->city,
            'hospital_address' => $this->hospital_address,
            'estimated_cost' => $this->estimated_cost,
            'currency' => $this->currency,
            'description' => $this->description,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'priority' => $this->priority,
            'priority_label' => $this->getPriorityLabel(),
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toISOString(),
            'rejection_reason' => $this->when(
                $request->user() && $request->user()->isAdmin(),
                $this->rejection_reason
            ),
            'approval_notes' => $this->when(
                $request->user() && ($request->user()->isAdmin() || $request->user()->id === $this->user_id),
                $this->approval_notes
            ),
            'consent_given' => $this->consent_given,
            'views' => $this->views,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            'user' => new UserResource($this->whenLoaded('user')),
            'documents' => DocumentResource::collection($this->whenLoaded('documents')),
            'verifications' => VerificationResource::collection($this->whenLoaded('verifications')),
            'status_history' => StatusHistoryResource::collection($this->whenLoaded('statusHistory')),

            'verification_count' => $this->whenCounted('verifications', $this->verifications_count),
            'verified_count' => $this->when(
                $this->relationLoaded('verifications'),
                fn() => $this->verifications->where('status', 'approved')->count()
            ),
        ];
    }

    protected function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending' => 'قيد الانتظار',
            'verifying' => 'جاري التحقق',
            'verified' => 'تم التحقق',
            'approved' => 'معتمد',
            'rejected' => 'مرفوض',
            default => $this->status,
        };
    }

    protected function getPriorityLabel(): string
    {
        return match ($this->priority) {
            'low' => 'منخفضة',
            'medium' => 'متوسطة',
            'high' => 'عالية',
            'urgent' => 'عاجلة',
            default => $this->priority,
        };
    }
}
