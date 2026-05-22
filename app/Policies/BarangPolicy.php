<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Barang;

class BarangPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function view(User $user, Barang $barang): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function create(User $user): bool
    {
        return $user->role?->slug === 'admin';
    }

    public function update(User $user, Barang $barang): bool
    {
        return $user->role?->slug === 'admin';
    }

    public function delete(User $user, Barang $barang): bool
    {
        return $user->role?->slug === 'admin';
    }
}
