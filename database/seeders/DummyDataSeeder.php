<?php

namespace Database\Seeders;

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

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
        foreach ($kategoris as $k) {
            Kategori::create($k);
        }

        // 2. Seed Gudangs
        $gudangs = [
            ['name' => 'Gudang Utama', 'alamat' => 'Jakarta Selatan'],
            ['name' => 'Gudang Cabang Depok', 'alamat' => 'Margonda, Depok'],
        ];
        foreach ($gudangs as $g) {
            Gudang::create($g);
        }

        // 3. Seed Barangs
        $katElektronik = Kategori::where('slug', 'elektronik')->first();
        $katAksesoris = Kategori::where('slug', 'aksesoris')->first();
        $gudangUtama = Gudang::where('name', 'Gudang Utama')->first();
        $gudangDepok = Gudang::where('name', 'Gudang Cabang Depok')->first();

        // create sample products in each gudang so each gudang has its own barang rows
        $baseProducts = [
            [
                'name' => 'Laptop ASUS ROG',
                'sku' => 'LAP-ROG-001',
                'kategori_id' => $katElektronik->id,
                'stok' => 50,
                'min_stok' => 10,
            ],
            [
                'name' => 'Mouse Logitech G502',
                'sku' => 'MOU-LOG-002',
                'kategori_id' => $katAksesoris->id,
                'stok' => 100,
                'min_stok' => 15,
            ],
            [
                'name' => 'Monitor Dell 24"',
                'sku' => 'MON-DEL-003',
                'kategori_id' => $katElektronik->id,
                'stok' => 20,
                'min_stok' => 5,
            ],
        ];

        $allGudangs = Gudang::all();
        foreach ($allGudangs as $g) {
            foreach ($baseProducts as $p) {
                Barang::create([
                    'name' => $p['name'] . ' (' . $g->name . ')',
                    'sku' => $p['sku'] . '-' . $g->id,
                    'kategori_id' => $p['kategori_id'],
                    'gudang_id' => $g->id,
                    'stok' => $p['stok'] + rand(-10, 20),
                    'min_stok' => $p['min_stok'],
                ]);
            }
        }

        // 4. Seed Dummy Transactions for Statistics
        $admin = User::where('email', 'admin@inventiro.com')->first();
        // Create transactions for the last 6 months — ensure details pick barang from the transaksi's gudang
        $allGudangs = Gudang::all();
        for ($i = 0; $i < 60; $i++) {
            $tipe = rand(0, 1) ? 'masuk' : 'keluar';
            $tgl = Carbon::now()->subDays(rand(0, 180));
            $g = $allGudangs->random();

            $transaksi = Transaksi::create([
                'user_id' => $admin->id,
                'gudang_id' => $g->id,
                'tipe' => $tipe,
                'status' => 'approved',
                'tgl_transaksi' => $tgl,
            ]);

            $barangInGudang = Barang::where('gudang_id', $g->id)->get();
            if ($barangInGudang->count() === 0) continue;

            TransaksiDetail::create([
                'transaksi_id' => $transaksi->id,
                'barang_id' => $barangInGudang->random()->id,
                'jumlah' => rand(1, 20),
            ]);
        }
    }
}
