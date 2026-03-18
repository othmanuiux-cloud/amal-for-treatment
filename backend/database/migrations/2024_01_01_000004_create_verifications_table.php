<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medical_case_id')->constrained('medical_cases')->onDelete('cascade');
            $table->foreignId('volunteer_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('verification_notes')->nullable();
            $table->string('evidence_file_path', 500)->nullable();
            $table->boolean('is_first_verifier')->default(false);
            $table->timestamps();

            $table->unique(['medical_case_id', 'volunteer_id']);
            $table->index('medical_case_id');
            $table->index('volunteer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verifications');
    }
};
