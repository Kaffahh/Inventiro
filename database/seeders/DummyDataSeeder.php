<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Kategoris
        $kategoris = [
            ['name' => 'Elektronik', 'slug' => 'elektronik'],
            ['name' => 'Alat Kantor', 'slug' => 'alat-kantor'],
            ['name' => 'Aksesoris', 'slug' => 'aksesoris'],
        ];
        foreach ($kategoris as $k) Kategori::create($k);

        // 2. Seed Gudangs
        $gudangs = [
            ['name' => 'Gudang Utama', 'alamat' => 'Jakarta Selatan'],
            ['name' => 'Gudang Cabang Depok', 'alamat' => 'Margonda, Depok'],
        ];
        foreach ($gudangs as $g) Gudang::create($g);

        // 3. Seed Barangs
        $katElektronik = Kategori::where('slug', 'elektronik')->first();
        $katAksesoris = Kategori::where('slug', 'aksesoris')->first();
        $gudangUtama = Gudang::where('name', 'Gudang Utama')->first();
        $gudangDepok = Gudang::where('name', 'Gudang Cabang Depok')->first();

        $barangs = [
            [
                'name' => 'Laptop ASUS ROG',
                'sku' => 'LAP-ROG-001',
                'kategori_id' => $katElektronik->id,
                'gudang_id' => $gudangUtama->id,
                'stok' => 50,
                'min_stok' => 10,
            ],
            [
                'name' => 'Mouse Logitech G502',
                'sku' => 'MOU-LOG-002',
                'kategori_id' => $katAksesoris->id,
                'gudang_id' => $gudangUtama->id,
                'stok' => 100,
                'min_stok' => 15,
            ],
            [
                'name' => 'Monitor Dell 24"',
                'sku' => 'MON-DEL-003',
                'kategori_id' => $katElektronik->id,
                'gudang_id' => $gudangDepok->id,
                'stok' => 20,
                'min_stok' => 5,
            ],
        ];
        foreach ($barangs as $b) Barang::create($b);

        // 4. Seed Dummy Transactions for Statistics
        $admin = User::where('email', 'admin@inventiro.com')->first();
        $allBarangs = Barang::all();

        // Create transactions for the last 6 months
        for ($i = 0; $i < 60; $i++) {
            $tipe = rand(0, 1) ? 'masuk' : 'keluar';
            $tgl = Carbon::now()->subDays(rand(0, 180));

            $transaksi = Transaksi::create([
                'user_id' => $admin->id,
                'gudang_id' => rand(0, 1) ? $gudangUtama->id : $gudangDepok->id,
                'tipe' => $tipe,
                'status' => 'approved',
                'tgl_transaksi' => $tgl,
            ]);

            TransaksiDetail::create([
                'transaksi_id' => $transaksi->id,
                'barang_id' => $allBarangs->random()->id,
                'jumlah' => rand(1, 20),
            ]);
        }
    }
}
