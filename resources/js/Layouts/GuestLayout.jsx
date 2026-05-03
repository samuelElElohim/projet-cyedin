import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <Link href="/" className="flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10">
                    <div className="absolute inset-0 bg-blue-600 rounded-xl rotate-3 shadow-lg" />
                    <div className="absolute inset-0 bg-emerald-500 rounded-xl -rotate-6 opacity-80 mix-blend-multiply" />
                    <span className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">CY</span>
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-800">
                    CY<span className="text-blue-600">edin</span>
                </span>
            </Link>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
