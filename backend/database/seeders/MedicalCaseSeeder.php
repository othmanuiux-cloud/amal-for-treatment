<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicalCaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();

        if ($users->isEmpty()) {
            $users = \App\Models\User::factory()->count(5)->create();
        }

        $userIds = $users->pluck('id')->toArray();

        foreach (range(1, 20) as $index) {
            \App\Models\MedicalCase::factory()->create([
                'user_id' => fake()->randomElement($userIds)
            ]);
        }

        // Create a few specific states
        foreach (range(1, 5) as $index) {
            \App\Models\MedicalCase::factory()->verifying()->create(['user_id' => fake()->randomElement($userIds)]);
        }
        foreach (range(1, 10) as $index) {
            \App\Models\MedicalCase::factory()->approved()->create(['user_id' => fake()->randomElement($userIds)]);
        }
        foreach (range(1, 5) as $index) {
            \App\Models\MedicalCase::factory()->verified()->create(['user_id' => fake()->randomElement($userIds)]);
        }
        foreach (range(1, 3) as $index) {
            \App\Models\MedicalCase::factory()->rejected()->create(['user_id' => fake()->randomElement($userIds)]);
        }
    }
}
