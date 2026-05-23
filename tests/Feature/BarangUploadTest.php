<?php

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

it('stores uploaded image and saves storage path', function () {
    Storage::fake('public');

    $admin = makeUserWithRole('admin');
    $kategori = Kategori::create(['name' => 'K-Upload', 'slug' => 'k-upload']);
    $gudang = Gudang::create(['name' => 'G-Upload', 'alamat' => 'Alamat']);

    $file = UploadedFile::fake()->image('foto.jpg')->size(500); // 500 KB

    $this->actingAs($admin)
        ->post(route('barang.store'), [
            'name' => 'Barang Upload Test',
            'sku' => 'SKU-UP-1',
            'kategori_id' => $kategori->id,
            'gudang_id' => $gudang->id,
            'stok' => 1,
            'min_stok' => 0,
            'foto' => $file,
        ])
        ->assertRedirect(route('barang.index'));

    $this->assertDatabaseHas('barangs', ['name' => 'Barang Upload Test']);

    $barang = Barang::where('name', 'Barang Upload Test')->first();
    expect($barang)->not->toBeNull();

    // Raw stored value should point to storage path (e.g. barangs/xxx.jpg)
    $stored = $barang->getRawOriginal('foto');
    expect($stored)->not->toBeNull();

    Storage::disk('public')->assertExists($stored);
});
