import EtudiantLayout from '@/Layouts/EtudiantLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function EtudiantEntreprises({ entreprises = [], secteurs = [], filters = {} }) {
    const [search, setSearch]   = useState(filters.search ?? '');
    const [secteur, setSecteur] = useState(filters.secteur ?? '');

    function applyFilters(overrides = {}) {
        router.get(route('etudiant.entreprises'), {
            search:  overrides.search  ?? search,
            secteur: overrides.secteur ?? secteur,
        }, { preserveState: true, replace: true });
    }

    return (
        <EtudiantLayout title="Annuaire des entreprises">
            <Head title="Entreprises — Étudiant">
                <meta name="description" content="Annuaire des entreprises partenaires de CY Tech, recherche par secteur d'activité." />
            </Head>

            {/* Filtres */}
            <section aria-label="Filtres de recherche">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="search"
                            aria-label="Rechercher une entreprise par nom ou adresse"
                            placeholder="Rechercher une entreprise…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            className="flex-1 min-w-0 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        />
                        <select
                            aria-label="Filtrer par secteur d'activité"
                            value={secteur}
                            onChange={e => { setSecteur(e.target.value); applyFilters({ secteur: e.target.value }); }}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Tous les secteurs</option>
                            {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                            onClick={() => applyFilters()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                        >
                            Filtrer
                        </button>
                        {(search || secteur) && (
                            <button
                                onClick={() => {
                                    setSearch(''); setSecteur('');
                                    router.get(route('etudiant.entreprises'), {}, { replace: true });
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition"
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>
            </section>

            <p className="text-sm text-slate-500 mb-4" aria-live="polite">
                {entreprises.length} entreprise{entreprises.length !== 1 ? 's' : ''} trouvée{entreprises.length !== 1 ? 's' : ''}
            </p>

            {/* Liste */}
            <section aria-label="Liste des entreprises">
                {entreprises.length === 0 ? (
                    <div className="text-center py-16 text-slate-400" role="status">
                        <p className="text-3xl mb-2" aria-hidden="true">🏢</p>
                        <p>Aucune entreprise ne correspond à votre recherche.</p>
                    </div>
                ) : (
                    <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 list-none p-0">
                        {entreprises.map(ent => (
                            <li key={ent.id}>
                                <article className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full flex flex-col hover:border-blue-200 hover:shadow-md transition">
                                    <header className="mb-3">
                                        {/* Initiale avatar */}
                                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg mb-3" aria-hidden="true">
                                            {ent.nom_entreprise?.[0] ?? '?'}
                                        </div>
                                        <h2 className="font-semibold text-slate-900 text-sm leading-tight">
                                            {ent.nom_entreprise}
                                        </h2>
                                    </header>

                                    <dl className="text-xs text-slate-500 space-y-1 flex-1">
                                        <div className="flex gap-1">
                                            <dt className="sr-only">Secteur</dt>
                                            <dd>
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md uppercase tracking-wide">
                                                    {ent.secteur}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex gap-1 items-start">
                                            <dt className="sr-only">Adresse</dt>
                                            <dd className="text-slate-400">📍 {ent.addresse}</dd>
                                        </div>
                                        {ent.offres_actives_count > 0 && (
                                            <div>
                                                <dt className="sr-only">Offres de stage actives</dt>
                                                <dd>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-md mt-1">
                                                        ✓ {ent.offres_actives_count} offre{ent.offres_actives_count > 1 ? 's' : ''} active{ent.offres_actives_count > 1 ? 's' : ''}
                                                    </span>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </article>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </EtudiantLayout>
    );
}