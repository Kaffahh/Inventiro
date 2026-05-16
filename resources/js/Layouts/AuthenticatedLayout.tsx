import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
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
    Bell,
    Moon,
    Sun
} from 'lucide-react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';

interface SidebarItemProps {
    href: string;
    icon: any;
    label: string;
    active: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
                : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
                }`}
        >
            <Icon size={20} className={active ? 'text-white' : 'group-hover:text-emerald-600'} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        { href: route('dashboard'), icon: LayoutDashboard, label: 'Dashboard', name: 'dashboard' },
        { href: '#', icon: Package, label: 'Kelola Barang', name: 'barang' },
        { href: '#', icon: Layers, label: 'Kategori', name: 'kategori' },
        { href: '#', icon: Warehouse, label: 'Gudang', name: 'gudang' },
        { href: '#', icon: ArrowUpCircle, label: 'Stok Masuk', name: 'stok-masuk' },
        { href: '#', icon: ArrowDownCircle, label: 'Stok Keluar', name: 'stok-keluar' },
        { href: '#', icon: History, label: 'Riwayat', name: 'riwayat' },
        { href: '#', icon: Users, label: 'Manajemen User', name: 'users' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Manajemen<span className="text-emerald-600">Barang</span>
                            </span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                            Menu Utama
                        </div>
                        {sidebarItems.map((item) => (
                            <SidebarItem
                                key={item.label}
                                href={item.href}
                                icon={item.icon}
                                label={item.label}
                                active={route().current(item.name)}
                            />
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 rounded-lg transition-colors group"
                        >
                            <LogOut size={20} className="group-hover:text-red-600" />
                            <span className="font-medium">Keluar</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar */}
                <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                        >
                            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        {header && (
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
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

                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block"></div>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 uppercase">
                                            Admin
                                        </div>
                                    </div>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                ></div>
            )}
        </div>
    );
}
