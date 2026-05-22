<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\GudangController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Transaksi;
use App\Models\Barang;
use Carbon\Carbon;

Route::get('/', function () {
    // Generate last 7 days list with default count 0
    $chartData = collect(range(6, 0))->mapWithKeys(function ($daysAgo) {
        $date = Carbon::now()->subDays($daysAgo)->format('Y-m-d');
        return [$date => 0];
    });

    // Fetch actual transaction count for last 7 days
    $dbChartData = Transaksi::selectRaw('DATE(tgl_transaksi) as date, COUNT(*) as count')
        ->where('tgl_transaksi', '>=', Carbon::now()->subDays(6)->startOfDay())
        ->groupBy('date')
        ->get();

    foreach ($dbChartData as $row) {
        if (isset($chartData[$row->date])) {
            $chartData[$row->date] = $row->count;
        }
    }

    $formattedChartData = $chartData->map(function ($count, $date) {
        return [
            'date' => Carbon::parse($date)->format('d M'),
            'count' => $count,
        ];
    })->values()->all();

    $stats = [
        'total_barang' => Barang::count(),
        'total_stok' => Barang::sum('stok'),
        'stok_menipis' => Barang::whereColumn('stok', '<=', 'min_stok')->count(),
        'total_transaksi' => Transaksi::count(),
        'recent_transactions' => Transaksi::with(['user', 'gudang', 'details.barang'])->latest()->take(5)->get()->map(function($tx) {
            $barangNames = $tx->details
                ->pluck('barang.name')
                ->filter()
                ->values();

            return [
                'id' => 'TX-' . str_pad($tx->id, 3, '0', STR_PAD_LEFT),
                'item' => $barangNames->isNotEmpty() ? $barangNames->implode(', ') : '-',
                'type' => ucfirst($tx->tipe),
                'qty' => $tx->details->sum('jumlah'),
                'status' => ucfirst($tx->status),
                'date' => Carbon::parse($tx->tgl_transaksi)->format('d M Y'),
            ];
        }),
        'low_stock_items' => Barang::whereColumn('stok', '<=', 'min_stok')
            ->latest()
            ->take(3)
            ->get()
            ->map(function($b) {
                return [
                    'name' => $b->name,
                    'stock' => $b->stok,
                    'min' => $b->min_stok,
                ];
            }),
        'chart_data' => $formattedChartData
    ];

    return Inertia::render('Dashboard', [
        'stats' => $stats
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('barang', BarangController::class);
    Route::resource('kategori', KategoriController::class);
    Route::resource('gudang', GudangController::class);
    // User management (admin only)
    Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
    Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
});

require __DIR__.'/auth.php';
