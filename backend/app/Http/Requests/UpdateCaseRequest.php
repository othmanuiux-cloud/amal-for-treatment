<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['sometimes', 'string', 'max:255'],
            'patient_age' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:150'],
            'patient_gender' => ['sometimes', 'nullable', 'in:male,female,other'],
            'patient_file_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'disease' => ['sometimes', 'string', 'max:500'],
            'disease_category' => ['sometimes', 'nullable', 'string', 'max:200'],
            'hospital_name' => ['sometimes', 'string', 'max:500'],
            'hospital_country' => ['sometimes', 'string', 'max:100'],
            'hospital_address' => ['sometimes', 'nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'estimated_cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'nullable', 'string', 'size:3'],
            'description' => ['sometimes', 'string'],
            'priority' => ['sometimes', 'nullable', 'in:low,medium,high,urgent'],
        ];
    }
}
