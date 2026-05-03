import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const STATUT = {
    termine:    { label: '🏁 Stage terminé',        cls: 'bg-gray-200 text-gray-700' },
    actif:      { label: '🟢 Stage actif',           cls: 'bg-blue-100 text-blue-800' },
    en_attente: { label: '⏳ En attente convention', cls: 'bg-amber-100 text-amber-700' },
};

export default function AdminIndexStage({ stages = [], count = 0, filters = {} }) {
    const [search, setSearch]     = useState(filters.search ?? '');
    const [statut, setStatut]     = useState(filters.statut ?? 'all');
    const [openRows, setOpenRows] = useState({});

    function applyFilters(overrides = {}) {
        router.get(route('admin.index.stage'), {
            search: overrides.search ?? search,
            statut: overrides.statut ?? statut,
        }, { preserveState: true, replace: true });
    }

    function toggleRow(id) {
        setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
    }

    function forceTerminer(stageId) {
        if (!confirm('Clôturer ce stage définitivement ?')) return;
        router.post(route('admin.stage.terminer', stageId));
    }

    const termine   = stages.filter(s => s.statut_global === 'termine').length;
    const actif     = stages.filter(s => s.statut_global === 'actif').length;
    const enAttente = stages.filter(s => s.statut_global === 'en_attente').length;

    return (
        <AdminLayout title="Suivi des stages">
            <Head title="Stages — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard label="Total"            value={count}    color="blue" />
                <StatCard label="Terminés"         value={termine}  color="gray" />
                <StatCard label="Actifs"           value={actif}    color="indigo" />
                <StatCard label="En attente conv." value={enAttente}color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Étudiant, entreprise, sujet…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',        label: 'Tous' },
                        { value: 'termine',    label: 'Terminés' },
                        { value: 'actif',      label: 'Actifs' },
                        { value: 'en_attente', label: 'En attente' },
                    ].map(f => (
                        <button key={f.value}
                            onClick={() => { setStatut(f.value); applyFilters({ statut: f.value }); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                statut === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <button onClick={() => applyFilters()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                    Filtrer
                </button>
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {stages.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-10 text-center text-sm text-gray-400">
                        Aucun stage trouvé.
                    </div>
                ) : stages.map(stage => {
                    const u    = stage.etudiant?.utilisateur;
                    const cv   = stage.convention_status;
                    const open = openRows[stage.id] ?? false;
                    const st   = STATUT[stage.statut_global] ?? STATUT.en_attente;

                    return (
                        <div key={stage.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* ── Ligne principale ── */}
                            <div className="flex items-center gap-4 px-4 py-3 flex-wrap cursor-pointer hover:bg-slate-50 transition"
                                onClick={() => toggleRow(stage.id)}>

                                <span className="text-xs text-gray-400 w-6 shrink-0">#{stage.id}</span>

                                {/* Étudiant */}
                                <div className="flex-1 min-w-48">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {u ? `${u.nom} ${u.prenom ?? ''}` : '—'}
                                    </div>
                                    <div className="text-xs text-gray-400 truncate max-w-xs">{stage.sujet}</div>
                                </div>

                                {/* Entreprise */}
                                <span className="text-xs text-gray-600 bg-slate-50 px-2 py-1 rounded-lg shrink-0">
                                    🏢 {stage.entreprise?.nom_entreprise ?? '—'}
                                </span>

                                {/* Durée */}
                                <span className="text-xs text-gray-500 shrink-0">{stage.duree_en_semaine} sem.</span>

                                {/* Convention mini-badges */}
                                {cv ? (
                                    <div className="flex gap-1 shrink-0">
                                        <Sign label="E" signed={cv.entreprise} title="Entreprise" />
                                        <Sign label="T" signed={cv.tuteur}     title="Tuteur" />
                                        <Sign label="É" signed={cv.etudiant}   title="Étudiant" />
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-300 shrink-0">—</span>
                                )}

                                {/* Dossier badge */}
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                    stage.dossier_valide ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                    {stage.dossier_valide ? '📁 Dossier validé' : '📁 Dossier en attente'}
                                </span>

                                {/* Statut global */}
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${st.cls}`}>
                                    {st.label}
                                </span>

                                <span className="text-slate-300 text-xs shrink-0">{open ? '▲' : '▼'}</span>
                            </div>

                            {/* ── Panneau dépliable ── */}
                            {open && (
                                <div className="border-t border-gray-50 bg-slate-50 px-4 py-4 grid md:grid-cols-2 gap-4">

                                    {/* Infos stage */}
                                    <div className="bg-white rounded-lg border border-slate-100 p-4">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Stage</p>
                                        <dl className="space-y-1.5 text-sm">
                                            <Row label="Sujet"     value={stage.sujet} />
                                            <Row label="Étudiant"  value={u ? `${u.nom} ${u.prenom ?? ''}` : '—'} />
                                            <Row label="Filière"   value={stage.etudiant?.filiere?.filiere ?? '—'} />
                                            <Row label="Entreprise" value={stage.entreprise?.nom_entreprise ?? '—'} />
                                            <Row label="Tuteur"    value={
                                                stage.tuteur?.utilisateur
                                                    ? `${stage.tuteur.utilisateur.nom} ${stage.tuteur.utilisateur.prenom ?? ''}`
                                                    : '—'
                                            } />
                                            <Row label="Durée"     value={`${stage.duree_en_semaine} semaines`} />
                                            <Row label="Début"     value={stage.dateDebut ?? '—'} />
                                        </dl>
                                    </div>

                                    {/* Convention + dossier */}
                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg border border-slate-100 p-4">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Convention</p>
                                            {cv ? (
                                                <div className="space-y-2">
                                                    {[
                                                        { label: 'Entreprise', signed: cv.entreprise },
                                                        { label: 'Tuteur',     signed: cv.tuteur },
                                                        { label: 'Étudiant',   signed: cv.etudiant },
                                                    ].map(p => (
                                                        <div key={p.label} className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-600">{p.label}</span>
                                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                                p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {p.signed ? '✓ Signé' : '○ En attente'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400">Aucune convention enregistrée.</p>
                                            )}
                                        </div>

                                        <div className="bg-white rounded-lg border border-slate-100 p-4">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Dossier</p>
                                            <span className={`text-sm font-semibold ${
                                                stage.dossier_valide ? 'text-green-700' : 'text-amber-600'
                                            }`}>
                                                {stage.dossier_valide ? '✅ Validé par le jury' : '⏳ En attente de validation'}
                                            </span>
                                        </div>

                                        {stage.statut_global !== 'termine' && (
                                            <div className="bg-white rounded-lg border border-red-100 p-4">
                                                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Actions admin</p>
                                                <button
                                                    onClick={() => forceTerminer(stage.id)}
                                                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
                                                >
                                                    🏁 Force terminer le stage
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}

function Sign({ label, signed, title }) {
    return (
        <span title={title} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
            signed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
        }`}>
            {label}
        </span>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex gap-2">
            <span className="text-slate-400 w-24 shrink-0">{label}</span>
            <span className="text-slate-700 font-medium">{value}</span>
        </div>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue:   'bg-blue-50 text-blue-700',
        green:  'bg-green-50 text-green-700',
        amber:  'bg-amber-50 text-amber-700',
        indigo: 'bg-indigo-50 text-indigo-700',
        teal:   'bg-teal-50 text-teal-700',
        gray:   'bg-gray-100 text-gray-600',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}
