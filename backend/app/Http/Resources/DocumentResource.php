<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'case_id' => $this->medical_case_id,
            'file_name' => $this->original_name,
            'file_type' => $this->file_type,
            'file_type_label' => $this->getFileTypeLabel(),
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'file_size_formatted' => $this->formatFileSize(),
            'is_verified' => $this->is_verified,
            'verified_at' => $this->verified_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            
            'verifier' => new UserResource($this->whenLoaded('verifier')),
        ];
    }

    protected function getFileTypeLabel(): string
    {
        return match($this->file_type) {
            'medical_report' => 'تقرير طبي',
            'prescription' => 'وصفة طبية',
            'lab_result' => 'نتائج تحاليل',
            'imaging' => 'أشعة',
            'id_proof' => 'إثبات هوية',
            'other' => 'أخرى',
            default => $this->file_type,
        };
    }

    protected function formatFileSize(): string
    {
        if (!$this->file_size) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        $size = $this->file_size;

        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2) . ' ' . $units[$i];
    }
}
