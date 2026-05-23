<?php

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Role;
use App\Models\User;
use App\Models\Transaksi;

if (! function_exists('makeUserWithRole')) {
    function makeUserWithRole(string $slug): User
    {
        $role = Role::firstOrCreate(['slug' => $slug], ['name' => ucfirst($slug) . ' Role']);
        return User::factory()->create(['role_id' => $role->id, 'email' => $slug . '@inventiro.test', 'password' => bcrypt($slug)]);
    }
}

it('allows admin to perform stok masuk and updates stock', function () {
    $admin = makeUserWithRole('admin');
    $kategori = Kategori::create(['name' => 'K1', 'slug' => 'k1']);
    $gudang = Gudang::create(['name' => 'G1', 'alamat' => 'a']);
    $barang = Barang::create(['name' => 'B1', 'sku' => 'S1', 'kategori_id' => $kategori->id, 'gudang_id' => $gudang->id, 'stok' => 0, 'min_stok' => 0]);

    $this->actingAs($admin)
        ->post(route('stok.masuk'), [
            'gudang_id' => $gudang->id,
            'items' => [ ['barang_id' => $barang->id, 'jumlah' => 5] ]
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('transaksis', ['tipe' => 'masuk']);
    $this->assertEquals(5, $barang->fresh()->stok);
});

it('allows staff to perform stok keluar when sufficient and prevents if insufficient', function () {
    $staff = makeUserWithRole('staff');
    $kategori = Kategori::create(['name' => 'K2', 'slug' => 'k2']);
    $gudang = Gudang::create(['name' => 'G2', 'alamat' => 'a2']);
    $barang = Barang::create(['name' => 'B2', 'sku' => 'S2', 'kategori_id' => $kategori->id, 'gudang_id' => $gudang->id, 'stok' => 10, 'min_stok' => 0]);

    // Successful keluar
    $this->actingAs($staff)
        ->post(route('stok.keluar'), [
            'gudang_id' => $gudang->id,
            'items' => [ ['barang_id' => $barang->id, 'jumlah' => 3] ]
        ])
        ->assertRedirect();

    $this->assertEquals(7, $barang->fresh()->stok);

    // Insufficient stock should return error flash
    $this->actingAs($staff)
        ->post(route('stok.keluar'), [
            'gudang_id' => $gudang->id,
            'items' => [ ['barang_id' => $barang->id, 'jumlah' => 100] ]
        ])
        ->assertRedirect()
        ->assertSessionHas('error');
});
