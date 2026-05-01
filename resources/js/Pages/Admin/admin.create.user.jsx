import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/UI/InputError';

const ROLES = [
    { value: 'A', label: 'Administrateur' },
    { value: 'E', label: 'Entreprise' },
    { value: 'T', label: 'Tuteur' },
    { value: 'S', label: 'Étudiant' },
];

export default function AdminCreateUser() {

    const {filieres} = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '', prenom: '', email: '', role: '',
        filiere_id: '', niveau_etud: '',
        addresse: '', secteur: '',
        departement: '', est_jury: false,
        filieres_ids: [],

    });

   function handleRoleChange(e) {
    const role = e.target.value;
    setData({
        ...data,  // garde les champs communs
        role,
        filiere_id:   '',
        niveau_etud:  '',
        addresse:     '',
        est_jury:     false,
        filieres_ids: [],
    });
}

    function submit(e) {
        e.preventDefault();
        console.log(data);
        post(route('admin.store.user'));
    }

    return (
        <AdminLayout title="Ajouter un utilisateur">
            <Head title="Ajouter un utilisateur" />

            <div className="max-w-xl">
                <Link
                    href={route('admin.index.user')}
                    className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-flex items-center gap-1"
                >
                    ← Retour à la liste
                </Link>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">Informations du compte</h2>

                    <form onSubmit={submit} className="space-y-4">

                        {/* Champs communs */}
                        <Field label="Nom *" error={errors.nom}>
                            <Input
                                value={data.nom}
                                onChange={e => setData('nom', e.target.value)}
                                placeholder="Nom"
                                required
                            />
                        </Field>

                        <Field label="Prénom" error={errors.prenom}>
                            <Input
                                value={data.prenom}
                                onChange={e => setData('prenom', e.target.value)}
                                placeholder="Prénom (optionnel pour entreprise)"
                            />
                        </Field>

                        <Field label="Email *" error={errors.email}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="email@exemple.fr"
                                required
                            />
                        </Field>

                        <Field label="Rôle *" error={errors.role}>
                            <select
                                value={data.role}
                                onChange={handleRoleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                required
                            >
                                <option value="">— Choisir un rôle —</option>
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </Field>

                        {/* Champs dynamiques */}
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

                                        {filieres.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.filiere}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Niveau d'étude *" error={errors.niveau_etud}>
                                    <Input
                                        type="number"
                                        min="1" max="5"
                                        value={data.niveau_etud}
                                        onChange={e => setData('niveau_etud', e.target.value)}
                                        placeholder="1 à 5"
                                    />
                                </Field>
                            </div>
                        )}

                        {data.role === 'E' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infos entreprise</p>
                                <Field label="Adresse *" error={errors.addresse}>
                                    <Input
                                        value={data.addresse}
                                        onChange={e => setData('addresse', e.target.value)}
                                        placeholder="Adresse complète"
                                    />
                                </Field>
                                <Field label="Filières de l'entreprise *" error={errors.filieres_ids}>
                                    <select
                                        multiple
                                        value={data.filieres_ids}
                                        onChange={e =>
                                            setData(
                                                'filieres_ids',
                                                Array.from(e.target.selectedOptions, opt => Number(opt.value))
                                            )
                                        }
                                        className="border rounded px-3 py-2 w-full h-32"
                                    >
                                        {filieres.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.filiere}
                                            </option>
                                        ))}
                                    </select>
                                </Field>

                            </div>
                        )}

                        {data.role === 'T' && (
                            <div className="space-y-4 pt-2 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Infos tuteur</p>
                                <Field label="Filière *" error={errors.filiere_id}>
                                    <select
                                        value={data.filiere_id}
                                        onChange={e => setData('filiere_id', Number(e.target.value))}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="">-- Choisir une filière --</option>

                                        {filieres.map(f => (
                                            <option key={f.id} value={f.id}>
                                                {f.filiere}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.est_jury}
                                        onChange={e => setData('est_jury', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600"
                                    />
                                    Ce tuteur fait partie du jury
                                </label>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 mb-4">
                                Le mot de passe par défaut est <code className="bg-gray-100 px-1 rounded">password</code>. L'utilisateur devra le changer à la première connexion.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                            >
                                {processing ? 'Création…' : 'Créer l\'utilisateur'}
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