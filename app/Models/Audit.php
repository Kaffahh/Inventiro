<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $fillable = ['user_id', 'transaksi_id', 'action', 'meta'];

    protected $casts = [
        'meta' => 'array',
    ];
}
