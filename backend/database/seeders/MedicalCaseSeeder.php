<?php

namespace Database\Seeders;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicalCaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereIn('role', ['patient', 'volunteer'])->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Run TestAccountsSeeder first.');
            return;
        }

        $userIds = $users->pluck('id')->toArray();

        $yemeniCases = [
            [
                'patient_name' => 'أحمد محمد علي',
                'patient_age' => 8,
                'patient_gender' => 'male',
                'disease' => 'فشل كلوي مزمن',
                'disease_category' => 'علاج مزمن',
                'hospital_name' => 'مستشفى الثورة',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'صنعاء',
                'estimated_cost' => 45000,
                'currency' => 'SAR',
                'description' => 'طفل يعاني من فشل كلوي ويحتاج لغسيل كلى أسبوعي ونقل إلى مركز زراعة الكلى.',
                'status' => 'approved',
                'priority' => 'urgent',
                'is_published' => true,
            ],
            [
                'patient_name' => 'فاطمة علي سعيد',
                'patient_age' => 35,
                'patient_gender' => 'female',
                'disease' => 'ورم في الثدي',
                'disease_category' => 'علاج كيماوي',
                'hospital_name' => 'مستشفىспублик',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'عدن',
                'estimated_cost' => 85000,
                'currency' => 'SAR',
                'description' => 'أم لثلاثة أطفال تحتاج جلسة كيماوي شهرية وتكلفة العلاج مرتفعة جداً.',
                'status' => 'approved',
                'priority' => 'high',
                'is_published' => true,
            ],
            [
                'patient_name' => 'محمد عبد الله',
                'patient_age' => 12,
                'patient_gender' => 'male',
                'disease' => 'تشوه خلقي في القلب',
                'disease_category' => 'عمليات جراحية',
                'hospital_name' => 'مستشفى الحكمة',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'صنعاء',
                'estimated_cost' => 120000,
                'currency' => 'SAR',
                'description' => 'طفل يحتاج عملية قلب مفتوح عاجلة بسبب تشوه خلقي في الصمامات.',
                'status' => 'approved',
                'priority' => 'urgent',
                'is_published' => true,
            ],
            [
                'patient_name' => 'خالد عمر游击',
                'patient_age' => 55,
                'patient_gender' => 'male',
                'disease' => 'ارتفاع ضغط الدم والسكر',
                'disease_category' => 'علاج مزمن',
                'hospital_name' => 'مستشفى السبعين',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'صنعاء',
                'estimated_cost' => 15000,
                'currency' => 'SAR',
                'description' => 'مريض يحتاج أدوية شهرية ومستلزمات طبية مستمرة.',
                'status' => 'approved',
                'priority' => 'medium',
                'is_published' => true,
            ],
            [
                'patient_name' => 'نورة حسن',
                'patient_age' => 6,
                'patient_gender' => 'female',
                'disease' => 'حالات حرجة',
                'disease_category' => 'طوارئ',
                'hospital_name' => 'مستشفى صدر',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'عدن',
                'estimated_cost' => 35000,
                'currency' => 'SAR',
                'description' => 'طفلة进入了 العناية المركزة وتحتاج تدخل طبي عاجل.',
                'status' => 'pending',
                'priority' => 'urgent',
                'is_published' => false,
            ],
            [
                'patient_name' => 'عمر سعيد',
                'patient_age' => 42,
                'patient_gender' => 'male',
                'disease' => 'التهاب كبدي مزمن',
                'disease_category' => 'علاج مزمن',
                'hospital_name' => 'مستشفى زايد',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'تعز',
                'estimated_cost' => 65000,
                'currency' => 'SAR',
                'description' => 'مريض يحتاج علاج طويل الأمد ومتابعة مستمرة في المستشفى.',
                'status' => 'verifying',
                'priority' => 'high',
                'is_published' => false,
            ],
            [
                'patient_name' => 'سارة محمد',
                'patient_age' => 28,
                'patient_gender' => 'female',
                'disease' => 'عملية استئصال ورم',
                'disease_category' => 'عمليات جراحية',
                'hospital_name' => 'مستشفى الأزهر',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'إب',
                'estimated_cost' => 55000,
                'currency' => 'SAR',
                'description' => 'شابة تحتاج عملية جراحية مستعجلة لاستئصال ورم.',
                'status' => 'approved',
                'priority' => 'high',
                'is_published' => true,
            ],
            [
                'patient_name' => 'علي أحمد',
                'patient_age' => 65,
                'patient_gender' => 'male',
                'disease' => 'قصور كلوي',
                'disease_category' => 'غسيل كلى',
                'hospital_name' => 'مستشفى الجماعي',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'الحديدة',
                'estimated_cost' => 28000,
                'currency' => 'SAR',
                'description' => 'مريض كبير السن يحتاج جلسات غسيل كلى أسبوعية.',
                'status' => 'approved',
                'priority' => 'high',
                'is_published' => true,
            ],
            [
                'patient_name' => 'حسن علي',
                'patient_age' => 15,
                'patient_gender' => 'male',
                'disease' => 'حالات العيون',
                'disease_category' => 'عمليات جراحية',
                'hospital_name' => 'مستشفى العيون التخصصي',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'صنعاء',
                'estimated_cost' => 22000,
                'currency' => 'SAR',
                'description' => 'مراهق يحتاج عملية في العين وتغيير عدسة.',
                'status' => 'approved',
                'priority' => 'medium',
                'is_published' => true,
            ],
            [
                'patient_name' => 'منى عبد الله',
                'patient_age' => 45,
                'patient_gender' => 'female',
                'disease' => 'أورام',
                'disease_category' => 'علاج كيماوي',
                'hospital_name' => 'مستشفى شقرة',
                'hospital_country' => 'اليمن',
                'hospital_city' => 'عدن',
                'estimated_cost' => 95000,
                'currency' => 'SAR',
                'description' => 'أم لخمسة أطفال تحتاج علاج كيماوي ومتابعة مستمرة.',
                'status' => 'approved',
                'priority' => 'urgent',
                'is_published' => true,
            ],
        ];

        $userIndex = 0;
        foreach ($yemeniCases as $caseData) {
            MedicalCase::create([
                ...$caseData,
                'user_id' => $userIds[$userIndex % count($userIds)],
                'published_at' => $caseData['is_published'] ? now() : null,
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
            $userIndex++;
        }

        $this->command->info('✅ Created ' . count($yemeniCases) . ' Yemeni medical cases');
    }
}