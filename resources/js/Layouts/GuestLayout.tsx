import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 sm:justify-center dark:bg-gray-900">
            <div className="w-full overflow-hidden bg-white px-4 py-4 shadow-md sm:max-w-md sm:rounded-3xl dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}
