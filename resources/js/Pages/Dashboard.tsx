import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/Molecules/StatCard';
import { Head, usePage } from '@inertiajs/react';
import {
    Package,
    TrendingUp,
    AlertTriangle,
    Warehouse,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';



export default function Dashboard({ stats }: { stats: any }) {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const transactions = stats.recent_transactions;

    return (
        <AuthenticatedLayout
            header={user.role === 'admin' ? "Admin Dashboard" : "Staff Dashboard Overview"}
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {user.role === 'admin' ? (
                        <>
                            <StatCard
                                title="Total Barang"
                                value={stats.total_barang.toString()}
                                icon={Package}
                                trend="Data Real"
                                trendUp={true}
                                color="bg-emerald-600"
                            />
                            <StatCard
                                title="Total Stok"
                                value={stats.total_stok.toLocaleString()}
                                icon={TrendingUp}
                                trend="Total Unit"
                                trendUp={true}
                                color="bg-blue-600"
                            />
                            <StatCard
                                title="Stok Menipis"
                                value={stats.stok_menipis.toString()}
                                icon={AlertTriangle}
                                color="bg-orange-500"
                            />
                            <StatCard
                                title="Aktivitas Transaksi"
                                value={stats.total_transaksi.toString()}
                                icon={Warehouse}
                                color="bg-purple-600"
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Tugas Pending"
                                value="5"
                                icon={Clock}
                                color="bg-yellow-500"
                            />
                            <StatCard
                                title="Input Disetujui"
                                value="28"
                                icon={CheckCircle2}
                                color="bg-emerald-600"
                            />
                            <StatCard
                                title="Input Ditolak"
                                value="2"
                                icon={XCircle}
                                color="bg-red-500"
                            />
                            <StatCard
                                title="Aktivitas Saya"
                                value="12"
                                icon={TrendingUp}
                                color="bg-blue-600"
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Charts Placeholder */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Statistik Transaksi (7 Hari Terakhir)</h3>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-2">
                            {stats.chart_data.map((data: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-lg transition-all duration-300 group-hover:bg-emerald-500 relative"
                                        style={{ height: `${(data.count / 20) * 100}%`, minHeight: '10%' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {data.count} Transaksi
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-medium">{data.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stock Alert List */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Stok Menipis</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'SSD Samsung 1TB', stock: 2, min: 5 },
                                { name: 'RAM Corsair 16GB', stock: 1, min: 10 },
                                { name: 'Power Supply 750W', stock: 4, min: 8 },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-gray-500">Sisa: {item.stock} unit</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold">
                                        CRITICAL
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
                            Lihat Semua Alert
                        </button>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaksi Terbaru</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    className="pl-10 pr-4 py-2 border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-800 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">ID Transaksi</th>
                                    <th className="px-6 py-4 font-semibold">Barang</th>
                                    <th className="px-6 py-4 font-semibold">Jenis</th>
                                    <th className="px-6 py-4 font-semibold">Jumlah</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{tx.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tx.item}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${tx.type === 'Masuk'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{tx.qty}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${tx.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                                tx.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{tx.date}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
