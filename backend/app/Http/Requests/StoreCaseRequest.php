<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_name' => ['required', 'string', 'max:255'],
            'patient_age' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:150'],
            'patient_gender' => ['sometimes', 'nullable', 'in:male,female,other'],
            'patient_file_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'disease' => ['required', 'string', 'max:500'],
            'disease_category' => ['sometimes', 'nullable', 'string', 'max:200'],
            'hospital_name' => ['required', 'string', 'max:500'],
            'hospital_country' => ['required', 'string', 'max:100'],
            'hospital_address' => ['sometimes', 'nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'estimated_cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'nullable', 'string', 'size:3'],
            'description' => ['required', 'string'],
            'priority' => ['sometimes', 'nullable', 'in:low,medium,high,urgent'],
            'documents' => ['sometimes', 'array', 'max:10'],
            'documents.*' => ['file', 'mimes:pdf,jpg,jpeg,png,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_name.required' => 'اسم المريض مطلوب',
            'patient_name.max' => 'اسم المريض طويل جداً',
            'disease.required' => 'اسم المرض مطلوب',
            'hospital_name.required' => 'اسم المستشفى مطلوب',
            'hospital_country.required' => 'يرجى تحديد دولة المستشفى',
            'description.required' => 'يرجى كتابة وصف للحالة',
            'documents.max' => 'الحد الأقصى 10 ملفات',
            'documents.*.max' => 'حجم الملف الأقصى 5 ميجابايت',
            'documents.*.mimes' => 'نوع الملف غير مسموح به',
        ];
    }
}
