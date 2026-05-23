import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SidebarItem from '@/Components/Atoms/SidebarItem';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    Layers,
    Warehouse,
    ArrowUpCircle,
    ArrowDownCircle,
    History,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Dark mode toggle logic
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDarkMode(false);
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

        const sidebarItems = [
        { href: route('dashboard'), icon: LayoutDashboard, label: 'Dashboard', name: 'dashboard', roles: ['admin', 'staff'] },
        { href: route('barang.index'), icon: Package, label: user.role === 'admin' ? 'Kelola Barang' : 'Lihat Barang', name: 'barang.index', roles: ['admin', 'staff'] },
        { href: route('kategori.index'), icon: Layers, label: 'Kategori', name: 'kategori.index', roles: ['admin'] },
        { href: route('gudang.index'), icon: Warehouse, label: 'Gudang', name: 'gudang.index', roles: ['admin'] },
        { href: route('staff.index'), icon: History, label: 'Tugas Saya', name: 'staff.index', roles: ['staff'] },
        { href: route('stok.index'), icon: ArrowUpCircle, label: 'Stok', name: 'stok.index', roles: ['admin', 'staff'] },
        { href: route('users.index'), icon: Users, label: 'Manajemen User', name: 'users.index', roles: ['admin'] },
    ];

    const filteredItems = sidebarItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden font-poppins">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 transform 
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 lg:static lg:inset-0 shrink-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-[0.15em] text-gray-900 dark:text-emerald-300/80 uppercase">
                                Inventiro
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-gray-500"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                            Menu Utama
                        </div>
                        {filteredItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                active={route().current(item.name)}
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1 shrink-0 bg-white dark:bg-gray-900">
                        <SidebarItem
                            href={route('profile.edit')}
                            icon={Settings}
                            label="Pengaturan Profil"
                            active={route().current('profile.edit')}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-xl transition-colors group"
                        >
                            <LogOut size={20} className="group-hover:text-red-600" />
                            <span className="font-medium">Keluar Akun</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Navbar */}
                <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                        >
                            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        {header && (
                            <div className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 p-1">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                                    {user.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 uppercase">
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
