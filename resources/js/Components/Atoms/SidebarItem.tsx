import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick?: () => void;
}

export default function SidebarItem({ href, icon: Icon, label, active, onClick }: SidebarItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
            }`}
        >
            <Icon size={20} className={active ? 'text-white' : 'group-hover:text-emerald-600'} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}
