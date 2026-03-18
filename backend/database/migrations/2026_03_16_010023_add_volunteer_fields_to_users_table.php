<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('city')->nullable()->after('country');
            $table->boolean('available_for_cases')->default(false)->after('city');
            $table->integer('assigned_cases_count')->default(0)->after('available_for_cases');
            $table->timestamp('last_assigned_at')->nullable()->after('assigned_cases_count');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['city', 'available_for_cases', 'assigned_cases_count', 'last_assigned_at']);
        });
    }
};
