import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Image as ImageIcon,
    Eye,
    ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';

export default function BarangIndex() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    
    const [searchTerm, setSearchTerm] = useState('');

    const barangs = [
        { id: 1, name: 'MacBook Pro M3', sku: 'MBP-M3-001', kategori: 'Elektronik', gudang: 'Gudang Utama', stok: 15, min_stok: 5, foto: null },
        { id: 2, name: 'Logitech MX Master 3S', sku: 'MS-MX3-002', kategori: 'Aksesoris', gudang: 'Gudang B', stok: 45, min_stok: 10, foto: null },
        { id: 3, name: 'Dell UltraSharp 27', sku: 'MON-DELL-003', kategori: 'Elektronik', gudang: 'Gudang Utama', stok: 3, min_stok: 5, foto: null },
        { id: 4, name: 'Keychron K2 V2', sku: 'KB-K2-004', kategori: 'Aksesoris', gudang: 'Gudang B', stok: 20, min_stok: 8, foto: null },
    ];

    return (
        <AuthenticatedLayout
            header={user.role === 'admin' ? "Kelola Data Barang" : "Daftar Barang & Stok"}
        >
            <Head title="Barang" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari nama barang atau SKU..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                        
                        {user.role === 'admin' && (
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform active:scale-95">
                                <Plus size={18} />
                                <span>Tambah Barang</span>
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
                                    <th className="px-6 py-4">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors">
                                            Info Barang <ArrowUpDown size={14} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Gudang</th>
                                    <th className="px-6 py-4 text-center">Stok</th>
                                    <th className="px-6 py-4">Status Stok</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {barangs.map((item) => (
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
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
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
                                                {item.kategori}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {item.gudang}
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
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role === 'admin' ? (
                                                    <>
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Placeholder */}
                    <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-xs text-gray-500">Menampilkan 1 sampai 4 dari 4 barang</p>
                        <div className="flex gap-2">
                            <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 cursor-not-allowed">Previous</button>
                            <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-400 cursor-not-allowed">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
