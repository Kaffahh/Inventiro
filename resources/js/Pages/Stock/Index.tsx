import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { Search, X, Check, XCircle } from 'lucide-react';
import StockForm from '@/Components/StockForm';

export default function StockIndex() {
    const { gudangs = [], barangs = { data: [] }, transaksis = { data: [], total: 0, from: 0, to: 0 }, filters = { q: '' }, flash = { success: null, error: null }, auth, canApprove = false, canCreateTransaksi = false, assignedGudangId = null } = usePage().props as any;
    const user = auth.user;
    const [searchTerm, setSearchTerm] = useState(filters.q || '');

    const [activeTab, setActiveTab] = useState<'masuk'|'keluar'>('masuk');

    const stockForm = useForm({
        gudang_id: '',
        items: [ { barang_id: '', jumlah: '1' } ],
    });

    const addStockRow = () => stockForm.setData('items', [...stockForm.data.items, { barang_id: '', jumlah: '1' }]);
    const removeStockRow = (idx: number) => stockForm.setData('items', stockForm.data.items.filter((_: any, i: number) => i !== idx));

    const submit = (type: 'masuk'|'keluar') => (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = type === 'masuk' ? 'stok.masuk' : 'stok.keluar';
        stockForm.post(route(routeName), {
            onSuccess: () => {
                stockForm.reset('items');
                stockForm.setData('items', [ { barang_id: '', jumlah: '1' } ]);
            }
        });
    };

    return (
        <AuthenticatedLayout header={canApprove ? 'Manajemen Stok' : 'Riwayat Stok'}>
            <Head title="Stok" />

            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <form onSubmit={(e) => { e.preventDefault(); router.get(route('stok.index'), { q: searchTerm }, { preserveState: true }); }} className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari transaksi atau tipe..."
                            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button type="button" onClick={() => { setSearchTerm(''); router.get(route('stok.index'), { q: '' }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <X size={16} />
                            </button>
                        )}
                    </form>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveTab('masuk')} className={`px-3 py-2 rounded-xl ${activeTab === 'masuk' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Stok Masuk</button>
                        <button onClick={() => setActiveTab('keluar')} className={`px-3 py-2 rounded-xl ${activeTab === 'keluar' ? 'bg-red-600 text-white' : 'bg-white border'}`}>Stok Keluar</button>
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

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-bold mb-4">{activeTab === 'masuk' ? 'Catat Stok Masuk' : 'Catat Stok Keluar'}</h3>
                        <StockForm
                            mode={activeTab}
                            gudangs={gudangs}
                            barangs={barangs.data}
                            defaultGudangId={assignedGudangId ?? user?.gudang_id ?? ''}
                            lockGudang={user?.role?.slug === 'staff'}
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">
                                        <th className="px-6 py-4">#</th>
                                        <th className="px-6 py-4">Tipe</th>
                                        <th className="px-6 py-4">Qty</th>
                                        <th className="px-6 py-4">Gudang</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {transaksis.data.length > 0 ? (
                                        transaksis.data.map((tx: any) => (
                                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">TX-{String(tx.id).padStart(3, '0')}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.tipe}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.details?.reduce((s: number, d: any) => s + d.jumlah, 0)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.gudang?.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.user?.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.status}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.tgl_transaksi}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        {canApprove && auth.user?.role?.slug === 'admin' && tx.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => { if (confirm('Approve transaksi ini?')) router.post(route('stok.approve', tx.id)); }} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                                                                    <Check size={16} />
                                                                </button>
                                                                <button onClick={() => { if (confirm('Reject transaksi ini?')) router.post(route('stok.reject', tx.id)); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                                    <XCircle size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada transaksi.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {transaksis.total > 0 && (
                            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <p className="text-xs text-gray-500">Menampilkan {transaksis.from} sampai {transaksis.to} dari {transaksis.total} transaksi</p>
                                <div className="flex gap-2">
                                    {transaksis.prev_page_url ? (
                                        <button onClick={() => router.get(route('stok.index'), { page: transaksis.current_page - 1 })} className="px-3 py-1.5 rounded-lg border text-xs">Sebelumnya</button>
                                    ) : (
                                        <button disabled className="px-3 py-1.5 rounded-lg border text-xs text-gray-400">Sebelumnya</button>
                                    )}
                                    {transaksis.next_page_url ? (
                                        <button onClick={() => router.get(route('stok.index'), { page: transaksis.current_page + 1 })} className="px-3 py-1.5 rounded-lg border text-xs">Selanjutnya</button>
                                    ) : (
                                        <button disabled className="px-3 py-1.5 rounded-lg border text-xs text-gray-400">Selanjutnya</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
