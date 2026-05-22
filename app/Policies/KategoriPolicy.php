<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Kategori;

class KategoriPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function view(User $user, Kategori $kategori): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function create(User $user): bool
    {
        return $user->role?->slug === 'admin';
    }

    public function update(User $user, Kategori $kategori): bool
    {
        return $user->role?->slug === 'admin';
    }

    public function delete(User $user, Kategori $kategori): bool
    {
        return $user->role?->slug === 'admin';
    }
}
