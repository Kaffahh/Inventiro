<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaksi::with(['user', 'gudang', 'details.barang'])->latest();

        if ($user->role?->slug === 'staff') {
            // staff only see transactions for their assigned gudang
            $query->where('gudang_id', $user->gudang_id);
        }

        $transaksis = $query->paginate(15)->withQueryString();

        return Inertia::render('Staff/Index', [
            'transaksis' => $transaksis,
            'canCreateTransaksi' => $user ? $user->can('create', Transaksi::class) : false,
            'canApprove' => $user ? $user->can('approve', new Transaksi()) : false,
        ]);
    }
}
