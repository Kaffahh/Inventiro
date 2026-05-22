<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Audit;
use App\Models\Gudang;

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

        $gudangs = Gudang::all();
        $barangs = Barang::latest()->paginate(50);

        $user = $request->user();

        return Inertia::render('Stock/Index', [
            'transaksis' => $transaksis,
            'gudangs' => $gudangs,
            'barangs' => $barangs,
            'filters' => ['q' => $q],
            // server-provided permission flags to avoid relying on client-side role checks
            'canCreateTransaksi' => $user ? $user->can('create', Transaksi::class) : false,
            // some policies expect a Transaksi instance; creating a fresh instance for ability check is fine
            'canApprove' => $user ? $user->can('approve', new Transaksi()) : false,
        ]);
    }

    public function approve(Request $request, Transaksi $transaksi)
    {
        $this->authorize('approve', $transaksi);

        $transaksi->status = 'approved';
        $transaksi->save();

        Audit::create([
            'user_id' => $request->user()->id,
            'transaksi_id' => $transaksi->id,
            'action' => 'approve',
            'meta' => ['status' => 'approved'],
        ]);

        return redirect()->back()->with('success', 'Transaksi approved.');
    }

    public function reject(Request $request, Transaksi $transaksi)
    {
        $this->authorize('reject', $transaksi);

        $transaksi->status = 'rejected';
        $transaksi->save();

        Audit::create([
            'user_id' => $request->user()->id,
            'transaksi_id' => $transaksi->id,
            'action' => 'reject',
            'meta' => ['status' => 'rejected'],
        ]);

        return redirect()->back()->with('success', 'Transaksi rejected.');
    }

    // Stok masuk
    public function masuk(Request $request)
    {
        $user = $request->user();
        $this->authorize('create', Transaksi::class);

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
                'status' => 'pending',
                'tgl_transaksi' => now(),
            ]);

            foreach ($validated['items'] as $it) {
                // ensure the barang belongs to the selected gudang
                $barang = Barang::where('id', $it['barang_id'])
                    ->where('gudang_id', $validated['gudang_id'])
                    ->lockForUpdate()
                    ->first();
                if (! $barang) {
                    throw new \Exception("Barang ID {$it['barang_id']} tidak ditemukan di gudang yang dipilih.");
                }
                $jumlah = (int) $it['jumlah'];

                $barang->stok = $barang->stok + $jumlah;
                $barang->save();

                TransaksiDetail::create([
                    'transaksi_id' => $tx->id,
                    'barang_id' => $barang->id,
                    'jumlah' => $jumlah,
                ]);
            }
            // Audit
            Audit::create([
                'user_id' => $user->id,
                'transaksi_id' => $tx->id,
                'action' => 'masuk',
                'meta' => ['items' => $validated['items']],
            ]);
        });

        return redirect()->back()->with('success', 'Stok masuk berhasil dicatat.');
    }

    // Stok keluar
    public function keluar(Request $request)
    {
        $user = $request->user();
        $this->authorize('create', Transaksi::class);

        $validated = $request->validate([
            'gudang_id' => 'required|exists:gudangs,id',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barangs,id',
            'items.*.jumlah' => 'required|integer|min:1',
        ]);

        $result = DB::transaction(function () use ($validated, $user) {
            // First validate stock availability under lock
            foreach ($validated['items'] as $it) {
                $barang = Barang::where('id', $it['barang_id'])
                    ->where('gudang_id', $validated['gudang_id'])
                    ->lockForUpdate()
                    ->first();
                if (! $barang) {
                    return ['ok' => false, 'message' => "Barang ID {$it['barang_id']} tidak ditemukan di gudang yang dipilih."];
                }
                $jumlah = (int) $it['jumlah'];
                if ($barang->stok < $jumlah) {
                    return ['ok' => false, 'message' => "Stok tidak cukup untuk {$barang->name}. Tersedia: {$barang->stok}"];
                }
            }

            $tx = Transaksi::create([
                'user_id' => $user->id,
                'gudang_id' => $validated['gudang_id'],
                'tipe' => 'keluar',
                'status' => 'pending',
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

            // Audit
            Audit::create([
                'user_id' => $user->id,
                'transaksi_id' => $tx->id,
                'action' => 'keluar',
                'meta' => ['items' => $validated['items']],
            ]);

            return ['ok' => true];
        });

        if (! $result['ok']) {
            return redirect()->back()->with('error', $result['message']);
        }

        return redirect()->back()->with('success', 'Stok keluar berhasil dicatat.');
    }
}
