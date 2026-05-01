import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router } from '@inertiajs/react';

const STATUT = {
    en_attente:              { label: 'En attente',        cls: 'bg-amber-100 text-amber-800' },
    accepted_pending_choice: { label: '✅ À confirmer',    cls: 'bg-green-100 text-green-800' },
    acceptee:                { label: 'Confirmée',         cls: 'bg-teal-100 text-teal-800' },
    refusee:                 { label: 'Refusée',           cls: 'bg-red-100 text-red-800' },
    expiree:                 { label: 'Expirée',           cls: 'bg-slate-100 text-slate-500' },
    annulee:                 { label: 'Annulée',           cls: 'bg-slate-100 text-slate-400' },
};

export default function EtudiantCandidatures({ candidatures = [] }) {
    function retirer(id) {
        if (!confirm('Retirer cette candidature ?')) return;
        router.delete(route('etudiant.candidatures.destroy', id));
    }

    function confirmer(id) {
        if (!confirm('Confirmer ce stage ? Toutes vos autres candidatures seront annulées.')) return;
        router.post(route('etudiant.candidatures.confirmer', id));
    }

    function decliner(id) {
        if (!confirm('Décliner cette offre ?')) return;
        router.post(route('etudiant.candidatures.decliner', id));
    }

    const enAttente  = candidatures.filter(c => c.statut === 'en_attente').length;
    const aConfirmer = candidatures.filter(c => c.statut === 'accepted_pending_choice').length;
    const acceptees  = candidatures.filter(c => c.statut === 'acceptee').length;
    const refusees   = candidatures.filter(c => ['refusee', 'expiree', 'annulee'].includes(c.statut)).length;

    return (
        <EtudiantLayout title="Mes candidatures">
            <Head title="Candidatures — Étudiant" />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="En attente"   value={enAttente}  color="amber" />
                <StatCard label="À confirmer"  value={aConfirmer} color="green" pulse={aConfirmer > 0} />
                <StatCard label="Confirmées"   value={acceptees}  color="teal" />
                <StatCard label="Refusées"     value={refusees}   color="slate" />
            </div>

            {/* Alerte si des offres attendent confirmation */}
            {aConfirmer > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-sm text-green-800 font-medium">
                    🎉 Vous avez {aConfirmer} offre{aConfirmer > 1 ? 's' : ''} acceptée{aConfirmer > 1 ? 's' : ''} à confirmer. Répondez avant l'expiration du délai !
                </div>
            )}

            {/* Liste */}
            <div className="space-y-3">
                {candidatures.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-16 text-slate-400">
                        <p className="text-3xl mb-2">📨</p>
                        Aucune candidature pour l'instant.
                    </div>
                ) : candidatures.map(c => {
                    const s = STATUT[c.statut] ?? STATUT.en_attente;
                    const isPending = c.statut === 'accepted_pending_choice';

                    return (
                        <div key={c.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition ${
                            isPending ? 'border-green-200 shadow-green-50' : 'border-slate-100'
                        }`}>
                            {/* Ligne principale */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-slate-900 text-sm truncate">
                                        {c.offre?.titre ?? '—'}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {c.offre?.entreprise?.nom_entreprise ?? '—'}
                                        {c.offre?.entreprise?.secteur && (
                                            <span className="ml-2 px-1.5 py-0.5 bg-slate-100 rounded text-slate-400">
                                                {c.offre.entreprise.secteur}
                                            </span>
                                        )}
                                        {c.offre?.duree_semaines && (
                                            <span className="ml-2 text-slate-400">· {c.offre.duree_semaines} sem.</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs text-slate-400">
                                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls} ${isPending ? 'animate-pulse' : ''}`}>
                                        {s.label}
                                    </span>
                                </div>
                            </div>

                            {/* Bloc action si offre acceptée en attente de confirmation */}
                            {isPending && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <p className="text-xs text-green-800 font-semibold mb-2">
                                        🎉 Offre acceptée — il vous reste{' '}
                                        <span className="font-black">{c.jours_restants} jour{c.jours_restants !== 1 ? 's' : ''}</span>{' '}
                                        pour confirmer.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => confirmer(c.id)}
                                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                                        >
                                            ✅ Confirmer ce stage
                                        </button>
                                        <button
                                            onClick={() => decliner(c.id)}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg hover:bg-red-100 transition"
                                        >
                                            ✗ Décliner
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bouton retirer si en_attente */}
                            {c.statut === 'en_attente' && (
                                <div className="mt-3 flex justify-end">
                                    <button onClick={() => retirer(c.id)}
                                        className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg hover:bg-red-50 hover:text-red-700 transition font-semibold">
                                        Retirer
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </EtudiantLayout>
    );
}

function StatCard({ label, value, color, pulse = false }) {
    const colors = {
        amber: 'bg-amber-50 text-amber-700',
        green: 'bg-green-50 text-green-700',
        teal:  'bg-teal-50 text-teal-700',
        slate: 'bg-slate-100 text-slate-500',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]} ${pulse ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-1">{label}</div>
        </div>
    );
}