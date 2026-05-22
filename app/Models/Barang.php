<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Barang extends Model
{
    protected $fillable = [
        'name',
        'sku',
        'foto',
        'kategori_id',
        'gudang_id',
        'stok',
        'min_stok',
        'deskripsi',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }

    public function gudang()
    {
        return $this->belongsTo(Gudang::class);
    }

    public function transaksiDetails()
    {
        return $this->hasMany(TransaksiDetail::class);
    }

    // Return a usable URL for the foto attribute. Accepts stored paths or already
    // provided URLs (backwards compatible).
    public function getFotoAttribute($value)
    {
        if (! $value) {
            return null;
        }

        // If it's already a full URL or starts with /storage, return as-is.
        if (str_starts_with($value, 'http') || str_starts_with($value, '/storage')) {
            return $value;
        }

        // Otherwise assume it's a storage path and generate a public URL.
        return Storage::disk('public')->url($value);
    }
}
