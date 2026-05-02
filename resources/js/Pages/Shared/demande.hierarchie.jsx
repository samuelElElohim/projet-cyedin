import { Head, useForm, usePage } from '@inertiajs/react';
import EtudiantLayout  from '@/Layouts/EtudiantLayout';
import TuteurLayout    from '@/Layouts/TuteurLayout';
import EntrepriseLayout from '@/Layouts/EntrepriseLayout';
import AdminLayout     from '@/Layouts/AdminLayout';

// Layout selon le rôle de l'utilisateur connecté
function Wrap({ children }) {
    const role = usePage().props.auth?.user?.role;
    const title = 'Suggérer un secteur ou un tag';
    if (role === 'T') return <TuteurLayout title={title}>{children}</TuteurLayout>;
    if (role === 'E') return <EntrepriseLayout title={title}>{children}</EntrepriseLayout>;
    if (role === 'A') return <AdminLayout title={title}>{children}</AdminLayout>;
    return <EtudiantLayout title={title}>{children}</EtudiantLayout>;
}

const STATUT_STYLES = {
    en_attente: 'bg-amber-100 text-amber-800',
    approuve:   'bg-green-100 text-green-800',
    refuse:     'bg-red-100 text-red-800',
};
const STATUT_LABELS = {
    en_attente: 'En attente',
    approuve:   'Approuvée',
    refuse:     'Refusée',
};

export default function DemandeHierarchie({ filieres = [], mes_demandes = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'secteur', nom: '', filiere_id: '', secteur_id: '', justification: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('demande.hierarchie.store'), { onSuccess: () => reset() });
    }

    return (
        <Wrap>
            <Head title="Suggérer" />
            <div className="max-w-2xl space-y-6">

                {/* Formulaire de suggestion */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h1 className="text-base font-bold text-gray-900 mb-1">Suggérer un secteur ou un tag</h1>
                    <p className="text-xs text-gray-400 mb-5">
                        Vous ne trouvez pas votre domaine ? Proposez-le — un admin le validera et l'ajoutera à la hiérarchie.
                    </p>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Choix du type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                            <div className="flex gap-3">
                                {[
                                    { v: 'secteur', l: 'Nouveau secteur', s: 'ex: Cybersécurité, Finance…' },
                                    { v: 'tag',     l: 'Nouveau tag',     s: 'ex: React, Pentesting…' },
                                ].map(o => (
                                    <label key={o.v} className={`flex-1 flex items-start gap-2 cursor-pointer border rounded-xl p-3 transition ${
                                        data.type === o.v ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input type="radio" value={o.v} checked={data.type === o.v}
                                            onChange={() => setData(d => ({ ...d, type: o.v, filiere_id: '', secteur_id: '' }))}
                                            className="mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{o.l}</p>
                                            <p className="text-xs text-gray-400">{o.s}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du {data.type === 'secteur' ? 'secteur' : 'tag'} *
                            </label>
                            <input type="text" value={data.nom} onChange={e => setData('nom', e.target.value)}
                                placeholder={data.type === 'secteur' ? 'ex: Cybersécurité' : 'ex: React'}
                                required
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                            {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
                        </div>

                        {/* Secteur → filière parente */}
                        {data.type === 'secteur' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filière parente *</label>
                                <select value={data.filiere_id} onChange={e => setData('filiere_id', e.target.value)}
                                    required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                                    <option value="">— Choisir une filière —</option>
                                    {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                                </select>
                                {errors.filiere_id && <p className="mt-1 text-xs text-red-500">{errors.filiere_id}</p>}
                            </div>
                        )}

                        {/* Tag → secteur parent */}
                        {data.type === 'tag' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secteur parent *</label>
                                <select value={data.secteur_id} onChange={e => setData('secteur_id', e.target.value)}
                                    required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                                    <option value="">— Choisir un secteur —</option>
                                    {filieres.map(f => (
                                        <optgroup key={f.id} label={f.filiere}>
                                            {f.secteurs?.map(s => <option key={s.id} value={s.id}>{s.secteur}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                                {errors.secteur_id && <p className="mt-1 text-xs text-red-500">{errors.secteur_id}</p>}
                            </div>
                        )}

                        {/* Justification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Justification <span className="text-gray-400 font-normal">(optionnel)</span>
                            </label>
                            <textarea rows={3} value={data.justification}
                                onChange={e => setData('justification', e.target.value)}
                                placeholder="Pourquoi ce secteur/tag serait utile ?"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm">
                            {processing ? 'Envoi…' : 'Envoyer la suggestion'}
                        </button>
                    </form>
                </div>

                {/* Historique des suggestions */}
                {mes_demandes.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-50">
                            <h2 className="text-sm font-semibold text-gray-700">Mes suggestions</h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {mes_demandes.map(d => (
                                <div key={d.id} className="px-5 py-3 flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-semibold uppercase text-gray-400">{d.type}</span>
                                            <span className="text-sm font-medium text-gray-800">{d.nom}</span>
                                        </div>
                                        {d.type === 'secteur' && d.filiere && (
                                            <p className="text-xs text-gray-400">dans {d.filiere.filiere}</p>
                                        )}
                                        {d.type === 'tag' && d.secteur && (
                                            <p className="text-xs text-gray-400">dans {d.secteur.secteur}</p>
                                        )}
                                        {d.commentaire_admin && (
                                            <p className="text-xs text-gray-500 mt-1 italic">Retour admin : {d.commentaire_admin}</p>
                                        )}
                                    </div>
                                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUT_STYLES[d.statut]}`}>
                                        {STATUT_LABELS[d.statut]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Wrap>
    );
}
