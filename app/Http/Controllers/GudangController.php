<?php

namespace App\Http\Controllers;

use App\Models\Gudang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GudangController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Gudang::class, 'gudang');
    }

    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $gudangs = Gudang::when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Gudang/Index', [
            'gudangs' => $gudangs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:gudangs,name',
            'alamat' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Nama gudang wajib diisi.',
            'name.unique' => 'Nama gudang sudah digunakan.',
        ]);

        Gudang::create($validated);

        return redirect()->route('gudang.index')->with('success', 'Gudang berhasil ditambahkan.');
    }

    public function update(Request $request, Gudang $gudang): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:gudangs,name,'.$gudang->id,
            'alamat' => 'nullable|string|max:1000',
        ], [
            'name.required' => 'Nama gudang wajib diisi.',
            'name.unique' => 'Nama gudang sudah digunakan.',
        ]);

        $gudang->update($validated);

        return redirect()->route('gudang.index')->with('success', 'Gudang berhasil diperbarui.');
    }

    public function destroy(Gudang $gudang): RedirectResponse
    {
        if ($gudang->barangs()->exists()) {
            return redirect()->route('gudang.index')->with('error', 'Gudang tidak dapat dihapus karena masih digunakan oleh data barang.');
        }

        $gudang->delete();

        return redirect()->route('gudang.index')->with('success', 'Gudang berhasil dihapus.');
    }
}
