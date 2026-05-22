<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Gudang;

class GudangPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff']);
    }

    public function view(User $user, Gudang $gudang): bool
    {
        return in_array($user->role, ['admin', 'staff']);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Gudang $gudang): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Gudang $gudang): bool
    {
        return $user->role === 'admin';
    }
}
