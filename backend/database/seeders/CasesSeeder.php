<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CasesSeeder extends Seeder
{
    public function run(): void
    {
        // Check if a test user exists, otherwise create one
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'testcases@example.com'],
            [
                'name' => 'Test User Cases',
                'password' => bcrypt('password'),
                'role' => 'patient', // Assuming patients own cases
                'phone_encrypted' => encrypt('0500000000'),
            ]
        );

        // 2 Pending Cases (1 with a document)
        \App\Models\MedicalCase::factory()
            ->has(\App\Models\CaseDocument::factory()->count(2), 'documents')
            ->pending()
            ->create(['user_id' => $user->id]);
        \App\Models\MedicalCase::factory()->pending()->create(['user_id' => $user->id]);

        // 2 Approved Cases (both with documents)
        \App\Models\MedicalCase::factory()->count(2)
            ->has(\App\Models\CaseDocument::factory()->count(3), 'documents')
            ->approved()
            ->create(['user_id' => $user->id]);

        // 2 Rejected Cases
        \App\Models\MedicalCase::factory()->count(2)->rejected()->create(['user_id' => $user->id]);

        // 1 Completed Case (mapped to verified, with 1 document)
        \App\Models\MedicalCase::factory()
            ->has(\App\Models\CaseDocument::factory()->count(1), 'documents')
            ->verified()
            ->create(['user_id' => $user->id]);

        // 1 On Hold Case (mapped to verifying)
        \App\Models\MedicalCase::factory()->verifying()->create(['user_id' => $user->id]);

        $this->command->info('8 test cases have been seeded successfully for user testcases@example.com.');
    }
}
