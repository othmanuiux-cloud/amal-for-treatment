<?php
use App\Models\MedicalCase;
use App\Models\CaseStatusHistory;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

header('Content-Type: application/json');

try {
    $admin = User::where('email', 'admin@example.com')->first();
    if (!$admin) {
        throw new Exception("Admin user not found.");
    }

    // Try to create a test case
    $case = MedicalCase::create([
        'user_id' => $admin->id,
        'patient_name' => 'Auto Test Patient',
        'patient_file_number' => 'TEST-001',
        'disease' => 'Testing Disease',
        'hospital_name' => 'Test Hospital',
        'hospital_country' => 'Yemen',
        'status' => 'pending',
        'description' => 'Test case created via debug script',
        'consent_given' => true,
        'consent_date' => now(),
    ]);

    $history = CaseStatusHistory::create([
        'medical_case_id' => $case->id,
        'new_status' => 'pending',
        'changed_by' => $admin->id,
        'notes' => 'Test history entry',
    ]);

    echo json_encode([
        'status' => 'success',
        'case_id' => $case->id,
        'history_id' => $history->id,
        'patient_file_number' => $case->patient_file_number,
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
