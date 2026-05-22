<?php

use App\Models\Audit;
use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

beforeEach(function () {
    Artisan::call('migrate:fresh');
});

it('creates an audit when stok masuk is recorded', function () {
    $role = \App\Models\Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $user = User::factory()->create(['role_id' => $role->id]);
    $kategori = Kategori::create(['name' => 'K1', 'slug' => 'k1']);
    $gudang = Gudang::create(['name' => 'G1', 'alamat' => 'alamat']);
    $barang = Barang::create([
        'name' => 'B1',
        'sku' => 'S1',
        'kategori_id' => $kategori->id,
        'gudang_id' => $gudang->id,
        'stok' => 0,
        'min_stok' => 0,
    ]);

    $this->actingAs($user)->post(route('stok.masuk'), [
        'gudang_id' => $gudang->id,
        'items' => [ ['barang_id' => $barang->id, 'jumlah' => 5] ],
    ])->assertStatus(302);

    $this->assertDatabaseHas('audits', [ 'action' => 'masuk' ]);
});
