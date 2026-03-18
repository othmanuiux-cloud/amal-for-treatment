<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class TestAccountsSeeder extends Seeder
{
    public function run()
    {
        $testAccounts = [
            [
                'name' => 'مسؤول تجريبي',
                'email' => 'admin.demo@yemen-donation.test',
                'password' => Hash::make('Demo@Admin2026!'),
                'role' => 'admin',
                'phone' => '+967700000001',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'متطوع تجريبي',
                'email' => 'volunteer.demo@yemen-donation.test',
                'password' => Hash::make('Demo@Vol2026!'),
                'role' => 'volunteer',
                'phone' => '+967700000002',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'مريض تجريبي',
                'email' => 'patient.demo@yemen-donation.test',
                'password' => Hash::make('Demo@Pat2026!'),
                'role' => 'patient',
                'phone' => '+967700000004',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($testAccounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                $account
            );
            
            $this->command->info("✅ Created: {$account['email']}");
        }
        
        $this->command->info("\n🔐 Test accounts created successfully!");
        $this->command->info("⚠️  These are DEMO accounts - change passwords before production!");
    }
}
