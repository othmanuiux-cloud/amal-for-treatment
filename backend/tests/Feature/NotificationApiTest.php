<?php

namespace Tests\Feature;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_notifications_returns_list(): void
    {
        $user = User::factory()->create();
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'message' => 'This is a test notification',
            'type' => 'case_submitted',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/notifications');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'title', 'message', 'type', 'read_at', 'created_at']
            ]
        ]);
    }

    public function test_mark_as_read_updates_read_at(): void
    {
        $user = User::factory()->create();
        $notification = Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification',
            'message' => 'This is a test notification',
            'type' => 'case_submitted',
            'read_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/notifications/{$notification->id}/read");

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Notification marked as read']);

        $this->assertNotNull($notification->fresh()->read_at);
    }

    public function test_mark_all_as_read_updates_all(): void
    {
        $user = User::factory()->create();
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification 1',
            'message' => 'Test message 1',
            'type' => 'case_submitted',
        ]);
        Notification::create([
            'user_id' => $user->id,
            'title' => 'Test Notification 2',
            'message' => 'Test message 2',
            'type' => 'case_approved',
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson('/api/notifications/read-all');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'All notifications marked as read']);

        $this->assertTrue($user->userNotifications()->whereNull('read_at')->count() === 0);
    }
}