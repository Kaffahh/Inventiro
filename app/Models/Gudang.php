<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gudang extends Model
{
    protected $fillable = ['name', 'alamat'];

    public function barangs()
    {
        return $this->hasMany(Barang::class);
    }
}
