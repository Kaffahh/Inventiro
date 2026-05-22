<?php

use App\Models\Gudang;
use App\Models\Role;
use App\Models\User;

if (! function_exists('makeUserWithRoleGudang')) {
    function makeUserWithRoleGudang(string $slug): User
    {
        $role = Role::create([
            'name' => ucfirst($slug) . ' Gudang',
            'slug' => $slug,
        ]);

        return User::factory()->create([
            'name' => ucfirst($slug) . ' User',
            'email' => $slug . '@inventiro.test',
            'password' => bcrypt($slug),
            'role_id' => $role->id,
        ]);
    }
}

it('allows admin to manage gudang', function () {
    $admin = makeUserWithRoleGudang('admin');
    $gudang = Gudang::create([
        'name' => 'Gudang Utama',
        'alamat' => 'Jl. Test',
    ]);

    $this->actingAs($admin)
        ->get(route('gudang.index'))
        ->assertOk();

    $this->actingAs($admin)
        ->post(route('gudang.store'), [
            'name' => 'Gudang Baru',
            'alamat' => 'Alamat Baru',
        ])
        ->assertRedirect(route('gudang.index'));

    $this->actingAs($admin)
        ->put(route('gudang.update', $gudang), [
            'name' => 'Gudang Update',
            'alamat' => 'Alamat Update',
        ])
        ->assertRedirect(route('gudang.index'));

    $this->actingAs($admin)
        ->delete(route('gudang.destroy', $gudang))
        ->assertRedirect(route('gudang.index'));
});

it('forbids staff from creating updating and deleting gudang', function () {
    $staff = makeUserWithRole('staff');
    $gudang = Gudang::create([
        'name' => 'Gudang Staff',
        'alamat' => 'Jl. Staff',
    ]);

    $this->actingAs($staff)
        ->get(route('gudang.index'))
        ->assertOk();

    $this->actingAs($staff)
        ->post(route('gudang.store'), [
            'name' => 'Gudang Forbidden',
            'alamat' => 'Alamat Forbidden',
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->put(route('gudang.update', $gudang), [
            'name' => 'Gudang Forbidden Update',
            'alamat' => 'Alamat Forbidden Update',
        ])
        ->assertForbidden();

    $this->actingAs($staff)
        ->delete(route('gudang.destroy', $gudang))
        ->assertForbidden();
});
