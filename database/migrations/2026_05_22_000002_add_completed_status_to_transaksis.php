<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add 'completed' to the enum list for status
        DB::statement("ALTER TABLE `transaksis` MODIFY `status` ENUM('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Revert by removing 'completed'
        DB::statement("ALTER TABLE `transaksis` MODIFY `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");
    }
};
