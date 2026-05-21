<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Transaksi;
use App\Models\Barang;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $stats = [
        'total_barang' => Barang::count(),
        'total_stok' => Barang::sum('stok'),
        'stok_menipis' => Barang::whereColumn('stok', '<=', 'min_stok')->count(),
        'total_transaksi' => Transaksi::count(),
        'recent_transactions' => Transaksi::with(['user', 'gudang'])->latest()->take(5)->get()->map(function($tx) {
            return [
                'id' => 'TX-' . str_pad($tx->id, 3, '0', STR_PAD_LEFT),
                'item' => 'Multiple Items', // Simplify for now
                'type' => ucfirst($tx->tipe),
                'qty' => 0, // Would need detail sum
                'status' => ucfirst($tx->status),
                'date' => Carbon::parse($tx->tgl_transaksi)->format('d M Y'),
            ];
        }),
        'chart_data' => Transaksi::selectRaw('DATE(tgl_transaksi) as date, COUNT(*) as count')
            ->where('tgl_transaksi', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
    ];

    return Inertia::render('Dashboard', [
        'stats' => $stats
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/barang', function () {
    return Inertia::render('Barang/Index');
})->middleware(['auth', 'verified'])->name('barang.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/barang', function () {
        return Inertia::render('Barang/Index');
    })->name('barang.index');
});

require __DIR__.'/auth.php';
