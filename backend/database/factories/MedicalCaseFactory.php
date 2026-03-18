<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalCase>
 */
class MedicalCaseFactory extends Factory
{
    public function definition(): array
    {
        // Set Arabic locale for fake data
        $faker = \Faker\Factory::create('ar_SA');

        $categories = ['طبية', 'إنسانية', 'تعليمية', 'مالية', 'عمليات جراحية', 'علاج مزمن'];

        $diseases = [
            'حاجة لعملية زراعة كلى',
            'فشل كلوي مزمن يحتاج غسيل',
            'عملية قلب مفتوح',
            'علاج كيماوي لمرض السرطان',
            'كسور مضاعفة تحتاج شرائح ومسامير',
            'عملية سحب مياه بيضاء وزرع عدسة'
        ];

        $descriptions = [
            'المريض بحاجة ماسة للتدخل الجراحي السريع لإنقاذ حياته، والأسرة لا تملك تكاليف العلاج الباهظة في المستشفى المذكور.',
            'حالة إنسانية صعبة، المريض يعاني من آلام مبرحة ويحتاج إلى جلسات علاج مستمرة وتوفير أدوية شهرية لا يغطيها التأمين.',
            'تم إدخال المريض للطوارئ وهو الآن منوم في العناية المركزة، ونحتاج لتغطية تكاليف الإقامة الطبية والأجهزة المساعدة للتنفس.',
            'عائلة المريض تناشد أصحاب الأيادي البيضاء للمساهمة في تكلفة العملية الجراحية المقررة الأسبوع القادم في المستشفى التخصصي.'
        ];

        return [
            'user_id' => \App\Models\User::factory(),
            'patient_name' => collect(['محمد', 'أحمد', 'فاطمة', 'علي', 'عائشة', 'خالد', 'سارة', 'عمر', 'نورة', 'حسن'])->random() . ' ' .
                collect(['العنزي', 'الشمري', 'الدوسري', 'القحطاني', 'المطيري', 'العتيبي', 'الشهراني', 'الزهراني'])->random(),
            'patient_age' => fake()->numberBetween(5, 75),
            'patient_gender' => fake()->randomElement(['male', 'female']),
            'disease' => fake()->randomElement($diseases),
            'disease_category' => fake()->randomElement($categories),
            'hospital_name' => 'مستشفى ' . collect(['الملك فهد', 'الملك عبد العزيز', 'الحرس الوطني', 'المواساة', 'الحبيب'])->random(),
            'hospital_country' => 'السعودية',
            'hospital_address' => $faker->address(),
            'estimated_cost' => fake()->randomFloat(2, 500, 5000),
            'currency' => 'SAR',
            'description' => fake()->randomElement($descriptions),
            'status' => 'pending',
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'is_published' => fake()->boolean(80),
            'published_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'updated_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    public function pending()
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function verifying() // mapped to On Hold
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'verifying',
        ]);
    }

    public function verified() // mapped to Completed
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'verified',
        ]);
    }

    public function approved()
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'approved',
            'approval_notes' => 'تمت الموافقة بعد التحقق من المستندات المرفقة.',
        ]);
    }

    public function rejected()
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => 'عدم اكتمال الأوراق الثبوتية أو عدم تطابق الشروط.',
        ]);
    }
}
