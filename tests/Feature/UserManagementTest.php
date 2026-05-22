<?php

use App\Models\Role;
use App\Models\User;
use App\Models\Audit;
use Illuminate\Support\Facades\Hash;

if (! function_exists('makeUserWithRoleUnique')) {
    function makeUserWithRoleUnique(string $slug): User
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
    $admin = makeUserWithRoleUnique('admin');

    $this->actingAs($admin)->get(route('users.index'))->assertOk();

    $role = Role::firstOrCreate(['slug' => 'staff'], ['name' => 'Staff']);

    $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New Staff',
        'email' => 'staff2@inventiro.test',
        'password' => 'password',
        'role_id' => $role->id,
    ])->assertRedirect();

    $new = User::where('email', 'staff2@inventiro.test')->firstOrFail();

    $this->assertDatabaseHas('audits', ['action' => 'user.create']);
    $createAudit = Audit::where('action', 'user.create')->latest()->first();
    expect($createAudit->meta['created_user_id'])->toBe($new->id);
    expect($createAudit->meta['role_id'])->toBe($role->id);
    expect($createAudit->user_id)->toBe($admin->id);

    $this->actingAs($admin)->put(route('users.update', $new), [
        'name' => 'Staff Updated',
        'email' => $new->email,
        'role_id' => $role->id,
    ])->assertRedirect();

    $this->assertDatabaseHas('audits', ['action' => 'user.update']);
    $updateAudit = Audit::where('action', 'user.update')->latest()->first();
    expect($updateAudit->meta['updated_user_id'])->toBe($new->id);
    expect($updateAudit->meta['role_id'])->toBe($role->id);
    expect($updateAudit->user_id)->toBe($admin->id);

    // also update password
    $this->actingAs($admin)->put(route('users.update', $new), [
        'name' => 'Staff Updated',
        'email' => $new->email,
        'role_id' => $role->id,
        'password' => 'newsecurepass',
    ])->assertRedirect();

    $this->assertTrue(Hash::check('newsecurepass', $new->fresh()->password));

    expect(Audit::where('action', 'user.update')->count())->toBe(2);

    $this->actingAs($admin)->delete(route('users.destroy', $new))->assertRedirect();

    $this->assertDatabaseHas('audits', ['action' => 'user.delete']);
    $deleteAudit = Audit::where('action', 'user.delete')->latest()->first();
    expect($deleteAudit->meta['deleted_user_id'])->toBe($new->id);
    expect($deleteAudit->user_id)->toBe($admin->id);
});

it('forbids staff from managing users', function () {
    $staff = makeUserWithRoleUnique('staff');

    $this->actingAs($staff)->get(route('users.index'))->assertForbidden();

    $role = Role::firstOrCreate(['slug' => 'staff'], ['name' => 'Staff']);

    $this->actingAs($staff)->post(route('users.store'), [
        'name' => 'New',
        'email' => 'x@inventiro.test',
        'password' => 'password',
        'role_id' => $role->id,
    ])->assertForbidden();

    $this->assertDatabaseMissing('audits', [
        'action' => 'user.create',
        'user_id' => $staff->id,
    ]);
});
