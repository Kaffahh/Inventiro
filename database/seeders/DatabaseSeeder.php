<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Roles
        $adminRole = Role::create([
            'name' => 'Admin Gudang',
            'slug' => 'admin',
        ]);

        $staffRole = Role::create([
            'name' => 'Staff Gudang',
            'slug' => 'staff',
        ]);

        // Seed Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@inventiro.com',
            'password' => Hash::make('admin'),
            'role_id' => $adminRole->id,
        ]);

        // Seed Staff User
        User::create([
            'name' => 'Staff User',
            'email' => 'staff@inventiro.com',
            'password' => Hash::make('staff'),
            'role_id' => $staffRole->id,
        ]);

        $this->call([
            DummyDataSeeder::class,
        ]);
    }
}
