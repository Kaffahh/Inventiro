<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        if (($request->user()?->role?->slug ?? null) !== 'staff') {
            abort(403);
        }

        $userId = $request->user()->id;

        $stats = [
            'my_pending' => Transaksi::where('user_id', $userId)->where('status', 'pending')->count(),
            'my_approved' => Transaksi::where('user_id', $userId)->where('status', 'approved')->count(),
            'my_rejected' => Transaksi::where('user_id', $userId)->where('status', 'rejected')->count(),
            'my_total' => Transaksi::where('user_id', $userId)->count(),
        ];

        $recent = Transaksi::with(['gudang', 'details.barang'])
            ->where('user_id', $userId)
            ->latest('tgl_transaksi')
            ->take(10)
            ->get()
            ->map(function ($tx) {
                return [
                    'id' => $tx->id,
                    'tipe' => $tx->tipe,
                    'status' => $tx->status,
                    'tanggal' => optional($tx->tgl_transaksi)->format('Y-m-d'),
                    'gudang' => $tx->gudang?->name,
                    'total_qty' => $tx->details->sum('jumlah'),
                    'items' => $tx->details
                        ->pluck('barang.name')
                        ->filter()
                        ->values(),
                ];
            });

        $lowStockItems = Barang::whereColumn('stok', '<=', 'min_stok')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'stok', 'min_stok']);

        return Inertia::render('Staff/Index', [
            'stats' => $stats,
            'recent' => $recent,
            'lowStockItems' => $lowStockItems,
        ]);
    }
}
