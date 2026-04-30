import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/**
 * Cloche de notification avec dropdown — utilisable dans tous les layouts.
 * Attend `notifications` dans les props Inertia (tableau d'objets).
 */
export default function NotifDropdown() {
    const { notifications = [] } = usePage().props;
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const nonLues = notifications.filter(n => !n.est_lu);

    // Ferme si clic en dehors
    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function marquerLues() {
        router.post(route('notifications.mark-read'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <div ref={ref} className="relative ml-auto">
            {/* Cloche */}
            <button
                onClick={() => setOpen(p => !p)}
                aria-label={nonLues.length > 0
                    ? `${nonLues.length} notification${nonLues.length > 1 ? 's' : ''} non lue${nonLues.length > 1 ? 's' : ''}`
                    : 'Notifications'}
                aria-expanded={open}
                aria-haspopup="true"
                className="relative p-2 text-slate-400 hover:text-slate-700 transition rounded-lg hover:bg-slate-100"
            >
                <span className="text-xl" aria-hidden="true">🔔</span>
                {nonLues.length > 0 && (
                    <span
                        className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                        aria-hidden="true"
                    >
                        {nonLues.length > 9 ? '9+' : nonLues.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    role="dialog"
                    aria-label="Notifications"
                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <h2 className="text-sm font-semibold text-slate-800">
                            Notifications
                            {nonLues.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {nonLues.length} nouvelle{nonLues.length > 1 ? 's' : ''}
                                </span>
                            )}
                        </h2>
                        {nonLues.length > 0 && (
                            <button
                                onClick={marquerLues}
                                className="text-xs text-slate-400 hover:text-slate-700 transition"
                            >
                                Tout marquer lu
                            </button>
                        )}
                    </div>

                    {/* Liste */}
                    <ul className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <li className="px-4 py-8 text-center text-sm text-slate-400">
                                <p className="text-2xl mb-2" aria-hidden="true">🔕</p>
                                Aucune notification.
                            </li>
                        ) : notifications.map(n => (
                            <li
                                key={n.id}
                                className={`px-4 py-3 hover:bg-slate-50 transition ${!n.est_lu ? 'bg-blue-50/40' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Point non-lu */}
                                    <span
                                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.est_lu ? 'bg-blue-500' : 'bg-transparent'}`}
                                        aria-hidden="true"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700 leading-snug">{n.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {n.date_envoi
                                                ? new Date(n.date_envoi).toLocaleDateString('fr-FR', {
                                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                })
                                                : '—'}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}