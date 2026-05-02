import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function TuteurOffres({ offres = [], secteurs = [], filieres = [], filters = {} }) {
    const [search, setSearch]     = useState(filters.search ?? '');
    const [dureeMin, setDureeMin] = useState(filters.duree_min ?? '');
    const [dureeMax, setDureeMax] = useState(filters.duree_max ?? '');
    const [secteur, setSecteur]   = useState(filters.secteur_id ?? '');
    const [filiere, setFiliere]   = useState(filters.filiere_id ?? '');

    function applyFilters(overrides = {}) {
        router.get(route('tuteur.offres'), {
            search:     overrides.search     ?? search,
            duree_min:  overrides.duree_min  ?? dureeMin,
            duree_max:  overrides.duree_max  ?? dureeMax,
            secteur_id: overrides.secteur_id ?? secteur,
            filiere_id: overrides.filiere_id ?? filiere,
        }, { preserveState: true, replace: true });
    }

    function reset() {
        setSearch(''); setDureeMin(''); setDureeMax('');
        setSecteur(''); setFiliere('');
        router.get(route('tuteur.offres'), {}, { replace: true });
    }

    return (
        <TuteurLayout title="Offres de stage disponibles">
            <Head title="Offres — Tuteur" />

            {/* Filtres */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-3">

                    <input
                        type="text"
                        placeholder="Titre, missions, description…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters()}
                        className="flex-1 min-w-48 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400"
                    />

                    {/* Filière — apparence custom pour éviter superposition texte/flèche */}
                    <div className="relative">
                        <select
                            value={filiere}
                            onChange={e => { setFiliere(e.target.value); applyFilters({ filiere_id: e.target.value }); }}
                            className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 bg-white"
                        >
                            <option value="">Toutes les filières</option>
                            {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                    </div>

                    {/* Secteur — même fix */}
                    <div className="relative">
                        <select
                            value={secteur}
                            onChange={e => { setSecteur(e.target.value); applyFilters({ secteur_id: e.target.value }); }}
                            className="appearance-none border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 bg-white"
                        >
                            <option value="">Tous les secteurs</option>
                            {secteurs.map(s => <option key={s.id} value={s.id}>{s.secteur}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▼</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-500 whitespace-nowrap">Durée (sem.)</label>
                        <input type="number" min="1" placeholder="min" value={dureeMin}
                            onChange={e => setDureeMin(e.target.value)}
                            className="w-16 border border-slate-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100" />
                        <span className="text-slate-300">—</span>
                        <input type="number" min="1" placeholder="max" value={dureeMax}
                            onChange={e => setDureeMax(e.target.value)}
                            className="w-16 border border-slate-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100" />
                    </div>

                    <button onClick={() => applyFilters()}
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition">
                        Filtrer
                    </button>
                    <button onClick={reset}
                        className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-xl hover:bg-slate-200 transition">
                        Réinitialiser
                    </button>
                </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">
                {offres.length} offre{offres.length !== 1 ? 's' : ''} disponible{offres.length !== 1 ? 's' : ''}
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {offres.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-slate-400">
                        <p className="text-3xl mb-2">🔍</p>
                        Aucune offre ne correspond à votre recherche.
                    </div>
                ) : offres.map(offre => (
                    <div key={offre.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col hover:border-teal-200 hover:shadow-md transition">
                        <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                                <h3 className="font-semibold text-slate-900 text-sm">{offre.titre}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{offre.entreprise?.nom_entreprise}</p>
                            </div>
                            <span className="shrink-0 px-2 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">
                                {offre.duree_semaines} sem.
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                            {offre.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            {offre.entreprise?.secteur && (
                                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                    {offre.entreprise.secteur}
                                </span>
                            )}
                            {offre.filiere_cible && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-md">
                                    🎓 {offre.filiere_cible}
                                </span>
                            )}
                            <span className="text-xs text-slate-400 ml-auto">
                                {offre.candidatures_count ?? 0} candidature{(offre.candidatures_count ?? 0) !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </TuteurLayout>
    );
}