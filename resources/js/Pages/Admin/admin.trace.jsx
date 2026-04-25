import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminTrace({ trace = '' }) {
    const lines = trace
        ? trace.split('\n').filter(Boolean).reverse() // plus récent en haut
        : [];

    const [archiveYear, setArchiveYear] = useState(new Date().getFullYear());
    const { post, processing } = useForm({});

    function doArchive(e) {
        e.preventDefault();
        router.post(route('admin.archiver.annee'), { annee: archiveYear });
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

                {/* ── Archivage annuel ── */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-800 mb-1">Archivage annuel</h2>
                        <p className="text-xs text-gray-400 mb-4">
                            Génère un snapshot JSON complet des stages et dossiers de l'année sélectionnée,
                            stocké dans <code className="bg-gray-100 px-1 rounded">storage/app/archives/</code>.
                        </p>

                        <form onSubmit={doArchive} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Année à archiver</label>
                                <input
                                    type="number"
                                    value={archiveYear}
                                    onChange={e => setArchiveYear(e.target.value)}
                                    min={2020}
                                    max={2100}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Archivage…' : '📦 Lancer l\'archivage'}
                            </button>
                        </form>
                    </div>

                    {/* Infos scheduler */}
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-amber-800 mb-2">⏰ Notifications périodiques</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            La commande <code className="bg-amber-100 px-1 rounded">admin:notifications-periodiques</code> envoie
                            automatiquement un résumé aux admins. Activez-la via le scheduler Laravel dans{' '}
                            <code className="bg-amber-100 px-1 rounded">routes/console.php</code>.
                        </p>
                        <pre className="mt-2 bg-amber-100 rounded p-2 text-[10px] text-amber-900 overflow-x-auto whitespace-pre-wrap">
{`Schedule::command(
  'admin:notifications-periodiques'
)->daily();`}
                        </pre>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function LogLine({ line }) {
    // Colorise selon le type d'action
    const color = line.includes('toggle')       ? 'text-yellow-400'
                : line.includes('valider')      ? 'text-green-400'
                : line.includes('refuser')      ? 'text-red-400'
                : line.includes('store_user')   ? 'text-blue-400'
                : line.includes('archiver')     ? 'text-purple-400'
                : 'text-slate-400';

    // Extrait timestamp entre crochets
    const match = line.match(/^\[([^\]]+)\](.*)/);
    if (!match) return <p className={`${color}`}>{line}</p>;

    return (
        <p>
            <span className="text-slate-600">[{match[1]}]</span>
            <span className={color}>{match[2]}</span>
        </p>
    );
}
