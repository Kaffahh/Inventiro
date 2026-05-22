<?php

use App\Models\Audit;
use App\Models\Barang;
use App\Models\Gudang;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;

beforeEach(function () {
    Artisan::call('migrate:fresh');
});

it('creates an audit when stok masuk is recorded', function () {
    $user = User::factory()->create();
    $gudang = Gudang::factory()->create();
    $barang = Barang::factory()->create(['stok' => 0]);

    $this->actingAs($user)->post(route('stok.masuk'), [
        'gudang_id' => $gudang->id,
        'items' => [ ['barang_id' => $barang->id, 'jumlah' => 5] ],
    ])->assertStatus(302);

    $this->assertDatabaseHas('audits', [ 'action' => 'masuk' ]);
});
