import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

export default function StaffIndex() {
    const { transaksis = { data: [], total: 0, from: 0, to: 0 }, auth, canCreateTransaksi = false, canApprove = false } = usePage().props as any;
    const user = auth.user;

    return (
        <AuthenticatedLayout header="Tugas Saya">
            <Head title="Tugas Saya" />

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold mb-4">Tugas untuk: {user.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Gudang: {user.gudang?.name ?? 'Belum ditetapkan'}</p>

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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada tugas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
