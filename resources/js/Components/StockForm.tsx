import React from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    mode: 'masuk' | 'keluar';
    gudangs: any[];
    barangs: any[];
}

export default function StockForm({ mode, gudangs, barangs }: Props) {
    const stockForm = useForm({ gudang_id: '', items: [{ barang_id: '', jumlah: '1' }] });

    const addStockRow = () => stockForm.setData('items', [...stockForm.data.items, { barang_id: '', jumlah: '1' }]);
    const removeStockRow = (idx: number) => stockForm.setData('items', stockForm.data.items.filter((_: any, i: number) => i !== idx));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = mode === 'masuk' ? 'stok.masuk' : 'stok.keluar';
        stockForm.post(route(routeName));
    };

    return (
        <div>
            {stockForm.errors && Object.keys(stockForm.errors).length > 0 && (
                <div className="p-3 mb-4 bg-red-50 text-red-700 rounded">Periksa kembali input Anda.</div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="text-sm font-semibold">Pilih Gudang</label>
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white px-4 py-2" value={stockForm.data.gudang_id} onChange={e => stockForm.setData('gudang_id', e.target.value)} required>
                        <option value="">Pilih Gudang</option>
                        {gudangs.map(g => (<option key={g.id} value={g.id}>{g.name}</option>))}
                    </select>
                    {stockForm.errors.gudang_id && <div className="text-xs text-red-600 mt-1">{stockForm.errors.gudang_id}</div>}
                </div>

                {stockForm.data.items.map((row: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 items-end">
                        <select className="rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white px-3 py-2" value={row.barang_id} onChange={e => {
                            const items = [...stockForm.data.items]; items[idx].barang_id = e.target.value; stockForm.setData('items', items);
                        }} required>
                            <option value="">Pilih Barang</option>
                            {barangs.map((b: any) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                        </select>
                            <input type="number" min="1" className="rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white px-3 py-2" value={row.jumlah} onChange={e => {
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

                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={() => { stockForm.reset(); stockForm.setData('items', [{ barang_id: '', jumlah: '1' }]); }} className="px-4 py-2 rounded-xl border">Reset</button>
                    <button type="submit" className={`px-4 py-2 rounded-xl text-sm ${mode === 'masuk' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{mode === 'masuk' ? 'Catat Masuk' : 'Catat Keluar'}</button>
                </div>
            </form>
        </div>
    );
}
