import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatCard from '@/Components/Molecules/StatCard';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
    XCircle,
    Check,
    CircleX,
} from 'lucide-react';

type ChartPoint = {
    date: string;
    count: number;
};

type DashboardTransaction = {
    raw_id: number;
    id: string;
    item: string;
    type: string;
    qty: number;
    status: string;
    date: string;
};

type TransactionTypeFilter = 'Semua' | 'Masuk' | 'Keluar';
type TransactionStatusFilter = 'Semua' | 'Approved' | 'Pending' | 'Rejected';


export default function Dashboard({ stats }: { stats: any }) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const canManageTransactions = user.role === 'admin';
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('Semua');
    const [statusFilter, setStatusFilter] = useState<TransactionStatusFilter>('Semua');
    const [transactions, setTransactions] = useState<DashboardTransaction[]>(stats.recent_transactions ?? []);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const chartData: ChartPoint[] = stats.chart_data ?? [];

    const chartMetrics = useMemo(() => {
        const maxValue = Math.max(...chartData.map((point) => point.count), 1);
        const totalValue = chartData.reduce((sum, point) => sum + point.count, 0);

        return {
            maxValue,
            totalValue,
            hasData: chartData.length > 0,
        };
    }, [chartData]);

    useEffect(() => {
        const initialTransactions = stats.recent_transactions ?? [];
        setTransactions(initialTransactions);
        setActiveActionId(null);
    }, [stats.recent_transactions]);

    const filteredTransactions = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return transactions.filter((tx) => {
            const matchesSearch =
                !query ||
                [tx.id, tx.item, tx.type, tx.status, tx.date].some((value) =>
                    value.toLowerCase().includes(query),
                );

            const matchesType = typeFilter === 'Semua' || tx.type === typeFilter;
            const matchesStatus = statusFilter === 'Semua' || tx.status === statusFilter;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [transactions, searchTerm, typeFilter, statusFilter]);

    const approveTransaction = (transaction: DashboardTransaction) => {
        router.post(route('stok.approve', transaction.raw_id), undefined, {
            preserveScroll: true,
            onSuccess: () => {
                setTransactions((currentTransactions) =>
                    currentTransactions.map((item) =>
                        item.raw_id === transaction.raw_id ? { ...item, status: 'Approved' } : item,
                    ),
                );
                setActiveActionId(null);
            },
        });
    };

    const rejectTransaction = (transaction: DashboardTransaction) => {
        router.post(route('stok.reject', transaction.raw_id), undefined, {
            preserveScroll: true,
            onSuccess: () => {
                setTransactions((currentTransactions) =>
                    currentTransactions.map((item) =>
                        item.raw_id === transaction.raw_id ? { ...item, status: 'Rejected' } : item,
                    ),
                );
                setActiveActionId(null);
            },
        });
    };

    const handleCopyTransactionId = async (transactionId: string) => {
        await navigator.clipboard.writeText(transactionId);
        setActiveActionId(null);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setTypeFilter('Semua');
        setStatusFilter('Semua');
        setShowFilterMenu(false);
    };

    const transactionsCountLabel = `${filteredTransactions.length} transaksi`;

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
                    <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Statistik Transaksi (7 Hari Terakhir)</h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Total {chartMetrics.totalValue} transaksi tercatat dalam 7 hari terakhir.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                Transaksi Harian
                            </div>
                        </div>

                        <div className="p-6">
                            {chartMetrics.hasData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400 sm:grid-cols-3">
                                        <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                                            Puncak
                                            <div className="mt-1 text-sm font-bold text-gray-900 dark:text-white">{chartMetrics.maxValue} transaksi</div>
                                        </div>
                                        <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                                            Rata-rata
                                            <div className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                                {Math.round(chartMetrics.totalValue / chartData.length || 0)} transaksi
                                            </div>
                                        </div>
                                        <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                                            Hari aktif
                                            <div className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                                                {chartData.filter((point) => point.count > 0).length} hari
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 via-white to-white p-4 dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900">
                                        <svg viewBox="0 0 700 260" className="h-72 w-full">
                                            {Array.from({ length: 5 }).map((_, index) => {
                                                const y = 40 + index * 45;

                                                return (
                                                    <g key={index}>
                                                        <line
                                                            x1="40"
                                                            x2="680"
                                                            y1={y}
                                                            y2={y}
                                                            stroke="currentColor"
                                                            strokeOpacity="0.08"
                                                            strokeWidth="1"
                                                        />
                                                        <text
                                                            x="14"
                                                            y={y + 4}
                                                            className="fill-gray-400 text-[10px] dark:fill-gray-500"
                                                        >
                                                            {Math.round(chartMetrics.maxValue - (chartMetrics.maxValue / 4) * index)}
                                                        </text>
                                                    </g>
                                                );
                                            })}

                                            {chartData.map((point, index) => {
                                                const barWidth = 70;
                                                const spacing = 20;
                                                const x = 50 + index * (barWidth + spacing);
                                                const usableHeight = 160;
                                                const barHeight = Math.max((point.count / chartMetrics.maxValue) * usableHeight, 8);
                                                const y = 210 - barHeight;
                                                const centerX = x + barWidth / 2;

                                                return (
                                                    <g key={point.date}>
                                                        <rect
                                                            x={x}
                                                            y={y}
                                                            width={barWidth}
                                                            height={barHeight}
                                                            rx="16"
                                                            fill="url(#barGradient)"
                                                        />
                                                        <circle cx={centerX} cy={y} r="4" fill="#10b981" />
                                                        <text
                                                            x={centerX}
                                                            y={y - 10}
                                                            textAnchor="middle"
                                                            className="fill-gray-700 text-[11px] font-semibold dark:fill-gray-200"
                                                        >
                                                            {point.count}
                                                        </text>
                                                        <text
                                                            x={centerX}
                                                            y="238"
                                                            textAnchor="middle"
                                                            className="fill-gray-400 text-[10px] font-medium dark:fill-gray-500"
                                                        >
                                                            {point.date}
                                                        </text>
                                                        <rect
                                                            x={x}
                                                            y={40}
                                                            width={barWidth}
                                                            height={170}
                                                            rx="16"
                                                            fill="transparent"
                                                        >
                                                            <title>{`${point.date}: ${point.count} transaksi`}</title>
                                                        </rect>
                                                    </g>
                                                );
                                            })}

                                            <defs>
                                                <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#34d399" />
                                                    <stop offset="100%" stopColor="#059669" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center dark:border-gray-800 dark:bg-gray-800/40">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <TrendingUp size={22} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Belum ada data transaksi untuk ditampilkan.</p>
                                    <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                                        Saat transaksi masuk ke sistem, grafik ini akan otomatis terisi.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stock Alert List */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Stok Menipis</h3>
                        <div className="space-y-4">
                            {stats.low_stock_items && stats.low_stock_items.length > 0 ? (
                                stats.low_stock_items.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                                <AlertTriangle size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[130px] sm:max-w-none">{item.name}</p>
                                                <p className="text-xs text-gray-500">Sisa: {item.stock} unit</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold">
                                            CRITICAL
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-2">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-500">Semua stok barang aman.</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
                            Lihat Semua Alert
                        </button>
                    </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaksi Terbaru</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {transactionsCountLabel} tampil dari {transactions.length} data
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto lg:min-w-[520px]">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder="Cari ID, barang, tipe, status, atau tanggal..."
                                        className="w-full pl-10 pr-4 py-2.5 border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-800 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                </div>

                                <button
                                    onClick={() => setShowFilterMenu((current) => !current)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
                                >
                                    <Filter size={16} />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {showFilterMenu && (
                            <div className="ml-auto w-full lg:w-auto lg:min-w-[520px] rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                            Jenis Transaksi
                                        </label>
                                        <select
                                            value={typeFilter}
                                            onChange={(event) => setTypeFilter(event.target.value as TransactionTypeFilter)}
                                            className="w-full px-4 py-2.5 border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-900 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="Semua">Semua Jenis</option>
                                            <option value="Masuk">Masuk</option>
                                            <option value="Keluar">Keluar</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(event) => setStatusFilter(event.target.value as TransactionStatusFilter)}
                                            className="w-full px-4 py-2.5 border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-900 dark:text-white text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option value="Semua">Semua Status</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-4">
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowFilterMenu(false)}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
                                    >
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        )}
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
                                    {canManageTransactions && <th className="px-6 py-4 font-semibold text-center">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
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
                                            {canManageTransactions && (
                                                <td className="px-6 py-4 text-center relative">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {tx.status === 'Pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => approveTransaction(tx)}
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                                                                >
                                                                    <Check size={14} />
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => rejectTransaction(tx)}
                                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                                                                >
                                                                    <CircleX size={14} />
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">-</span>
                                                        )}

                                                        <button
                                                            onClick={() => setActiveActionId(activeActionId === tx.id ? null : tx.id)}
                                                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                        >
                                                            <MoreHorizontal size={18} />
                                                        </button>
                                                    </div>

                                                    {activeActionId === tx.id && (
                                                        <div className="absolute right-6 top-12 z-20 w-52 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg p-2 text-left">
                                                            <button
                                                                onClick={() => handleCopyTransactionId(tx.id)}
                                                                className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left"
                                                            >
                                                                Salin ID transaksi
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={canManageTransactions ? 7 : 6} className="px-6 py-12 text-center">
                                            <div className="mx-auto max-w-sm">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Tidak ada transaksi yang cocok</p>
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    Coba ubah kata kunci pencarian atau reset filter untuk melihat data lain.
                                                </p>
                                                <button
                                                    onClick={resetFilters}
                                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors"
                                                >
                                                    Reset Filter
                                                </button>
                                            </div>
                                        </td>
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
