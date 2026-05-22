<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockController extends Controller
{
    // List history
    public function index(Request $request)
    {
        $q = $request->input('q');

        $transaksis = Transaksi::with(['user', 'gudang', 'details.barang'])
            ->when($q, function ($query, $q) {
                $query->where('tipe', 'like', "%{$q}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Stock/Index', [
            'transaksis' => $transaksis,
            'filters' => ['q' => $q]
        ]);
    }

    // Stok masuk
    public function masuk(Request $request)
    {
        $user = $request->user();
        if (! in_array($user->role?->slug, ['admin', 'staff'])) {
            abort(403);
        }

        $validated = $request->validate([
            'gudang_id' => 'required|exists:gudangs,id',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $user) {
            $tx = Transaksi::create([
                'user_id' => $user->id,
                'gudang_id' => $validated['gudang_id'],
                'tipe' => 'masuk',
                'status' => 'completed',
                'tgl_transaksi' => now(),
            ]);

            foreach ($validated['items'] as $it) {
                $barang = Barang::lockForUpdate()->find($it['barang_id']);
                $jumlah = (int) $it['jumlah'];

                $barang->stok = $barang->stok + $jumlah;
                $barang->save();

                TransaksiDetail::create([
                    'transaksi_id' => $tx->id,
                    'barang_id' => $barang->id,
                    'jumlah' => $jumlah,
                ]);
            }
        });

        return redirect()->back()->with('success', 'Stok masuk berhasil dicatat.');
    }

    // Stok keluar
    public function keluar(Request $request)
    {
        $user = $request->user();
        if (! in_array($user->role?->slug, ['admin', 'staff'])) {
            abort(403);
        }

        $validated = $request->validate([
            'gudang_id' => 'required|exists:gudangs,id',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        $result = DB::transaction(function () use ($validated, $user) {
            // First validate stock availability under lock
            foreach ($validated['items'] as $it) {
                $barang = Barang::lockForUpdate()->find($it['barang_id']);
                $jumlah = (int) $it['jumlah'];
                if ($barang->stok < $jumlah) {
                    return ['ok' => false, 'message' => "Stok tidak cukup untuk {$barang->name}. Tersedia: {$barang->stok}"];
                }
            }

            $tx = Transaksi::create([
                'user_id' => $user->id,
                'gudang_id' => $validated['gudang_id'],
                'tipe' => 'keluar',
                'status' => 'completed',
                'tgl_transaksi' => now(),
            ]);

            foreach ($validated['items'] as $it) {
                $barang = Barang::lockForUpdate()->find($it['barang_id']);
                $jumlah = (int) $it['jumlah'];

                $barang->stok = $barang->stok - $jumlah;
                $barang->save();

                TransaksiDetail::create([
                    'transaksi_id' => $tx->id,
                    'barang_id' => $barang->id,
                    'jumlah' => $jumlah,
                ]);
            }

            return ['ok' => true];
        });

        if (! $result['ok']) {
            return redirect()->back()->with('error', $result['message']);
        }

        return redirect()->back()->with('success', 'Stok keluar berhasil dicatat.');
    }
}
