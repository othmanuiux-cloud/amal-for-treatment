<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('is_active');
            $table->text('rejection_reason')->nullable()->after('status');
        });

        // Sync existing is_active to status
        \DB::table('users')->where('is_active', true)->update(['status' => 'active']);
        \DB::table('users')->where('is_active', false)->where('role', 'volunteer')->update(['status' => 'pending']);
        \DB::table('users')->where('is_active', false)->where('role', '!=', 'volunteer')->update(['status' => 'disabled']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'rejection_reason']);
        });
    }
};
