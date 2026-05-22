<?php

use App\Models\Role;
use App\Models\User;

if (! function_exists('makeUserWithRole')) {
    function makeUserWithRole(string $slug): User
    {
        $role = Role::firstOrCreate([
            'slug' => $slug
        ], [
            'name' => ucfirst($slug) . ' Role'
        ]);

        return User::factory()->create([
            'name' => ucfirst($slug) . ' User',
            'email' => $slug . '@inventiro.test',
            'password' => bcrypt($slug),
            'role_id' => $role->id,
        ]);
    }
}

it('allows admin to create update and delete users', function () {
    $admin = makeUserWithRole('admin');

    $this->actingAs($admin)->get(route('users.index'))->assertOk();

    $role = Role::firstOrCreate(['slug' => 'staff'], ['name' => 'Staff']);

    $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New Staff',
        'email' => 'staff2@inventiro.test',
        'password' => 'password',
        'role_id' => $role->id,
    ])->assertRedirect();

    $new = User::where('email', 'staff2@inventiro.test')->firstOrFail();

    $this->actingAs($admin)->put(route('users.update', $new), [
        'name' => 'Staff Updated',
        'email' => $new->email,
        'role_id' => $role->id,
    ])->assertRedirect();

    $this->actingAs($admin)->delete(route('users.destroy', $new))->assertRedirect();
});

it('forbids staff from managing users', function () {
    $staff = makeUserWithRole('staff');

    $this->actingAs($staff)->get(route('users.index'))->assertForbidden();

    $role = Role::firstOrCreate(['slug' => 'staff'], ['name' => 'Staff']);

    $this->actingAs($staff)->post(route('users.store'), [
        'name' => 'New',
        'email' => 'x@inventiro.test',
        'password' => 'password',
        'role_id' => $role->id,
    ])->assertForbidden();
});
