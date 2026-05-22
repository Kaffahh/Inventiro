import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function StockIndex() {
    const { gudangs = [], barangs = { data: [] }, auth } = usePage().props as any;
    const user = auth.user;

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
        <AuthenticatedLayout header={user.role === 'admin' ? 'Manajemen Stok' : 'Riwayat Stok'}>
            <Head title="Stok" />
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab('masuk')} className={`px-4 py-2 rounded-xl ${activeTab === 'masuk' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Stok Masuk</button>
                    <button onClick={() => setActiveTab('keluar')} className={`px-4 py-2 rounded-xl ${activeTab === 'keluar' ? 'bg-red-600 text-white' : 'bg-white border'}`}>Stok Keluar</button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <form onSubmit={submit(activeTab)}>
                        <div className="space-y-4">
                            <div>
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

                        <div className="mt-4 flex justify-end gap-2">
                            <a href={route('dashboard')} className="px-4 py-2 rounded-xl text-sm">Batal</a>
                            <button type="submit" className={`px-4 py-2 rounded-xl text-sm ${activeTab === 'masuk' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{activeTab === 'masuk' ? 'Catat Masuk' : 'Catat Keluar'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
