import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

type StaffStat = {
    my_pending: number;
    my_approved: number;
    my_rejected: number;
    my_total: number;
};

type RecentTx = {
    id: number;
    tipe: string;
    status: string;
    tanggal: string;
    gudang: string | null;
    total_qty: number;
    items: string[];
};

type LowStockItem = {
    id: number;
    name: string;
    stok: number;
    min_stok: number;
};

export default function StaffIndex({
    stats,
    recent,
    lowStockItems,
}: {
    stats: StaffStat;
    recent: RecentTx[];
    lowStockItems: LowStockItem[];
}) {
    return (
        <AuthenticatedLayout header="Staff Page">
            <Head title="Staff Page" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Transaksi Saya</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{stats.my_total}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="mt-2 text-3xl font-bold text-amber-600">{stats.my_pending}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Approved</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.my_approved}</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-5">
                        <p className="text-sm text-gray-500">Rejected</p>
                        <p className="mt-2 text-3xl font-bold text-rose-600">{stats.my_rejected}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 rounded-2xl border bg-white p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terakhir Saya</h3>
                            <Link href={route('dashboard')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                Ke Dashboard
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="py-2 pr-3">Tanggal</th>
                                        <th className="py-2 pr-3">Tipe</th>
                                        <th className="py-2 pr-3">Gudang</th>
                                        <th className="py-2 pr-3">Qty</th>
                                        <th className="py-2 pr-3">Status</th>
                                        <th className="py-2">Item</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.length > 0 ? (
                                        recent.map((tx) => (
                                            <tr key={tx.id} className="border-b last:border-b-0">
                                                <td className="py-2 pr-3 text-gray-700">{tx.tanggal}</td>
                                                <td className="py-2 pr-3 capitalize">{tx.tipe}</td>
                                                <td className="py-2 pr-3">{tx.gudang ?? '-'}</td>
                                                <td className="py-2 pr-3">{tx.total_qty}</td>
                                                <td className="py-2 pr-3 capitalize">{tx.status}</td>
                                                <td className="py-2 text-gray-700">{tx.items.join(', ') || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                                Belum ada transaksi untuk akun ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Perlu Perhatian</h3>
                        <div className="space-y-3">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map((item) => (
                                    <div key={item.id} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-amber-800">
                                            Stok {item.stok} / Min {item.min_stok}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">Tidak ada stok menipis saat ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
