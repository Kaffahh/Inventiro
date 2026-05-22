<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Gudang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BarangController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Barang::class, 'barang');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $kategoriId = $request->input('kategori_id');
        $stokStatus = $request->input('stok_status'); // 'menipis', 'tersedia'
        $sortStok = $request->input('sort_stok'); // 'asc', 'desc'

        $barangs = Barang::with(['kategori', 'gudang'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($kategoriId, function ($query, $kategoriId) {
                $query->where('kategori_id', $kategoriId);
            })
            ->when($stokStatus, function ($query, $stokStatus) {
                if ($stokStatus === 'menipis') {
                    $query->whereColumn('stok', '<=', 'min_stok');
                } elseif ($stokStatus === 'tersedia') {
                    $query->whereColumn('stok', '>', 'min_stok');
                }
            })
            ->when($sortStok, function ($query, $sortStok) {
                $query->orderBy('stok', $sortStok);
            }, function ($query) {
                $query->latest();
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Barang/Index', [
            'barangs' => $barangs,
            'kategoris' => Kategori::orderBy('name')->get(),
            'gudangs' => Gudang::orderBy('name')->get(),
            'filters' => [
                'search' => $search,
                'kategori_id' => $kategoriId,
                'stok_status' => $stokStatus,
                'sort_stok' => $sortStok,
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:barangs,name',
            'sku' => 'required|string|max:100|unique:barangs,sku',
            'kategori_id' => 'required|exists:kategoris,id',
            'gudang_id' => 'required|exists:gudangs,id',
            'stok' => 'required|integer|min:0',
            'min_stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'name.required' => 'Nama barang wajib diisi.',
            'name.unique' => 'Nama barang sudah terdaftar.',
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah digunakan.',
            'kategori_id.required' => 'Kategori wajib dipilih.',
            'gudang_id.required' => 'Gudang wajib dipilih.',
            'stok.required' => 'Jumlah stok wajib diisi.',
            'min_stok.required' => 'Minimum stok wajib diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('barangs', 'public');
            $validated['foto'] = '/storage/' . $path;
        }

        Barang::create($validated);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:barangs,name,' . $barang->id,
            'sku' => 'required|string|max:100|unique:barangs,sku,' . $barang->id,
            'kategori_id' => 'required|exists:kategoris,id',
            'gudang_id' => 'required|exists:gudangs,id',
            'stok' => 'required|integer|min:0',
            'min_stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'name.required' => 'Nama barang wajib diisi.',
            'name.unique' => 'Nama barang sudah terdaftar.',
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah digunakan.',
            'kategori_id.required' => 'Kategori wajib dipilih.',
            'gudang_id.required' => 'Gudang wajib dipilih.',
            'stok.required' => 'Jumlah stok wajib diisi.',
            'min_stok.required' => 'Minimum stok wajib diisi.',
            'foto.image' => 'File harus berupa gambar.',
            'foto.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        if ($request->hasFile('foto')) {
            if ($barang->foto) {
                // Delete old image
                $oldPath = str_replace('/storage/', '', $barang->foto);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto')->store('barangs', 'public');
            $validated['foto'] = '/storage/' . $path;
        }

        $barang->update($validated);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang): RedirectResponse
    {
        // Check if barang has transaction details to respect foreign keys
        if ($barang->transaksiDetails()->exists()) {
            return redirect()->route('barang.index')->with('error', 'Barang tidak dapat dihapus karena sudah memiliki riwayat transaksi.');
        }

        if ($barang->foto) {
            $path = str_replace('/storage/', '', $barang->foto);
            Storage::disk('public')->delete($path);
        }

        $barang->delete();

        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus.');
    }
}
