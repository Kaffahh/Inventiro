import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Search, X, Pencil, Trash2 } from 'lucide-react';

interface Gudang {
    id: number;
    name: string;
    alamat?: string | null;
}

export default function GudangIndex() {
    const { gudangs = { data: [], total: 0, from: 0, to: 0, prev_page_url: null, next_page_url: null }, filters = { search: '' }, flash = { success: null, error: null } } = usePage().props as any;

    const { auth } = usePage().props as any;
    const user = auth.user;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedGudang, setSelectedGudang] = useState<Gudang | null>(null);

    const addForm = useForm({ name: '', alamat: '' });
    const editForm = useForm({ name: '', alamat: '', _method: 'PUT' });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('gudang.index'), { search: searchTerm }, { preserveState: true });
    };

    const openEdit = (g: Gudang) => {
        setSelectedGudang(g);
        editForm.setData({ name: g.name, alamat: g.alamat || '' });
        setIsEditOpen(true);
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post(route('gudang.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            }
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGudang) return;
        editForm.post(route('gudang.update', selectedGudang.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedGudang(null);
                editForm.reset();
            }
        });
    };

    const openDelete = (g: Gudang) => {
        setSelectedGudang(g);
        setIsDeleteOpen(true);
    };

    const submitDelete = () => {
        if (!selectedGudang) return;
        router.delete(route('gudang.destroy', selectedGudang.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedGudang(null);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Gudang">
            <Head title="Gudang" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari nama gudang..."
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button type="button" onClick={() => { setSearchTerm(''); router.get(route('gudang.index'), { search: '' }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <X size={16} />
                            </button>
                        )}
                    </form>

                    <div>
                        {user.role === 'admin' && (
                            <button onClick={() => { addForm.reset(); setIsAddOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl">
                                <Plus size={16} />
                                <span>Tambah Gudang</span>
                            </button>
                        )}
                    </div>
                </div>

                {flash.success && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 rounded-xl text-sm font-semibold">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-xl text-sm font-semibold">
                        {flash.error}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                                    <th className="px-6 py-4">Nama Gudang</th>
                                    <th className="px-6 py-4">Alamat</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {gudangs.data.length > 0 ? (
                                    gudangs.data.map((g: Gudang) => (
                                        <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{g.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{g.alamat || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    {user.role === 'admin' && (
                                                        <>
                                                            <button
                                                                onClick={() => openEdit(g)}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                                aria-label={`Edit ${g.name}`}
                                                            >
                                                                <Pencil size={16} />
                                                            </button>

                                                            <button
                                                                onClick={() => openDelete(g)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                aria-label={`Hapus ${g.name}`}
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
                                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada data gudang.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Modal */}
                {isAddOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tambah Gudang</h3>
                            <form onSubmit={submitAdd} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput id="name" name="name" value={addForm.data.name} onChange={(e) => addForm.setData('name', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={addForm.errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="alamat" value="Alamat (opsional)" />
                                    <TextInput id="alamat" name="alamat" value={addForm.data.alamat} onChange={(e) => addForm.setData('alamat', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={addForm.errors.alamat} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl border">Batal</button>
                                    <PrimaryButton disabled={addForm.processing}>Simpan</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditOpen && selectedGudang && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Gudang</h3>
                            <form onSubmit={submitEdit} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput id="name" name="name" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={editForm.errors.name} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="alamat" value="Alamat (opsional)" />
                                    <TextInput id="alamat" name="alamat" value={editForm.data.alamat} onChange={(e) => editForm.setData('alamat', e.target.value)} className="mt-1 block w-full" />
                                    <InputError message={editForm.errors.alamat} className="mt-2" />
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => { setIsEditOpen(false); setSelectedGudang(null); }} className="px-4 py-2 rounded-xl border">Batal</button>
                                    <PrimaryButton disabled={editForm.processing}>Update</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {isDeleteOpen && selectedGudang && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hapus Gudang</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Apakah Anda yakin ingin menghapus gudang "{selectedGudang.name}"? Tindakan ini tidak dapat dibatalkan.</p>
                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button type="button" onClick={() => { setIsDeleteOpen(false); setSelectedGudang(null); }} className="px-4 py-2 rounded-xl border">Batal</button>
                                <PrimaryButton onClick={submitDelete}>Hapus</PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
