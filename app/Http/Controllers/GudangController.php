<?php

namespace App\Http\Controllers;

use App\Models\Gudang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class GudangController extends Controller
{
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
                'search' => $search
            ]
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
            'name' => 'required|string|max:255|unique:gudangs,name,' . $gudang->id,
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
        $gudang->delete();

        return redirect()->route('gudang.index')->with('success', 'Gudang berhasil dihapus.');
    }
}
