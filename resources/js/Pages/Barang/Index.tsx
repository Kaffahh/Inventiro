import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Image as ImageIcon,
    Eye,
    ArrowUpDown,
    X,
    AlertTriangle,
    CheckCircle2,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';
import { useForm as useFormInertia } from '@inertiajs/react';

interface Kategori {
    id: number;
    name: string;
}

interface Gudang {
    id: number;
    name: string;
}

interface Barang {
    id: number;
    name: string;
    sku: string;
    foto: string | null;
    kategori_id: number;
    gudang_id: number;
    stok: number;
    min_stok: number;
    deskripsi: string | null;
    kategori: Kategori;
    gudang: Gudang;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
    from: number;
    to: number;
}

export default function BarangIndex() {
    const { 
        barangs = { data: [], total: 0, from: 0, to: 0, prev_page_url: null, next_page_url: null }, 
        kategoris = [], 
        gudangs = [], 
        filters = { search: '', kategori_id: '', stok_status: '', sort_stok: '' },
        flash = { success: null, error: null }
    } = usePage().props as any;

    const { auth } = usePage().props as any;
    const user = auth.user;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterKategori, setFilterKategori] = useState(filters.kategori_id || '');
    const [filterStokStatus, setFilterStokStatus] = useState(filters.stok_status || '');
    const [filterSortStok, setFilterSortStok] = useState(filters.sort_stok || '');

    const [showFilters, setShowFilters] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isStockInOpen, setIsStockInOpen] = useState(false);
    const [isStockOutOpen, setIsStockOutOpen] = useState(false);
    
    const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    // Form for Adding
    const addForm = useForm({
        name: '',
        sku: '',
        kategori_id: '',
        gudang_id: '',
        stok: '0',
        min_stok: '5',
        deskripsi: '',
        foto: null as File | null,
    });

    // Form for Editing
    const editForm = useForm({
        name: '',
        sku: '',
        kategori_id: '',
        gudang_id: '',
        stok: '0',
        min_stok: '5',
        deskripsi: '',
        foto: null as File | null,
        _method: 'PUT' // Crucial for multipart form uploads in Laravel update
    });

    const stockForm = useFormInertia({
        gudang_id: '',
        items: [ { barang_id: '', jumlah: '1' } ],
    });

    const addStockRow = () => {
        stockForm.setData('items', [...stockForm.data.items, { barang_id: '', jumlah: '1' }]);
    };

    const removeStockRow = (index: number) => {
        const items = stockForm.data.items.filter((_: any, i: number) => i !== index);
        stockForm.setData('items', items);
    };

    const submitStock = (type: 'masuk'|'keluar') => (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = type === 'masuk' ? 'stok.masuk' : 'stok.keluar';
        stockForm.post(route(routeName), {
            onSuccess: () => {
                setIsStockInOpen(false);
                setIsStockOutOpen(false);
                stockForm.reset('items');
                stockForm.setData('items', [ { barang_id: '', jumlah: '1' } ]);
            }
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search: searchTerm });
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        applyFilters({ search: '' });
    };

    const applyFilters = (newFilters: any = {}) => {
        const queryParams = {
            search: searchTerm,
            kategori_id: filterKategori,
            stok_status: filterStokStatus,
            sort_stok: filterSortStok,
            ...newFilters
        };
        router.get(route('barang.index'), queryParams, { preserveState: true });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterKategori('');
        setFilterStokStatus('');
        setFilterSortStok('');
        router.get(route('barang.index'), {});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            // Client-side size guard: 2MB max (match server validation)
            if (file.size > 2 * 1024 * 1024) {
                setFileError('Ukuran gambar maksimal 2MB.');
                return;
            }
            setFileError(null);
            if (isEdit) {
                editForm.setData('foto', file);
            } else {
                addForm.setData('foto', file);
            }
            // Generate visual preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('barang.store'), {
            forceFormData: true,
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
                setImagePreview(null);
            }
        });
    };

    const openEditModal = (barang: Barang) => {
        setSelectedBarang(barang);
        editForm.setData({
            name: barang.name,
            sku: barang.sku,
            kategori_id: barang.kategori_id.toString(),
            gudang_id: barang.gudang_id.toString(),
            stok: barang.stok.toString(),
            min_stok: barang.min_stok.toString(),
            deskripsi: barang.deskripsi || '',
            foto: null,
            _method: 'PUT'
        });
        setImagePreview(barang.foto);
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBarang) return;
        
        // We use POST with _method=PUT to bypass PHP's issue parsing PUT requests with multipart/form-data
        editForm.post(route('barang.update', selectedBarang.id), {
            forceFormData: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedBarang(null);
                editForm.reset();
                setImagePreview(null);
            }
        });
    };

    const openDeleteModal = (barang: Barang) => {
        setSelectedBarang(barang);
        setIsDeleteOpen(true);
    };

    const submitDelete = () => {
        if (!selectedBarang) return;
        router.delete(route('barang.destroy', selectedBarang.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedBarang(null);
            },
            onError: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    const openViewModal = (barang: Barang) => {
        setSelectedBarang(barang);
        setIsViewOpen(true);
    };

    const activeFilterCount = [
        filterKategori, 
        filterStokStatus, 
        filterSortStok
    ].filter(Boolean).length;

    return (
        <AuthenticatedLayout
            header={user.role === 'admin' ? "Kelola Data Barang" : "Daftar Barang & Stok"}
        >
            <Head title="Barang" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm font-semibold flex items-center justify-between">
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center justify-between">
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari nama barang atau SKU..." 
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button 
                                type="button"
                                onClick={handleSearchClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </form>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { stockForm.reset(); setIsStockInOpen(true); }}
                            className="px-3 py-2 rounded-xl border bg-emerald-50 text-emerald-700 text-sm font-semibold"
                        >Stok Masuk</button>
                        <button
                            onClick={() => { stockForm.reset(); setIsStockOutOpen(true); }}
                            className="px-3 py-2 rounded-xl border bg-red-50 text-red-700 text-sm font-semibold"
                        >Stok Keluar</button>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                                showFilters || activeFilterCount > 0
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <Filter size={18} />
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                        
                        {user.role === 'admin' && (
                            <button 
                                onClick={() => {
                                    addForm.reset();
                                    addForm.clearErrors();
                                    setImagePreview(null);
                                    setIsAddOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Tambah Barang</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Options Expandable Panel */}
                {showFilters && (
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Kategori</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                value={filterKategori}
                                onChange={(e) => {
                                    setFilterKategori(e.target.value);
                                    applyFilters({ kategori_id: e.target.value });
                                }}
                            >
                                <option value="">Semua Kategori</option>
                                {kategoris.map((kat: Kategori) => (
                                    <option key={kat.id} value={kat.id}>{kat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Status Stok</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                value={filterStokStatus}
                                onChange={(e) => {
                                    setFilterStokStatus(e.target.value);
                                    applyFilters({ stok_status: e.target.value });
                                }}
                            >
                                <option value="">Semua Status</option>
                                <option value="tersedia">Tersedia</option>
                                <option value="menipis">Stok Menipis</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500">Urutkan Stok</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
                                value={filterSortStok}
                                onChange={(e) => {
                                    setFilterSortStok(e.target.value);
                                    applyFilters({ sort_stok: e.target.value });
                                }}
                            >
                                <option value="">Terbaru (Default)</option>
                                <option value="asc">Stok: Sedikit ke Banyak</option>
                                <option value="desc">Stok: Banyak ke Sedikit</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleResetFilters}
                                className="w-full py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                )}

                {/* Table Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">Info Barang</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Gudang</th>
                                    <th className="px-6 py-4 text-center">Stok</th>
                                    <th className="px-6 py-4">Status Stok</th>
                                    {user.role === 'admin' ? (
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    ) : (
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {barangs.data.length > 0 ? (
                                    barangs.data.map((item: Barang) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        {item.foto ? (
                                                            <img src={item.foto} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate max-w-[150px] sm:max-w-xs">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                                                            {item.sku}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-tight">
                                                    {item.kategori?.name || 'Unassigned'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                {item.gudang?.name || 'Unassigned'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {item.stok}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.stok <= item.min_stok ? (
                                                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                                        <span className="text-xs font-bold uppercase">Stok Menipis</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        <span className="text-xs font-bold uppercase">Tersedia</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 ${user.role === 'admin' ? 'justify-end' : 'justify-center'}`}>
                                                    <button 
                                                        onClick={() => openViewModal(item)}
                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {user.role === 'admin' && (
                                                        <>
                                                            <button 
                                                                onClick={() => openEditModal(item)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => openDeleteModal(item)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Tidak ada data barang yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {barangs.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-col sm:flex-row gap-4">
                            <p className="text-xs text-gray-500">
                                Menampilkan {barangs.from} sampai {barangs.to} dari {barangs.total} barang
                            </p>
                            <div className="flex gap-2">
                                {barangs.prev_page_url ? (
                                    <button 
                                        onClick={() => applyFilters({ page: barangs.current_page - 1 })}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Sebelumnya
                                    </button>
                                ) : (
                                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                )}

                                {barangs.next_page_url ? (
                                    <button 
                                        onClick={() => applyFilters({ page: barangs.current_page + 1 })}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Selanjutnya
                                    </button>
                                ) : (
                                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 cursor-not-allowed">
                                        Selanjutnya
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Tambah Barang */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 my-8">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Barang Baru</h3>
                            <button 
                                onClick={() => setIsAddOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitAdd}>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Nama Barang
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            placeholder="Contoh: MacBook Pro M3..."
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            required
                                        />
                                        {addForm.errors.name && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="sku" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            SKU (Stock Keeping Unit)
                                        </label>
                                        <input 
                                            type="text" 
                                            id="sku"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.sku ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            placeholder="Contoh: MBP-M3-001..."
                                            value={addForm.data.sku}
                                            onChange={(e) => addForm.setData('sku', e.target.value)}
                                            required
                                        />
                                        {addForm.errors.sku && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.sku}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="kategori_id" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Kategori
                                        </label>
                                        <select
                                            id="kategori_id"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.kategori_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={addForm.data.kategori_id}
                                            onChange={(e) => addForm.setData('kategori_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {kategoris.map((kat: Kategori) => (
                                                <option key={kat.id} value={kat.id}>{kat.name}</option>
                                            ))}
                                        </select>
                                        {addForm.errors.kategori_id && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.kategori_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="gudang_id" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Gudang Penyimpanan
                                        </label>
                                        <select
                                            id="gudang_id"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.gudang_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={addForm.data.gudang_id}
                                            onChange={(e) => addForm.setData('gudang_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Pilih Gudang</option>
                                            {gudangs.map((g: Gudang) => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                        {addForm.errors.gudang_id && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.gudang_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="stok" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Jumlah Stok Awal
                                        </label>
                                        <input 
                                            type="number" 
                                            id="stok"
                                            min="0"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.stok ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={addForm.data.stok}
                                            onChange={(e) => addForm.setData('stok', e.target.value)}
                                            required
                                        />
                                        {addForm.errors.stok && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.stok}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="min_stok" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Minimum Stok Alert
                                        </label>
                                        <input 
                                            type="number" 
                                            id="min_stok"
                                            min="0"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.min_stok ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={addForm.data.min_stok}
                                            onChange={(e) => addForm.setData('min_stok', e.target.value)}
                                            required
                                        />
                                        {addForm.errors.min_stok && (
                                            <p className="text-xs font-semibold text-red-600">{addForm.errors.min_stok}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="deskripsi" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Deskripsi Barang
                                    </label>
                                    <textarea 
                                        id="deskripsi"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-emerald-500 focus:ring-2 dark:bg-gray-800 dark:text-white outline-none text-sm transition-all resize-none"
                                        placeholder="Berikan deskripsi detail tentang barang ini..."
                                        value={addForm.data.deskripsi}
                                        onChange={(e) => addForm.setData('deskripsi', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Foto Barang</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 overflow-hidden bg-gray-50 dark:bg-gray-800">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={28} />
                                            )}
                                        </div>
                                        <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold cursor-pointer transition-all">
                                            <Upload size={16} />
                                            <span>Pilih Gambar</span>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, false)}
                                            />
                                        </label>
                                    </div>
                                    {addForm.errors.foto && (
                                        <p className="text-xs font-semibold text-red-600">{addForm.errors.foto}</p>
                                    )}
                                    {fileError && (
                                        <p className="text-xs font-semibold text-red-600">{fileError}</p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-2xl">
                                <button 
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    disabled={addForm.processing}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                                    disabled={addForm.processing}
                                >
                                    {addForm.processing ? 'Menyimpan...' : 'Simpan Barang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Edit Barang */}
            {isEditOpen && selectedBarang && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 my-8">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Detail Barang</h3>
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="edit_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Nama Barang
                                        </label>
                                        <input 
                                            type="text" 
                                            id="edit_name"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                            required
                                        />
                                        {editForm.errors.name && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="edit_sku" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            SKU (Stock Keeping Unit)
                                        </label>
                                        <input 
                                            type="text" 
                                            id="edit_sku"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.sku ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.sku}
                                            onChange={(e) => editForm.setData('sku', e.target.value)}
                                            required
                                        />
                                        {editForm.errors.sku && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.sku}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="edit_kategori_id" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Kategori
                                        </label>
                                        <select
                                            id="edit_kategori_id"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.kategori_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.kategori_id}
                                            onChange={(e) => editForm.setData('kategori_id', e.target.value)}
                                            required
                                        >
                                            {kategoris.map((kat: Kategori) => (
                                                <option key={kat.id} value={kat.id}>{kat.name}</option>
                                            ))}
                                        </select>
                                        {editForm.errors.kategori_id && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.kategori_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="edit_gudang_id" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Gudang Penyimpanan
                                        </label>
                                        <select
                                            id="edit_gudang_id"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.gudang_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.gudang_id}
                                            onChange={(e) => editForm.setData('gudang_id', e.target.value)}
                                            required
                                        >
                                            {gudangs.map((g: Gudang) => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                        {editForm.errors.gudang_id && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.gudang_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label htmlFor="edit_stok" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Stok
                                        </label>
                                        <input 
                                            type="number" 
                                            id="edit_stok"
                                            min="0"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.stok ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.stok}
                                            onChange={(e) => editForm.setData('stok', e.target.value)}
                                            required
                                        />
                                        {editForm.errors.stok && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.stok}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="edit_min_stok" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Minimum Stok Alert
                                        </label>
                                        <input 
                                            type="number" 
                                            id="edit_min_stok"
                                            min="0"
                                            className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.min_stok ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                            value={editForm.data.min_stok}
                                            onChange={(e) => editForm.setData('min_stok', e.target.value)}
                                            required
                                        />
                                        {editForm.errors.min_stok && (
                                            <p className="text-xs font-semibold text-red-600">{editForm.errors.min_stok}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="edit_deskripsi" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Deskripsi Barang
                                    </label>
                                    <textarea 
                                        id="edit_deskripsi"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:ring-emerald-500 focus:ring-2 dark:bg-gray-800 dark:text-white outline-none text-sm transition-all resize-none"
                                        value={editForm.data.deskripsi}
                                        onChange={(e) => editForm.setData('deskripsi', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ubah Foto Barang</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 overflow-hidden bg-gray-50 dark:bg-gray-800">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={28} />
                                            )}
                                        </div>
                                        <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold cursor-pointer transition-all">
                                            <Upload size={16} />
                                            <span>Ganti Gambar</span>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileChange(e, true)}
                                            />
                                        </label>
                                    </div>
                                    {editForm.errors.foto && (
                                        <p className="text-xs font-semibold text-red-600">{editForm.errors.foto}</p>
                                    )}
                                    {fileError && (
                                        <p className="text-xs font-semibold text-red-600">{fileError}</p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 rounded-b-2xl">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    disabled={editForm.processing}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                                    disabled={editForm.processing}
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Detail'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Hapus Barang */}
            {isDeleteOpen && selectedBarang && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        <div className="p-6 flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Barang</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Apakah Anda yakin ingin menghapus barang <span className="font-bold text-gray-900 dark:text-white">"{selectedBarang.name}"</span>? Tindakan ini tidak dapat dibatalkan.
                                </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsDeleteOpen(false)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="button"
                                onClick={submitDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-200 dark:shadow-none transition-all"
                            >
                                Hapus Barang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: View Detail Barang */}
                        {/* MODAL: Stok Masuk */}
                        {isStockInOpen && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                                <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Stok Masuk</h3>
                                        <button onClick={() => setIsStockInOpen(false)} className="p-1 rounded-lg">×</button>
                                    </div>
                                    <form onSubmit={submitStock('masuk')}> 
                                        <div className="p-6 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold">Pilih Gudang</label>
                                                <select className="w-full rounded-xl border px-4 py-2" value={stockForm.data.gudang_id} onChange={e => stockForm.setData('gudang_id', e.target.value)} required>
                                                    <option value="">Pilih Gudang</option>
                                                    {gudangs.map((g: any) => (<option key={g.id} value={g.id}>{g.name}</option>))}
                                                </select>
                                            </div>

                                            {stockForm.data.items.map((row: any, idx: number) => (
                                                <div key={idx} className="grid grid-cols-3 gap-2 items-end">
                                                    <select className="rounded-xl border px-3 py-2" value={row.barang_id} onChange={e => {
                                                        const items = [...stockForm.data.items]; items[idx].barang_id = e.target.value; stockForm.setData('items', items);
                                                    }} required>
                                                        <option value="">Pilih Barang</option>
                                                        {barangs.data.map((b: any) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                                    </select>
                                                    <input type="number" min="1" className="rounded-xl border px-3 py-2" value={row.jumlah} onChange={e => {
                                                        const items = [...stockForm.data.items]; items[idx].jumlah = e.target.value; stockForm.setData('items', items);
                                                    }} required />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => addStockRow()} className="px-3 py-2 rounded-xl border">Tambah</button>
                                                        {stockForm.data.items.length > 1 && (
                                                            <button type="button" onClick={() => removeStockRow(idx)} className="px-3 py-2 rounded-xl border text-red-600">Hapus</button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 flex justify-end gap-2 border-t">
                                            <button type="button" onClick={() => setIsStockInOpen(false)} className="px-4 py-2 rounded-xl">Batal</button>
                                            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Catat Masuk</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* MODAL: Stok Keluar */}
                        {isStockOutOpen && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                                <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
                                    <div className="p-6 border-b flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Stok Keluar</h3>
                                        <button onClick={() => setIsStockOutOpen(false)} className="p-1 rounded-lg">×</button>
                                    </div>
                                    <form onSubmit={submitStock('keluar')}> 
                                        <div className="p-6 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold">Pilih Gudang</label>
                                                <select className="w-full rounded-xl border px-4 py-2" value={stockForm.data.gudang_id} onChange={e => stockForm.setData('gudang_id', e.target.value)} required>
                                                    <option value="">Pilih Gudang</option>
                                                    {gudangs.map((g: any) => (<option key={g.id} value={g.id}>{g.name}</option>))}
                                                </select>
                                            </div>

                                            {stockForm.data.items.map((row: any, idx: number) => (
                                                <div key={idx} className="grid grid-cols-3 gap-2 items-end">
                                                    <select className="rounded-xl border px-3 py-2" value={row.barang_id} onChange={e => {
                                                        const items = [...stockForm.data.items]; items[idx].barang_id = e.target.value; stockForm.setData('items', items);
                                                    }} required>
                                                        <option value="">Pilih Barang</option>
                                                        {barangs.data.map((b: any) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                                    </select>
                                                    <input type="number" min="1" className="rounded-xl border px-3 py-2" value={row.jumlah} onChange={e => {
                                                        const items = [...stockForm.data.items]; items[idx].jumlah = e.target.value; stockForm.setData('items', items);
                                                    }} required />
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => addStockRow()} className="px-3 py-2 rounded-xl border">Tambah</button>
                                                        {stockForm.data.items.length > 1 && (
                                                            <button type="button" onClick={() => removeStockRow(idx)} className="px-3 py-2 rounded-xl border text-red-600">Hapus</button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 flex justify-end gap-2 border-t">
                                            <button type="button" onClick={() => setIsStockOutOpen(false)} className="px-4 py-2 rounded-xl">Batal</button>
                                            <button type="submit" className="px-4 py-2 rounded-xl bg-red-600 text-white">Catat Keluar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
            {isViewOpen && selectedBarang && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Informasi Barang</h3>
                            <button 
                                onClick={() => setIsViewOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-full sm:w-36 h-36 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200 dark:border-gray-700 self-center sm:self-start">
                                    {selectedBarang.foto ? (
                                        <img src={selectedBarang.foto} alt={selectedBarang.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon size={36} />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase">Nama Barang</h4>
                                        <p className="text-lg font-extrabold text-gray-900 dark:text-white">{selectedBarang.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase">SKU</h4>
                                            <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{selectedBarang.sku}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase">Kategori</h4>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-tight">
                                                {selectedBarang.kategori?.name || 'Unassigned'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="text-center">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Stok Saat Ini</h4>
                                    <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">{selectedBarang.stok}</p>
                                </div>
                                <div className="text-center">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Min Stok Alert</h4>
                                    <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">{selectedBarang.min_stok}</p>
                                </div>
                                <div className="text-center flex flex-col items-center justify-center">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Status</h4>
                                    {selectedBarang.stok <= selectedBarang.min_stok ? (
                                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase">Menipis</span>
                                    ) : (
                                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">Tersedia</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase">Lokasi Gudang</h4>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedBarang.gudang?.name || 'Unassigned'}</p>
                            </div>

                            {selectedBarang.deskripsi && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase">Deskripsi</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 max-h-32 overflow-y-auto">
                                        {selectedBarang.deskripsi}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                            <button 
                                onClick={() => setIsViewOpen(false)}
                                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform active:scale-95"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
