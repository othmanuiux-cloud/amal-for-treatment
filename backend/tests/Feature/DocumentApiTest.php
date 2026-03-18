<?php

namespace Tests\Feature;

use App\Models\CaseDocument;
use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('private');
    }

    public function test_upload_file_saves_and_appears_in_list(): void
    {
        $user = User::factory()->create();
        $medicalCase = MedicalCase::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('test.pdf', 1024);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/cases/{$medicalCase->id}/documents", [
                'file' => $file,
                'file_type' => 'medical_report',
            ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'document' => ['id', 'file_name', 'mime_type', 'file_type', 'file_size']
        ]);

        $this->assertDatabaseHas('case_documents', [
            'medical_case_id' => $medicalCase->id,
            'original_name' => 'test.pdf',
            'file_type' => 'medical_report',
        ]);
    }

    public function test_upload_validates_file_size_and_type(): void
    {
        $user = User::factory()->create();
        $medicalCase = MedicalCase::factory()->create(['user_id' => $user->id]);

        $file = UploadedFile::fake()->create('test.exe', 10240);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/cases/{$medicalCase->id}/documents", [
                'file' => $file,
                'file_type' => 'medical_report',
            ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    public function test_delete_file_removes_document(): void
    {
        $user = User::factory()->create();
        $medicalCase = MedicalCase::factory()->create(['user_id' => $user->id]);

        $document = CaseDocument::create([
            'medical_case_id' => $medicalCase->id,
            'file_path' => 'test/path.pdf',
            'file_disk' => 'private',
            'original_name' => 'test.pdf',
            'mime_type' => 'application/pdf',
            'file_type' => 'medical_report',
            'file_size' => 1024,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/documents/{$document->id}");

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Document deleted successfully']);

        $this->assertNull(CaseDocument::find($document->id));
    }

    public function test_preview_file_returns_signed_url(): void
    {
        $user = User::factory()->create();
        $medicalCase = MedicalCase::factory()->create(['user_id' => $user->id]);

        $document = CaseDocument::create([
            'medical_case_id' => $medicalCase->id,
            'file_path' => 'test/path.pdf',
            'file_disk' => 'private',
            'original_name' => 'test.pdf',
            'mime_type' => 'application/pdf',
            'file_type' => 'medical_report',
            'file_size' => 1024,
        ]);

        Storage::shouldReceive('disk')
            ->with('private')
            ->andReturnSelf();
        Storage::shouldReceive('temporaryUrl')
            ->once()
            ->andReturn('https://signed.url/file.pdf');

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/documents/{$document->id}/download");

        $response->assertStatus(200);
        $response->assertJsonStructure(['url', 'expires_at']);
    }
}