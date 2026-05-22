<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Gudang;
use App\Models\Kategori;
use App\Models\Barang;
use App\Policies\GudangPolicy;
use App\Policies\KategoriPolicy;
use App\Policies\BarangPolicy;

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
    }
}
