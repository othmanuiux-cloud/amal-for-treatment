<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('role', 'patient')->first();
if (!$user) {
    $user = \App\Models\User::factory()->create(['role' => 'patient']);
}

$case = \App\Models\MedicalCase::create([
    'user_id' => $user->id,
    'patient_name' => 'سالم عبد الرحمن',
    'patient_age' => 45,
    'patient_gender' => 'male',
    'disease' => 'زراعة كلى عاجلة',
    'disease_category' => 'عمليات جراحية',
    'hospital_name' => 'مستشفى الملك فيصل التخصصي',
    'hospital_country' => 'السعودية - الرياض',
    'hospital_address' => 'الرياض',
    'estimated_cost' => 150000,
    'currency' => 'SAR',
    'description' => 'المريض بحاجة ماسة لعملية زراعة كلى لإنقاذ حياته. متبرع جاهز ولكن التكاليف كعمر طبي تتجاوز القدرة المالية للأسرة.',
    'status' => 'approved',
    'priority' => 'urgent',
    'is_published' => true,
    'published_at' => now(),
    'approval_notes' => 'تم استيفاء جميع الشروط والمستندات الطبية.',
]);

echo "Created Case ID: " . $case->id;
