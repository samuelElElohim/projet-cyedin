import TuteurLayout from '@/Layouts/TuteurLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function TuteurCreateStage({ etudiants = [], entreprises = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        sujet:            '',
        etudiant_id:     '',
        entreprise_id:   '',
        duree_en_semaine: '',
        dateDebut:        new Date().toISOString().slice(0, 10),
    });

    function submit(e) {
        e.preventDefault();
        post(route('tuteur.store.stage'));
    }

    return (
        <TuteurLayout title="Affecter un stage">
            <Head title="Créer stage — Tuteur" />

            <Link href={route('tuteur.dashboard')} className="text-sm text-slate-500 hover:text-slate-800 mb-6 inline-flex items-center gap-1">
                ← Retour
            </Link>

            <div className="max-w-xl">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-4">
                    <h2 className="text-base font-semibold text-slate-900 mb-6">Nouveau stage</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Étudiant *" error={errors.etudiant_id}>
                            <select value={data.etudiant_id} onChange={e => setData('etudiant_id', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100">
                                <option value="">— Choisir un étudiant —</option>
                                {etudiants.map(etu => (
                                    <option key={etu.utilisateur_id} value={etu.utilisateur_id}>
                                        {etu.utilisateur?.prenom} {etu.utilisateur?.nom} ({etu.filiere} · Niv. {etu.niveau_etud})
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Entreprise *" error={errors.entreprise_id}>
                            <select value={data.entreprise_id} onChange={e => setData('entreprise_id', e.target.value)} required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100">
                                <option value="">— Choisir une entreprise —</option>
                                {entreprises.map(ent => (
                                    <option key={ent.id} value={ent.id}>
                                        {ent.nom_entreprise} ({ent.secteur})
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Sujet du stage *" error={errors.sujet}>
                            <input type="text" value={data.sujet} onChange={e => setData('sujet', e.target.value)}
                                placeholder="Intitulé du sujet de stage"
                                required
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100" />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Date de début *" error={errors.dateDebut}>
                                <input type="date" value={data.dateDebut} onChange={e => setData('dateDebut', e.target.value)}
                                    required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100" />
                            </Field>

                            <Field label="Durée (semaines) *" error={errors.duree_en_semaine}>
                                <input type="number" min="1" max="52" value={data.duree_en_semaine}
                                    onChange={e => setData('duree_en_semaine', e.target.value)}
                                    placeholder="ex: 12"
                                    required
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100" />
                            </Field>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-4">
                                Une convention de stage sera créée automatiquement et devra être signée par les 3 parties.
                            </p>
                            <button type="submit" disabled={processing}
                                className="w-full py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition disabled:opacity-60 text-sm">
                                {processing ? 'Création…' : 'Créer le stage'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TuteurLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
