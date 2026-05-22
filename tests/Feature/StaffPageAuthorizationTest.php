<?php

use App\Models\Role;
use App\Models\User;

if (! function_exists('makeUserWithRoleStaffPage')) {
    function makeUserWithRoleStaffPage(string $slug): User
    {
        $role = Role::firstOrCreate([
            'slug' => $slug,
        ], [
            'name' => ucfirst($slug) . ' Role',
        ]);

        return User::factory()->create([
            'name' => ucfirst($slug) . ' User',
            'email' => $slug . '.staff.page@inventiro.test',
            'password' => bcrypt($slug),
            'role_id' => $role->id,
        ]);
    }
}

it('allows staff to access staff page', function () {
    $staff = makeUserWithRoleStaffPage('staff');

    $this->actingAs($staff)
        ->get(route('staff.index'))
        ->assertOk();
});

it('forbids admin from accessing staff page', function () {
    $admin = makeUserWithRoleStaffPage('admin');

    $this->actingAs($admin)
        ->get(route('staff.index'))
        ->assertForbidden();
});

it('redirects guest from staff page to login', function () {
    $this->get(route('staff.index'))
        ->assertRedirect(route('login'));
});
