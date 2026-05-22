<?php

namespace App\Providers;

use App\Models\Barang;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Transaksi;
use App\Models\User;
use App\Policies\BarangPolicy;
use App\Policies\GudangPolicy;
use App\Policies\KategoriPolicy;
use App\Policies\TransaksiPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register model policies
        Gate::policy(Gudang::class, GudangPolicy::class);
        Gate::policy(Kategori::class, KategoriPolicy::class);
        Gate::policy(Barang::class, BarangPolicy::class);
        Gate::policy(Transaksi::class, TransaksiPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
