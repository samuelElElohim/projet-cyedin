import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const ROLES = [
    { value: 'A', label: 'Administrateur' },
    { value: 'E', label: 'Entreprise' },
    { value: 'T', label: 'Tuteur' },
    { value: 'S', label: 'Étudiant' },
];

export default function AdminCreateUser() {
    const { filieres, secteurs } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nom: '', prenom: '', email: '', role: '',
        // Étudiant
        filiere_id: '', niveau_etud: '',
        // Tuteur
        secteurs_ids: [], filiere_id_tuteur: '',
        // Entreprise
        addresse: '', secteurs_ids: [],
    });

    function handleRoleChange(e) {
        setData({
            ...data,
            role: e.target.value,
            filiere_id: '', niveau_etud: '',
            secteurs_ids: [], filiere_id_tuteur: '',
            addresse: '',
        });
    }

    function toggleSecteur(id) {
        const ids = data.secteurs_ids.includes(id)
            ? data.secteurs_ids.filter(x => x !== id)
            : [...data.secteurs_ids, id];
        setData('secteurs_ids', ids);
    }

    function submit(e) {
        e.preventDefault();
        post(route('admin.store.user'));
    }

    // Secteurs groupés par filière
    const secteursByFiliere = filieres.map(f => ({
        ...f,
        secteurs: secteurs.filter(s => s.filiere_id === f.id),
    }));

    return (
        <AdminLayout title="Ajouter un utilisateur">
            <Head title="Ajouter un utilisateur" />

            <div className="max-w-xl">
                <Link href={route('admin.index.user')} className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1">
                    ← Retour à la liste
                </Link>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">Informations du compte</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <Field label="Nom *" error={errors.nom}>
                            <Input value={data.nom} onChange={e => setData('nom', e.target.value)} placeholder="Nom" required />
                        </Field>

                        <Field label="Prénom" error={errors.prenom}>
                            <Input value={data.prenom} onChange={e => setData('prenom', e.target.value)} placeholder="Prénom (optionnel pour entreprise)" />
                        </Field>

                        <Field label="Email *" error={errors.email}>
                            <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@exemple.fr" required />
                        </Field>

                        <Field label="Rôle *" error={errors.role}>
                            <select
                                value={data.role}
                                onChange={handleRoleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            >
                                <option value="">— Choisir un rôle —</option>
                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                        </Field>

                        {/* Étudiant : une filière */}
                        {data.role === 'S' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infos étudiant</p>
                                <Field label="Filière *" error={errors.filiere_id}>
                                    <select
                                        value={data.filiere_id}
                                        onChange={e => setData('filiere_id', Number(e.target.value))}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="">-- Choisir une filière --</option>
                                        {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                                    </select>
                                </Field>
                                <Field label="Niveau d'étude *" error={errors.niveau_etud}>
                                    <Input type="number" min="1" max="5" value={data.niveau_etud}
                                        onChange={e => setData('niveau_etud', e.target.value)} placeholder="1 à 5" />
                                </Field>
                            </div>
                        )}

                        {/* Tuteur : secteurs multiples groupés par filière */}
                        {data.role === 'T' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infos tuteur</p>

                                <Field label="Filière principale (optionnel)" error={errors.filiere_id_tuteur}>
                                    <select
                                        value={data.filiere_id_tuteur}
                                        onChange={e => setData('filiere_id_tuteur', Number(e.target.value) || '')}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="">— Aucune —</option>
                                        {filieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                                    </select>
                                </Field>

                                {/* Secteurs supervisés : checkboxes groupées */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Secteurs supervisés *
                                    </label>
                                    {errors.secteurs_ids && <p className="text-xs text-red-500 mb-1">{errors.secteurs_ids}</p>}
                                    <div className="space-y-3 border border-gray-100 rounded-lg p-3 bg-gray-50 max-h-56 overflow-y-auto">
                                        {secteursByFiliere.map(f => (
                                            f.secteurs.length > 0 && (
                                                <div key={f.id}>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{f.filiere}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {f.secteurs.map(s => (
                                                            <label key={s.id} className="flex items-center gap-1.5 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.secteurs_ids.includes(s.id)}
                                                                    onChange={() => toggleSecteur(s.id)}
                                                                    className="rounded border-gray-300 text-blue-600"
                                                                />
                                                                <span className="text-sm text-gray-700">{s.secteur}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                        {secteurs.length === 0 && (
                                            <p className="text-xs text-gray-400">Aucun secteur disponible. Créez-en dans la page Hiérarchie.</p>
                                        )}
                                    </div>
                                </div>

                                            </div>
                        )}

                        {/* Entreprise : secteurs multiples groupés par filière */}
                        {data.role === 'E' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infos entreprise</p>
                                <Field label="Adresse *" error={errors.addresse}>
                                    <Input value={data.addresse} onChange={e => setData('addresse', e.target.value)} placeholder="Adresse complète" />
                                </Field>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Secteurs d'activité *
                                    </label>
                                    {errors.secteurs_ids && <p className="text-xs text-red-500 mb-1">{errors.secteurs_ids}</p>}
                                    <div className="space-y-3 border border-gray-100 rounded-lg p-3 bg-gray-50 max-h-56 overflow-y-auto">
                                        {secteursByFiliere.map(f => (
                                            f.secteurs.length > 0 && (
                                                <div key={f.id}>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{f.filiere}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {f.secteurs.map(s => (
                                                            <label key={s.id} className="flex items-center gap-1.5 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.secteurs_ids.includes(s.id)}
                                                                    onChange={() => toggleSecteur(s.id)}
                                                                    className="rounded border-gray-300 text-blue-600"
                                                                />
                                                                <span className="text-sm text-gray-700">{s.secteur}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-4">
                                Mot de passe par défaut : <code className="bg-gray-100 px-1 rounded">password</code>. L'utilisateur devra le changer à la première connexion.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Création…' : "Créer l'utilisateur"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function Input({ className = '', ...props }) {
    return (
        <input
            {...props}
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
        />
    );
}
