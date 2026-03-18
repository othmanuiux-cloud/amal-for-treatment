<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\VolunteerController;
use App\Http\Controllers\Api\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

Route::get('/cases/published', [CaseController::class, 'publishedCases']);
Route::get('/public/cases/{id}', [CaseController::class, 'showPublic']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/cases/my', [CaseController::class, 'index']);
    Route::post('/cases', [CaseController::class, 'store']);
    Route::get('/cases/{medicalCase}', [CaseController::class, 'show']);
    Route::put('/cases/{medicalCase}', [CaseController::class, 'update']);
    Route::delete('/cases/{medicalCase}', [CaseController::class, 'destroy']);

    Route::post('/cases/{medicalCase}/documents', [DocumentController::class, 'upload']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'downloadSignedUrl']);
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy']);

    Route::prefix('volunteer')->group(function () {
        Route::get('/cases', [VolunteerController::class, 'cases']);
        Route::get('/cases/{medicalCase}', [VolunteerController::class, 'show']);
        Route::post('/cases/{medicalCase}/start', [VolunteerController::class, 'startVerification']);
        Route::post('/cases/{medicalCase}/verify', [VolunteerController::class, 'submitVerification']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::get('/users/{user}', [AdminController::class, 'getUser']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
        Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::put('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::put('/users/{user}/reject', [AdminController::class, 'rejectVolunteer']);
        Route::post('/users/bulk-status', [AdminController::class, 'bulkUpdateUserStatus']);

        Route::get('/cases/approval', [AdminController::class, 'casesForApproval']);
        Route::get('/cases/{medicalCase}', [AdminController::class, 'getCase']);
        Route::put('/cases/{medicalCase}', [AdminController::class, 'updateCase']);
        Route::delete('/cases/{medicalCase}', [AdminController::class, 'deleteCase']);
        Route::put('/cases/{medicalCase}/approve', [AdminController::class, 'approveCase']);
        Route::put('/cases/{medicalCase}/reject', [AdminController::class, 'rejectCase']);

        Route::get('/statistics', [AdminController::class, 'statistics']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
        Route::post('/settings/logo', [SettingController::class, 'uploadLogo']);
    });

    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread', [NotificationController::class, 'unread']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
    });
});
