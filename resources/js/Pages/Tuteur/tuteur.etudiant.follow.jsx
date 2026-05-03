import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function TuteurEtudiantsFollow({ etudiants = [] }) {
    const [filiere, setFiliere] = useState('');

    const filieres = [...new Set(etudiants.map(e => e.filiere))].sort();
    const filtered = filiere ? etudiants.filter(e => e.filiere === filiere) : etudiants;

    function suivre(id)  { router.post(route('tuteur.etudiants.suivre', id)); }
    function retirer(id) { router.delete(route('tuteur.etudiants.retirer', id)); }

    return (
        <TuteurLayout title="Étudiants">
            <Head title="Étudiants — Tuteur" />

            {/* Filtre filière */}
            <div className="flex gap-3 mb-6 flex-wrap">
                <button onClick={() => setFiliere('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        !filiere ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    Toutes
                </button>
                {filieres.map(f => (
                    <button key={f} onClick={() => setFiliere(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            filiere === f ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {filtered.map(e => (
                    <div key={e.id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3 flex-wrap">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-black text-xs shrink-0">
                            {e.prenom?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            {e.suivi && e.stage_id ? (
                                <Link
                                    href={route('tuteur.etudiant', { etudiantId: e.id })}
                                    className="text-sm font-medium text-teal-700 hover:underline"
                                >
                                    {e.prenom} {e.nom}
                                </Link>
                            ) : (
                                <div className="text-sm font-medium text-slate-900">{e.prenom} {e.nom}</div>
                            )}
                            <div className="text-xs text-slate-400">{e.email}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
                            {e.filiere} · Niv. {e.niveau}
                        </span>
                        {e.suivi && e.convention_needs_signature && (
                            <button
                                onClick={() => {
                                    if (!confirm('Signer la convention de ce stage ?')) return;
                                    router.post(route('tuteur.signer.convention', e.stage_id));
                                }}
                                className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition"
                            >
                                ✍ Signer convention
                            </button>
                        )}
                        {e.suivi ? (
                            <button onClick={() => retirer(e.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition">
                                Retirer
                            </button>
                        ) : (
                            <button onClick={() => suivre(e.id)}
                                className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition">
                                + Suivre
                            </button>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-10">Aucun étudiant dans cette filière.</p>
                )}
            </div>
        </TuteurLayout>
    );
}