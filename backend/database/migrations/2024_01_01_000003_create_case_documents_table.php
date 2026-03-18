<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_case_id')->constrained('medical_cases')->onDelete('cascade');
            $table->string('file_path', 500);
            $table->string('file_disk', 50)->default('private');
            $table->string('original_name', 255);
            $table->string('mime_type', 100)->nullable();
            $table->enum('file_type', ['medical_report', 'prescription', 'lab_result', 'imaging', 'id_proof', 'other']);
            $table->unsignedInteger('file_size')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->index('medical_case_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_documents');
    }
};
