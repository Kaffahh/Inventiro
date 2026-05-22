<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = User::with('role')->latest()->paginate(20)->withQueryString();
        $roles = Role::all();

        return Inertia::render('UserManagement/Index', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

        // Audit
        Audit::create([
            'user_id' => $request->user()->id,
            'transaksi_id' => null,
            'action' => 'user.create',
            'meta' => ['created_user_id' => $user->id, 'role_id' => $user->role_id],
        ]);

        return redirect()->back()->with('success', 'User berhasil dibuat.');
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = bcrypt($validated['password']);
        }

        $user->update($data);

        Audit::create([
            'user_id' => $request->user()->id,
            'transaksi_id' => null,
            'action' => 'user.update',
            'meta' => ['updated_user_id' => $user->id, 'role_id' => $user->role_id],
        ]);

        return redirect()->back()->with('success', 'User berhasil diupdate.');
    }

    public function destroy(Request $request, User $user)
    {
        $this->authorize('delete', $user);

        $userId = $user->id;
        $user->delete();

        Audit::create([
            'user_id' => $request->user()->id,
            'transaksi_id' => null,
            'action' => 'user.delete',
            'meta' => ['deleted_user_id' => $userId],
        ]);

        return redirect()->back()->with('success', 'User berhasil dihapus.');
    }
}
