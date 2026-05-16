import { Link } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick?: () => void;
    isMinimized?: boolean;
}

export default function SidebarItem({ href, icon: Icon, label, active, onClick, isMinimized }: SidebarItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center rounded-xl transition-all duration-300 group relative ${
                isMinimized ? 'justify-center p-3 mx-2' : 'gap-3 px-4 py-3 mx-0'
            } ${
                active 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'
            }`}
            title={isMinimized ? label : ''}
        >
            <Icon 
                size={isMinimized ? 22 : 20} 
                className={`shrink-0 transition-colors ${active ? 'text-white' : 'group-hover:text-emerald-600'}`} 
            />
            
            {!isMinimized && (
                <span className="font-medium whitespace-nowrap transition-all duration-300">
                    {label}
                </span>
            )}

            {isMinimized && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                </div>
            )}
        </Link>
    );
}
