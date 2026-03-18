<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('patient_name');
            $table->unsignedSmallInteger('patient_age')->nullable();
            $table->enum('patient_gender', ['male', 'female', 'other'])->nullable();
            $table->string('disease', 500);
            $table->string('disease_category', 200)->nullable();
            $table->string('hospital_name', 500);
            $table->string('hospital_country', 100);
            $table->text('hospital_address')->nullable();
            $table->decimal('estimated_cost', 12, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            $table->text('description');
            $table->enum('status', ['pending', 'verifying', 'verified', 'approved', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->text('approval_notes')->nullable();
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('consent_given')->default(false);
            $table->timestamp('consent_date')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('hospital_country');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_cases');
    }
};
