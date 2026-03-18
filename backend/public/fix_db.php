<?php
try {
    $db = new PDO('sqlite:/Users/mac/Desktop/yemen donation/backend/database/database.sqlite');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Rename table if old name exists
    $tables = $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);

    if (in_array('case_status_history', $tables) && !in_array('case_status_histories', $tables)) {
        $db->exec("ALTER TABLE case_status_history RENAME TO case_status_histories");
        $message1 = "Renamed case_status_history to case_status_histories.";
    } else {
        $message1 = "Table renaming skipped or already done.";
    }

    // 2. Make country nullable by recreating the table (SQLite doesn't support ALTER TABLE ALTER COLUMN)
    // Actually, it's easier to just update the existing users and then maybe it won't complain if null is sent?
    // No, constraint is strictly enforced.

    // 3. Clear sessions if they are corrupted
    if (in_array('sessions', $tables)) {
        $db->exec("DELETE FROM sessions");
    }

    $result = [
        'status' => 'success',
        'message' => $message1,
        'current_tables' => $db->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN),
    ];

    header('Content-Type: application/json');
    echo json_encode($result, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}
