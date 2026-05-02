import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AdminTrace({ trace = '' }) {
    const lines = trace
        ? trace.split('\n').filter(Boolean).reverse()
        : [];

    const [archiveYear, setArchiveYear] = useState(new Date().getFullYear());
    const [resetYear, setResetYear]     = useState(new Date().getFullYear());
    const [archives, setArchives]       = useState([]);
    const [loadingArchives, setLoadingArchives] = useState(true);
    const [confirmReset, setConfirmReset] = useState(false);

    const { post, processing } = useForm({});

    // Charger la liste des archives au montage
    useEffect(() => {
        fetch(route('admin.lister.archives'))
            .then(r => r.json())
            .then(data => { setArchives(data.archives ?? []); setLoadingArchives(false); })
            .catch(() => setLoadingArchives(false));
    }, []);

    function doArchive(e) {
        e.preventDefault();
        router.post(route('admin.archiver.annee'), { annee: archiveYear });
    }

    function doReset(e) {
        e.preventDefault();
        if (!confirmReset) { setConfirmReset(true); return; }
        router.post(route('admin.reset.annee'), { annee: resetYear }, {
            onSuccess: () => {
                setConfirmReset(false);
                // Recharger les archives
                fetch(route('admin.lister.archives'))
                    .then(r => r.json())
                    .then(data => setArchives(data.archives ?? []));
            },
        });
    }

    return (
        <AdminLayout title="Fichier trace & Archivage">
            <Head title="Trace — Admin" />

            <div className="grid lg:grid-cols-3 gap-6">

                {/* ── Trace log ── */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">Journal d'activité</h2>
                            <p className="text-xs text-gray-400">{lines.length} entrée(s) — les plus récentes en premier</p>
                        </div>
                        <a
                            href={route('admin.trace.export')}
                            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
                        >
                            ⬇ Exporter .log
                        </a>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-4 overflow-auto max-h-[60vh] font-mono text-xs space-y-1">
                        {lines.length === 0 ? (
                            <p className="text-slate-500">Aucune entrée dans le journal.</p>
                        ) : lines.map((line, i) => (
                            <LogLine key={i} line={line} />
                        ))}
                    </div>
                </div>

                {/* ── Colonne droite ── */}
                <div className="space-y-4">

                    {/* Archivage annuel */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-1">Archivage annuel</h2>
                        <p className="text-xs text-gray-400 mb-4">
                            Génère un snapshot JSON des stages et dossiers dans{' '}
                            <code className="bg-gray-100 px-1 rounded">storage/app/archives/</code>.
                        </p>
                        <form onSubmit={doArchive} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Année à archiver</label>
                                <input type="number" value={archiveYear}
                                    onChange={e => setArchiveYear(e.target.value)}
                                    min={2020} max={2100}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <button type="submit" disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm">
                                {processing ? 'Archivage…' : '📦 Lancer l\'archivage'}
                            </button>
                        </form>
                    </div>

                    {/* ── Réinitialisation nouvelle année ── */}
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-red-800 mb-1">⚠️ Réinitialisation nouvelle année</h2>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            Archive les données courantes puis <strong>supprime</strong> stages, dossiers, conventions, candidatures et cahiers.
                            Les comptes utilisateurs, offres et documents sont conservés.
                        </p>
                        <form onSubmit={doReset} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Année à réinitialiser</label>
                                <input type="number" value={resetYear}
                                    onChange={e => { setResetYear(e.target.value); setConfirmReset(false); }}
                                    min={2020} max={2100}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                                />
                            </div>
                            {confirmReset && (
                                <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                                    ⚠️ Cette action est irréversible. Cliquer à nouveau pour confirmer.
                                </div>
                            )}
                            <button type="submit" disabled={processing}
                                className={`w-full py-2.5 font-semibold rounded-lg transition disabled:opacity-60 text-sm ${
                                    confirmReset
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                }`}>
                                {processing ? 'Réinitialisation…' : confirmReset ? '⚠️ Confirmer la réinitialisation' : '🔄 Nouvelle année scolaire'}
                            </button>
                        </form>
                    </div>

                    {/* ── Liste des archives ── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-3">Archives disponibles</h2>
                        {loadingArchives ? (
                            <p className="text-xs text-gray-400">Chargement…</p>
                        ) : archives.length === 0 ? (
                            <p className="text-xs text-gray-400">Aucune archive trouvée.</p>
                        ) : (
                            <ul className="space-y-2">
                                {archives.map(a => (
                                    <li key={a.fichier} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-slate-800 truncate">
                                                {a.type === 'reset_annuel' ? '🔄' : '📦'} {a.annee}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {a.nb_stages} stage{a.nb_stages !== 1 ? 's' : ''} · {a.nb_dossiers} dossier{a.nb_dossiers !== 1 ? 's' : ''} · {a.taille_ko} Ko
                                            </div>
                                            <div className="text-[10px] text-slate-300 truncate">{a.fichier}</div>
                                        </div>
                                        <a
                                            href={`${route('admin.telecharger.archive')}?fichier=${encodeURIComponent(a.fichier)}`}
                                            className="ml-2 shrink-0 px-2 py-1 bg-slate-800 text-white text-[10px] rounded hover:bg-slate-700 transition"
                                        >
                                            ↓
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Infos scheduler */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-800 mb-2">⏰ Notifications périodiques</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            La commande <code className="bg-amber-100 px-1 rounded">admin:notifications-periodiques</code> envoie
                            automatiquement un résumé aux admins via le scheduler Laravel.
                        </p>
                        <pre className="mt-2 bg-amber-100 rounded p-2 text-[10px] text-amber-900 overflow-x-auto whitespace-pre-wrap">
{`Schedule::command(
  'admin:notifications-periodiques'
)->dailyAt('08:00');`}
                        </pre>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function LogLine({ line }) {
    const color = line.includes('reset_annee')   ? 'text-red-400'
                : line.includes('toggle')        ? 'text-yellow-400'
                : line.includes('valider')       ? 'text-green-400'
                : line.includes('refuser')       ? 'text-red-400'
                : line.includes('store_user')    ? 'text-blue-400'
                : line.includes('archiver')      ? 'text-purple-400'
                : 'text-slate-400';

    const match = line.match(/^\[([^\]]+)\](.*)/);
    if (!match) return <p className={color}>{line}</p>;

    return (
        <p>
            <span className="text-slate-600">[{match[1]}]</span>
            <span className={color}>{match[2]}</span>
        </p>
    );
}