<?php

namespace App\Helpers;

use App\Models\Notification;

class NotificationHelper
{
    public static function createNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $data = null
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function caseSubmitted(int $userId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $userId,
            'info',
            'تم تقديم حالة جديدة',
            "تم تقديم حالة {$patientName} بنجاح بانتظار المراجعة.",
            ['case_id' => $caseId]
        );
    }

    public static function caseUnderReview(int $userId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $userId,
            'info',
            'حالتك قيد المراجعة',
            "حالة {$patientName} قيد المراجعة من قِبل المتطوعين.",
            ['case_id' => $caseId]
        );
    }

    public static function caseVerified(int $userId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $userId,
            'success',
            'تم التحقق من حالتك',
            "تم التحقق من حالة {$patientName} بنجاح.",
            ['case_id' => $caseId]
        );
    }

    public static function caseApproved(int $userId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $userId,
            'success',
            'تم اعتماد حالتك',
            "تم اعتماد حالة {$patientName} ونشرها للتبرع.",
            ['case_id' => $caseId]
        );
    }

    public static function caseRejected(int $userId, int $caseId, string $patientName, string $reason): void
    {
        self::createNotification(
            $userId,
            'warning',
            'تم رفض حالتك',
            "تم رفض حالة {$patientName}. السبب: {$reason}",
            ['case_id' => $caseId]
        );
    }

    public static function casePublished(int $userId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $userId,
            'success',
            'تم نشر حالتك',
            "تم نشر حالة {$patientName} الآن يمكن للتبرع.",
            ['case_id' => $caseId]
        );
    }

    public static function newCaseForReview(int $volunteerUserId, int $caseId, string $patientName): void
    {
        self::createNotification(
            $volunteerUserId,
            'info',
            'حالة جديدة للمراجعة',
            "يوجد حالة جديدة لـ {$patientName} تحتاج مراجعة.",
            ['case_id' => $caseId]
        );
    }

    public static function caseAssignedToVolunteer(
        int $volunteerUserId, 
        int $caseId, 
        string $patientName,
        string $country,
        string $city
    ): void
    {
        self::createNotification(
            $volunteerUserId,
            'info',
            '🦸 حالة جديدة أُسندت لك',
            "تم إسناد حالة {$patientName} من {$country} - {$city} للمراجعة.",
            ['case_id' => $caseId, 'type' => 'assignment']
        );
    }

    public static function caseReassigned(int $volunteerUserId, int $caseId, string $patientName, string $reason): void
    {
        self::createNotification(
            $volunteerUserId,
            'warning',
            '🔄 إعادة إسناد حالة',
            "تم إعادة إسناد حالة {$patientName}. السبب: {$reason}",
            ['case_id' => $caseId, 'type' => 'reassignment']
        );
    }
}
