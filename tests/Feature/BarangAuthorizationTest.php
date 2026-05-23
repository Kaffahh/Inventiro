<?php

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Role;
use App\Models\User;

if (! function_exists('makeUserWithRole')) {
    function makeUserWithRole(string $slug): User
    {
        $role = Role::firstOrCreate([
            'slug' => $slug,
        ], [
            'name' => ucfirst($slug).' Role',
        ]);

        return User::factory()->create([
            'name' => ucfirst($slug).' User',
            'email' => $slug.'@inventiro.test',
            'password' => bcrypt($slug),
            'role_id' => $role->id,
        ]);
    }
}

it('allows admin to manage barang', function () {
    $admin = makeUserWithRole('admin');

    $kategori = Kategori::create(['name' => 'K1', 'slug' => 'k1']);
    $gudang = Gudang::create(['name' => 'G1', 'alamat' => 'Alamat']);

    $barang = Barang::create([
        'name' => 'Barang Lama',
        'sku' => 'SKU-001',
        'kategori_id' => $kategori->id,
        'gudang_id' => $gudang->id,
        'stok' => 10,
        'min_stok' => 1,
    ]);

    $this->actingAs($admin)
        ->get(route('barang.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('barang.store'), [
            'name' => 'Barang Baru',
            'sku' => 'SKU-NEW',
            'kategori_id' => $kategori->id,
            'gudang_id' => $gudang->id,
            'stok' => 5,
            'min_stok' => 0,
        ])
        ->assertRedirect(route('barang.index'));

    $this->actingAs($admin)
        ->put(route('barang.update', $barang), [
            'name' => 'Barang Updated',
            'sku' => $barang->sku,
            'kategori_id' => $kategori->id,
            'gudang_id' => $gudang->id,
            'stok' => 20,
            'min_stok' => 1,
        ])
        ->assertRedirect(route('barang.index'));

    $this->actingAs($admin)
        ->delete(route('barang.destroy', $barang))
        ->assertRedirect(route('barang.index'));
});

it('forbids staff from creating updating and deleting barang', function () {
    $staff = makeUserWithRole('staff');

    $kategori = Kategori::create(['name' => 'K2', 'slug' => 'k2']);
    $gudang = Gudang::create(['name' => 'G2', 'alamat' => 'Alamat2']);

    $barang = Barang::create([
        'name' => 'Barang Staff',
        'sku' => 'SKU-STAFF',
        'kategori_id' => $kategori->id,
        'gudang_id' => $gudang->id,
        'stok' => 3,
        'min_stok' => 1,
    ]);

    $this->actingAs($staff)
        ->get(route('barang.index'))
        ->assertOk();

    $this->actingAs($staff)
        ->post(route('barang.store'), [
            'name' => 'Barang Forbidden',
            'sku' => 'SKU-FORB',
            'kategori_id' => $kategori->id,
            'gudang_id' => $gudang->id,
            'stok' => 1,
            'min_stok' => 0,
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->put(route('barang.update', $barang), [
            'name' => 'Barang Forbidden Update',
            'sku' => $barang->sku,
            'kategori_id' => $kategori->id,
            'gudang_id' => $gudang->id,
            'stok' => 5,
            'min_stok' => 1,
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->delete(route('barang.destroy', $barang))
        ->assertForbidden();
});
