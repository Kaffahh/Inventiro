import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Pencil, 
    Trash2, 
    Layers,
    X,
    AlertTriangle,
    ArrowUpDown
} from 'lucide-react';
import React, { useState } from 'react';

interface Kategori {
    id: number;
    name: string;
    slug: string;
    barangs_count: number;
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

export default function KategoriIndex() {
    const { kategoris, filters, flash } = usePage().props as any as {
        kategoris: PaginatedData<Kategori>;
        filters: { search: string | null };
        flash: { success: string | null; error: string | null };
    };

    const { auth } = usePage().props as any;
    const user = auth.user;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState<Kategori | null>(null);

    // Form for Adding
    const addForm = useForm({
        name: '',
    });

    // Form for Editing
    const editForm = useForm({
        name: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kategori.index'), { search: searchTerm }, { preserveState: true });
    };

    const handleSearchClear = () => {
        setSearchTerm('');
        router.get(route('kategori.index'), { search: '' });
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('kategori.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            }
        });
    };

    const openEditModal = (kategori: Kategori) => {
        setSelectedKategori(kategori);
        editForm.setData({ name: kategori.name });
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKategori) return;
        editForm.put(route('kategori.update', selectedKategori.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedKategori(null);
                editForm.reset();
            }
        });
    };

    const openDeleteModal = (kategori: Kategori) => {
        setSelectedKategori(kategori);
        setIsDeleteOpen(true);
    };

    const submitDelete = () => {
        if (!selectedKategori) return;
        router.delete(route('kategori.destroy', selectedKategori.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedKategori(null);
            },
            onError: () => {
                setIsDeleteOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={user.role === 'admin' ? "Kelola Kategori Barang" : "Kategori Barang"}
        >
            <Head title="Kategori" />

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
                            placeholder="Cari nama kategori..." 
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
                        {user.role === 'admin' && (
                            <button 
                                onClick={() => {
                                    addForm.reset();
                                    addForm.clearErrors();
                                    setIsAddOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Tambah Kategori</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors">
                                            Nama Kategori <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4 text-center">Jumlah Barang</th>
                                    {user.role === 'admin' && <th className="px-6 py-4 text-right">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {kategoris.data.length > 0 ? (
                                    kategoris.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                                #{item.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                        <Layers size={16} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                                                {item.slug}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                                                    {item.barangs_count} barang
                                                </span>
                                            </td>
                                            {user.role === 'admin' && (
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
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
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                            Tidak ada data kategori yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {kategoris.total > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between flex-col sm:flex-row gap-4">
                            <p className="text-xs text-gray-500">
                                Menampilkan {kategoris.from} sampai {kategoris.to} dari {kategoris.total} kategori
                            </p>
                            <div className="flex gap-2">
                                {kategoris.prev_page_url ? (
                                    <button 
                                        onClick={() => router.get(kategoris.prev_page_url!, { search: searchTerm })}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Sebelumnya
                                    </button>
                                ) : (
                                    <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 cursor-not-allowed">
                                        Sebelumnya
                                    </button>
                                )}

                                {kategoris.next_page_url ? (
                                    <button 
                                        onClick={() => router.get(kategoris.next_page_url!, { search: searchTerm })}
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

            {/* MODAL: Tambah Kategori */}
            {isAddOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Kategori</h3>
                            <button 
                                onClick={() => setIsAddOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitAdd}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nama Kategori
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        className={`w-full px-4 py-2.5 rounded-xl border ${addForm.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                        placeholder="Contoh: Elektronik, Aksesoris..."
                                        value={addForm.data.name}
                                        onChange={(e) => addForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {addForm.errors.name && (
                                        <p className="text-xs font-semibold text-red-600">{addForm.errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
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
                                    {addForm.processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Edit Kategori */}
            {isEditOpen && selectedKategori && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Kategori</h3>
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label htmlFor="edit_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nama Kategori
                                    </label>
                                    <input 
                                        type="text" 
                                        id="edit_name"
                                        className={`w-full px-4 py-2.5 rounded-xl border ${editForm.errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-800 focus:ring-emerald-500'} dark:bg-gray-800 dark:text-white focus:ring-2 outline-none text-sm transition-all`}
                                        placeholder="Contoh: Elektronik, Aksesoris..."
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-xs font-semibold text-red-600">{editForm.errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
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
                                    {editForm.processing ? 'Memperbarui...' : 'Perbarui'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Hapus Kategori */}
            {isDeleteOpen && selectedKategori && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
                        <div className="p-6 flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus Kategori</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Apakah Anda yakin ingin menghapus kategori <span className="font-bold text-gray-900 dark:text-white">"{selectedKategori.name}"</span>? Tindakan ini tidak dapat dibatalkan.
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
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
