import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminIndexDossier({ dossiers = [], count = 0, filters = {} }) {
    const [search, setSearch]   = useState(filters.search ?? '');
    const [statut, setStatut]   = useState(filters.statut ?? 'all');
    const [openRows, setOpenRows] = useState({});

    function applyFilters(overrides = {}) {
        router.get(route('admin.index.dossier'), {
            search: overrides.search ?? search,
            statut: overrides.statut ?? statut,
        }, { preserveState: true, replace: true });
    }

    function toggleDossier(id) {
        router.post(route('admin.toggle.dossier', id));
    }

    function toggleRow(id) {
        setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
    }

    const valides   = dossiers.filter(d => d.est_valide).length;
    const enAttente = dossiers.filter(d => !d.est_valide).length;

    return (
        <AdminLayout title="Dossiers de stage">
            <Head title="Dossiers — Admin" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <StatCard label="Total dossiers" value={count}    color="blue" />
                <StatCard label="Validés"         value={valides}  color="green" />
                <StatCard label="En attente"      value={enAttente} color="amber" />
            </div>

            {/* Filtres */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Rechercher un étudiant…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && applyFilters()}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    {[
                        { value: 'all',     label: 'Tous' },
                        { value: 'valide',  label: 'Validés' },
                        { value: 'pending', label: 'En attente' },
                    ].map(f => (
                        <button key={f.value}
                            onClick={() => { setStatut(f.value); applyFilters({ statut: f.value }); }}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                statut === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >{f.label}</button>
                    ))}
                </div>
                <button onClick={() => applyFilters()}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                    Filtrer
                </button>
            </div>

            {/* Liste */}
            <div className="space-y-3">
                {dossiers.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-10 text-center text-sm text-gray-400">
                        Aucun dossier trouvé.
                    </div>
                ) : dossiers.map(dossier => {
                    const u      = dossier.etudiant?.utilisateur;
                    const stage  = dossier.etudiant?.stages?.[0] ?? null;
                    const conv   = stage?.convention ?? null;
                    const open   = openRows[dossier.id] ?? false;
                    const docs   = dossier.documents ?? [];
                    const nbSig  = conv ? [conv.signer_par_entreprise, conv.signer_par_tuteur, conv.signer_par_etudiant].filter(Boolean).length : 0;

                    return (
                        <div key={dossier.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* ── Ligne principale ── */}
                            <div className="flex items-center gap-4 px-4 py-3 flex-wrap">
                                <span className="text-xs text-gray-400 w-6 shrink-0">#{dossier.id}</span>

                                <div className="flex-1 min-w-48">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {u ? `${u.nom} ${u.prenom ?? ''}` : '—'}
                                    </div>
                                    <div className="text-xs text-gray-400">{u?.email ?? '—'}</div>
                                </div>

                                <span className="text-xs text-gray-500 bg-slate-50 px-2 py-1 rounded-lg">
                                    {dossier.etudiant?.filiere?.filiere ?? '—'}
                                </span>

                                <span className="text-xs text-gray-400">
                                    {(dossier.date_soumission || dossier.created_at)
                                        ? new Date(dossier.date_soumission ?? dossier.created_at).toLocaleDateString('fr-FR')
                                        : '—'}
                                </span>

                                {/* Convention status */}
                                {conv ? (
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                                        nbSig === 3 ? 'bg-green-100 text-green-800' :
                                        nbSig > 0   ? 'bg-amber-100 text-amber-700' :
                                                      'bg-slate-100 text-slate-500'
                                    }`}>
                                        ✍ {nbSig}/3 signé{nbSig > 1 ? 's' : ''}
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-400">Pas de convention</span>
                                )}

                                {/* Dossier status */}
                                <StatusBadge valide={dossier.est_valide} />

                                {/* Docs toggle */}
                                <button onClick={() => toggleRow(dossier.id)}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition shrink-0">
                                    📄 {docs.length}
                                    <span className="text-blue-400">{open ? '▲' : '▼'}</span>
                                </button>

                                {/* Admin toggle */}
                                <button onClick={() => toggleDossier(dossier.id)}
                                    className={`px-2 py-1 text-xs rounded-lg font-semibold transition shrink-0 ${
                                        dossier.est_valide
                                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                    }`}>
                                    {dossier.est_valide ? 'Invalider' : 'Valider'}
                                </button>
                            </div>

                            {/* ── Panneau dépliable ── */}
                            {open && (
                                <div className="border-t border-gray-50 bg-slate-50 px-4 py-4 space-y-4">

                                    {/* Documents */}
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Documents ({docs.length})
                                        </p>
                                        {docs.length === 0 ? (
                                            <p className="text-xs text-slate-400">Aucun document déposé.</p>
                                        ) : (
                                            <div className="space-y-1.5">
                                                {docs.map(doc => (
                                                    <div key={doc.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base">{iconDoc(doc.categorie)}</span>
                                                            <div>
                                                                <div className="text-sm font-medium text-slate-800">{doc.nom}</div>
                                                                <div className="text-xs text-slate-400 capitalize">
                                                                    {doc.categorie ?? doc.type} · {doc.date_depot ? new Date(doc.date_depot).toLocaleDateString('fr-FR') : '—'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a href={route('documents.download', doc.id)}
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg hover:bg-blue-100 font-semibold transition">
                                                            ↓
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Stage + convention (affiché seulement si stage existe) */}
                                    {stage && (
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                                Stage
                                            </p>
                                            <div className="bg-white rounded-lg border border-slate-100 px-4 py-3 space-y-3">
                                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
                                                    <span><span className="font-semibold">Sujet :</span> {stage.sujet ?? '—'}</span>
                                                    <span><span className="font-semibold">Début :</span> {stage.dateDebut ?? '—'}</span>
                                                    <span><span className="font-semibold">Durée :</span> {stage.duree_en_semaine} sem.</span>
                                                    <span className={`font-semibold px-2 py-0.5 rounded-md ${
                                                        stage.etat === 'actif'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {stage.etat === 'actif' ? '✅ Stage actif' : '⏳ En attente de convention'}
                                                    </span>
                                                </div>

                                                {conv && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 mb-1.5">Convention</p>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {[
                                                                { label: 'Étudiant',   signed: conv.signer_par_etudiant },
                                                                { label: 'Tuteur',     signed: conv.signer_par_tuteur },
                                                                { label: 'Entreprise', signed: conv.signer_par_entreprise },
                                                            ].map(p => (
                                                                <span key={p.label} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                                                    p.signed ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'
                                                                }`}>
                                                                    {p.signed ? '✓' : '○'} {p.label}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ valide }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            valide ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${valide ? 'bg-green-500' : 'bg-amber-500'}`} />
            {valide ? 'Validé' : 'En attente'}
        </span>
    );
}

function StatCard({ label, value, color }) {
    const colors = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', amber: 'bg-amber-50 text-amber-700' };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}

function iconDoc(categorie) {
    const map = { convention: '📋', cv: '👤', lettre: '✉️', rapport: '📄', evaluation: '📊' };
    return map[categorie] ?? '📄';
}
