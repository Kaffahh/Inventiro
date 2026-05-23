<?php

use App\Models\Transaksi;
use App\Models\Gudang;
use App\Models\User;
use App\Models\Kategori;
use App\Models\Barang;

beforeEach(function () {
    //
});

it('allows admin to approve transaksi and records audit', function () {
    $role = \App\Models\Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $admin = User::factory()->create(['role_id' => $role->id]);

    $kategori = Kategori::create(['name' => 'Kx', 'slug' => 'kx']);
    $gudang = Gudang::create(['name' => 'Gx', 'alamat' => 'a']);
    $barang = Barang::create(['name' => 'Bx', 'sku' => 'SX', 'kategori_id' => $kategori->id, 'gudang_id' => $gudang->id, 'stok' => 0, 'min_stok' => 0]);

    $transaksi = Transaksi::create([
        'user_id' => $admin->id,
        'gudang_id' => $gudang->id,
        'tipe' => 'masuk',
        'status' => 'pending',
        'tgl_transaksi' => now(),
    ]);

    $this->actingAs($admin)
        ->post(route('stok.approve', $transaksi))
        ->assertRedirect();

    $this->assertDatabaseHas('transaksis', ['id' => $transaksi->id, 'status' => 'approved']);
    $this->assertDatabaseHas('audits', ['transaksi_id' => $transaksi->id, 'action' => 'approve']);
});

it('forbids staff from approving transaksi', function () {
    $role = \App\Models\Role::firstOrCreate(['slug' => 'staff'], ['name' => 'Staff']);
    $staff = User::factory()->create(['role_id' => $role->id]);

    $kategori = Kategori::create(['name' => 'Ky', 'slug' => 'ky']);
    $gudang = Gudang::create(['name' => 'Gy', 'alamat' => 'a2']);

    $transaksi = Transaksi::create([
        'user_id' => $staff->id,
        'gudang_id' => $gudang->id,
        'tipe' => 'keluar',
        'status' => 'pending',
        'tgl_transaksi' => now(),
    ]);

    $this->actingAs($staff)
        ->post(route('stok.approve', $transaksi))
        ->assertStatus(403);
});
