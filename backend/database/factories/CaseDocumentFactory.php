<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CaseDocument>
 */
class CaseDocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'medical_case_id' => \App\Models\MedicalCase::factory(),
            'file_path' => 'documents/medical_reports/' . fake()->uuid() . '.pdf',
            'file_disk' => 'local',
            'original_name' => collect(['تقرير_طبي.pdf', 'فحوصات.pdf', 'أشعة.jpeg'])->random(),
            'mime_type' => fake()->randomElement(['application/pdf', 'image/jpeg', 'image/png']),
            'file_type' => fake()->randomElement(['medical_report', 'prescription', 'lab_result', 'imaging', 'id_proof']),
            'file_size' => fake()->numberBetween(100000, 5000000), // Between 100KB and 5MB
            'is_verified' => fake()->boolean(80),
        ];
    }
}
