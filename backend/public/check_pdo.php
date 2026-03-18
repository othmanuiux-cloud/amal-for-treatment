<?php
try {
    $db = new PDO('sqlite:/Users/mac/Desktop/yemen donation/backend/database/database.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);

    $result = [
        'tables' => $tables,
        'medical_cases_columns' => [],
        'case_status_history_columns' => [],
    ];

    if (in_array('medical_cases', $tables)) {
        $result['medical_cases_columns'] = $db->query("PRAGMA table_info(medical_cases)")->fetchAll(PDO::FETCH_ASSOC);
    }

    if (in_array('case_status_history', $tables)) {
        $result['case_status_history_columns'] = $db->query("PRAGMA table_info(case_status_history)")->fetchAll(PDO::FETCH_ASSOC);
    }

    if (in_array('case_status_histories', $tables)) {
        $result['case_status_histories_columns'] = $db->query("PRAGMA table_info(case_status_histories)")->fetchAll(PDO::FETCH_ASSOC);
    }

    header('Content-Type: application/json');
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
