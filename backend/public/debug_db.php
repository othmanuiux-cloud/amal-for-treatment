<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use App\Models\User;
use App\Models\MedicalCase;
use Illuminate\Support\Facades\Schema;

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Manually initialize database connection if needed
$db = $app->make('db');

header('Content-Type: application/json');

try {
    $tables = $db->select("SELECT name FROM sqlite_master WHERE type='table'");
    $tables = array_column($tables, 'name');

    $result = [
        'tables' => $tables,
        'case_status_history_exists' => in_array('case_status_history', $tables),
        'case_status_histories_exists' => in_array('case_status_histories', $tables),
        'medical_cases_columns' => $db->getSchemaBuilder()->getColumnListing('medical_cases'),
        'users_count' => $db->table('users')->count(),
        'admin_exists' => $db->table('users')->where('email', 'admin@example.com')->exists(),
    ];
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
