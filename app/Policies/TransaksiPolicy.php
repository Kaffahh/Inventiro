<?php

namespace App\Policies;

use App\Models\Transaksi;
use App\Models\User;

class TransaksiPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function view(User $user, Transaksi $transaksi): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function create(User $user): bool
    {
        return in_array($user->role?->slug, ['admin', 'staff']);
    }

    public function delete(User $user, Transaksi $transaksi): bool
    {
        return $user->role?->slug === 'admin';
    }
}
