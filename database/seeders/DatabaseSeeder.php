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
        $adminRole = Role::firstOrCreate([
            'slug' => 'admin',
        ], [
            'name' => 'Admin Gudang',
        ]);

        $staffRole = Role::firstOrCreate([
            'slug' => 'staff',
        ], [
            'name' => 'Staff Gudang',
        ]);
        // Ensure admin user exists before seeding dummy transactions
        User::firstOrCreate([
            'email' => 'admin@inventiro.com',
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('admin'),
            'role_id' => $adminRole->id,
        ]);

        // Seed initial dummy data (kategoris, gudangs, barangs, transaksi)
        $this->call([
            DummyDataSeeder::class,
        ]);

        $firstGudang = \App\Models\Gudang::first();

        // Seed Staff User and assign to first gudang when available
        User::firstOrCreate([
            'email' => 'staff@inventiro.com',
        ], [
            'name' => 'Staff User',
            'password' => Hash::make('staff'),
            'role_id' => $staffRole->id,
            'gudang_id' => $firstGudang? $firstGudang->id : null,
        ]);
    }
}
