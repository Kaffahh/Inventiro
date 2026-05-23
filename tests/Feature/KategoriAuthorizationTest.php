<?php

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

it('allows admin to manage kategori', function () {
    $admin = makeUserWithRole('admin');
    $kategori = Kategori::create([
        'name' => 'Kategori Lama',
        'slug' => 'kategori-lama',
    ]);

    $this->actingAs($admin)
        ->get(route('kategori.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('kategori.store'), [
            'name' => 'Kategori Baru',
        ])
        ->assertRedirect(route('kategori.index'));

    $this->actingAs($admin)
        ->put(route('kategori.update', $kategori), [
            'name' => 'Kategori Updated',
        ])
        ->assertRedirect(route('kategori.index'));

    $this->actingAs($admin)
        ->delete(route('kategori.destroy', $kategori))
        ->assertRedirect(route('kategori.index'));
});

it('forbids staff from creating updating and deleting kategori', function () {
    $staff = makeUserWithRole('staff');
    $kategori = Kategori::create([
        'name' => 'Kategori Staff',
        'slug' => 'kategori-staff',
    ]);

    $this->actingAs($staff)
        ->get(route('kategori.index'))
        ->assertOk();

    $this->actingAs($staff)
        ->post(route('kategori.store'), [
            'name' => 'Kategori Forbidden',
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->put(route('kategori.update', $kategori), [
            'name' => 'Kategori Forbidden Update',
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->delete(route('kategori.destroy', $kategori))
        ->assertForbidden();
});
