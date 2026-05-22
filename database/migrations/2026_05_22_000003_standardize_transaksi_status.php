<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Convert any legacy 'completed' values to 'approved', then remove 'completed' from enum
        DB::statement("UPDATE `transaksis` SET `status` = 'approved' WHERE `status` = 'completed'");
        DB::statement("ALTER TABLE `transaksis` MODIFY `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Re-add 'completed' to the enum
        DB::statement("ALTER TABLE `transaksis` MODIFY `status` ENUM('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending'");
    }
};
