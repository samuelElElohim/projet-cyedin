import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

const ROLE_LABELS = { A: 'Admin', S: 'Étudiant', E: 'Entreprise', T: 'Tuteur', J: 'Jury' };
const ROLE_COLORS = {
    A: 'bg-purple-100 text-purple-800',
    S: 'bg-blue-100 text-blue-800',
    E: 'bg-amber-100 text-amber-800',
    T: 'bg-teal-100 text-teal-800',
    J: 'bg-gray-100 text-gray-700',
};

export default function AdminImportUser() {
    const fileInputRef = useRef();
    const [fichier, setFichier]         = useState(null);
    const [dragging, setDragging]       = useState(false);
    const [preview, setPreview]         = useState(null);   // résultat /preview
    const [resultat, setResultat]       = useState(null);   // résultat /store
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState(null);

    // ── Drag & Drop ───────────────────────────────────────────────────────────
    function onDrop(e) {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) selectFile(f);
    }

    function selectFile(f) {
        const ext = f.name.split('.').pop().toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext)) {
            setError('Format non supporté. Utilisez CSV, XLSX ou XLS.');
            return;
        }
        setError(null);
        setFichier(f);
        setPreview(null);
        setResultat(null);
    }

    // ── Preview ───────────────────────────────────────────────────────────────
    async function lancerPreview() {
        if (!fichier) return;
        setLoading(true);
        setError(null);
        const fd = new FormData();
        fd.append('fichier', fichier);

        try {
            const res = await window.axios.post(route('admin.import.user.preview'), fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPreview(res.data);
        } catch (e) {
            setError(e.response?.data?.message ?? e.response?.data?.errors?.fichier?.[0] ?? 'Erreur serveur');
        } finally {
            setLoading(false);
        }
    }

    // ── Import final ──────────────────────────────────────────────────────────
    async function lancerImport() {
        if (!fichier || !preview) return;
        setLoading(true);
        setError(null);
        const fd = new FormData();
        fd.append('fichier', fichier);

        try {
            const res = await window.axios.post(route('admin.import.user.store'), fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResultat(res.data);
            setPreview(null);
            setFichier(null);
        } catch (e) {
            setError(e.response?.data?.message ?? e.response?.data?.errors?.fichier?.[0] ?? 'Erreur serveur');
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setFichier(null); setPreview(null); setResultat(null); setError(null);
    }

    return (
        <AdminLayout title="Import CSV / Excel">
            <Head title="Import utilisateurs — Admin" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={route('admin.index.user')}
                    className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1">
                    ← Retour à la liste
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* ── Colonne gauche : upload + instructions ── */}
                <div className="lg:col-span-1 space-y-4">

                    {/* Zone de dépôt */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition ${
                            dragging
                                ? 'border-blue-500 bg-blue-50'
                                : fichier
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={e => e.target.files[0] && selectFile(e.target.files[0])}
                        />
                        <div className="text-3xl mb-2" aria-hidden="true">
                            {fichier ? '✅' : '📂'}
                        </div>
                        {fichier ? (
                            <div>
                                <p className="text-sm font-semibold text-green-700">{fichier.name}</p>
                                <p className="text-xs text-green-600 mt-1">{(fichier.size / 1024).toFixed(1)} Ko</p>
                                <button
                                    onClick={e => { e.stopPropagation(); reset(); }}
                                    className="mt-2 text-xs text-red-400 hover:text-red-600"
                                >
                                    Changer de fichier
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    Glisser-déposer ou cliquer
                                </p>
                                <p className="text-xs text-slate-400 mt-1">CSV, XLSX ou XLS · max 5 Mo</p>
                            </div>
                        )}
                    </div>

                    {/* Erreur */}
                    {error && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Boutons */}
                    {fichier && !preview && !resultat && (
                        <button
                            onClick={lancerPreview}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                        >
                            {loading ? '⏳ Analyse en cours…' : '🔍 Analyser le fichier'}
                        </button>
                    )}

                    {/* Format attendu */}
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                            Format du fichier
                        </h3>
                        <p className="text-xs text-slate-500 mb-2">
                            La première ligne doit contenir les en-têtes. Colonnes attendues :
                        </p>
                        <div className="space-y-1">
                            {[
                                { col: 'nom',          req: true,  note: 'Toujours requis' },
                                { col: 'prenom',       req: false, note: 'Optionnel' },
                                { col: 'email',        req: true,  note: 'Toujours requis' },
                                { col: 'role',         req: true,  note: 'A / S / E / T / J' },
                                { col: 'filiere',      req: false, note: 'Requis si S' },
                                { col: 'niveau_etud',  req: false, note: 'Requis si S (1–5)' },
                                { col: 'addresse',     req: false, note: 'Requis si E' },
                                { col: 'secteur',      req: false, note: 'Requis si E' },
                                { col: 'departement',  req: false, note: 'Requis si T' },
                            ].map(({ col, req, note }) => (
                                <div key={col} className="flex items-center gap-2">
                                    <code className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-700">
                                        {col}
                                    </code>
                                    {req && <span className="text-[10px] text-red-500 font-bold">*</span>}
                                    <span className="text-[10px] text-slate-400">{note}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-3">
                            Mot de passe par défaut : <code className="bg-white px-1 rounded">password</code><br />
                            L'utilisateur devra le changer à la première connexion.
                        </p>
                        <a
                            href="data:text/csv;charset=utf-8,nom,prenom,email,role,filiere,niveau_etud,addresse,secteur,departement%0ADupont,Jean,jean.dupont%40cytech.fr,S,INFO,3,,,%0ACYTECH,,contact%40cytech.fr,E,,,10+rue+Test,Informatique,%0AMatin,Sophie,s.martin%40cytech.fr,T,,,,, Informatique"
                            download="modele_import.csv"
                            className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            ⬇ Télécharger un modèle CSV
                        </a>
                    </div>
                </div>

                {/* ── Colonne droite : résultats ── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Résultat d'import */}
                    {resultat && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <p className="text-sm font-semibold text-green-800">{resultat.message}</p>
                                    <p className="text-xs text-green-600 mt-0.5">
                                        {resultat.crees.length} créé(s) · {resultat.erreurs.length} ignoré(s)
                                    </p>
                                </div>
                                <button onClick={reset} className="ml-auto px-3 py-1.5 bg-white border border-green-300 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-50">
                                    Nouvel import
                                </button>
                            </div>

                            {resultat.crees.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                                        <h3 className="text-sm font-semibold text-green-800">
                                            ✅ {resultat.crees.length} utilisateur(s) créé(s)
                                        </h3>
                                    </div>
                                    <ul className="divide-y divide-slate-50">
                                        {resultat.crees.map((c, i) => (
                                            <li key={i} className="px-4 py-2.5 flex items-center gap-3">
                                                <span className="text-xs text-slate-400 w-10">L.{c.ligne}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_COLORS[c.role] ?? 'bg-gray-100'}`}>
                                                    {ROLE_LABELS[c.role] ?? c.role}
                                                </span>
                                                <span className="text-sm text-slate-700">{c.email}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {resultat.erreurs.length > 0 && (
                                <ErrorTable erreurs={resultat.erreurs} />
                            )}
                        </div>
                    )}

                    {/* Preview avant import */}
                    {preview && !resultat && (
                        <div className="space-y-4">
                            {/* Résumé */}
                            <div className="grid grid-cols-3 gap-3">
                                <StatCard label="Lignes totales" value={preview.total}    color="blue" />
                                <StatCard label="Valides"        value={preview.valides}   color="green" />
                                <StatCard label="Avec erreurs"   value={preview.invalides} color="red" />
                            </div>

                            {/* Tableau de preview */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">Aperçu du fichier</h3>
                                    <div className="flex gap-2">
                                        <button onClick={reset}
                                            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200">
                                            Annuler
                                        </button>
                                        {preview.valides > 0 && (
                                            <button
                                                onClick={lancerImport}
                                                disabled={loading}
                                                className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                                            >
                                                {loading ? 'Import…' : `✅ Importer ${preview.valides} utilisateur${preview.valides > 1 ? 's' : ''}`}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-auto max-h-96">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Ligne</th>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Statut</th>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Nom</th>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Email</th>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Rôle</th>
                                                <th className="px-3 py-2 text-slate-500 font-semibold">Erreurs</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.resultats.map(r => (
                                                <tr key={r.ligne} className={`border-t border-slate-50 ${!r.valide ? 'bg-red-50/40' : 'hover:bg-slate-50'}`}>
                                                    <td className="px-3 py-2 text-slate-400">{r.ligne}</td>
                                                    <td className="px-3 py-2">
                                                        {r.valide
                                                            ? <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold">✓ OK</span>
                                                            : <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">✗ Erreur</span>
                                                        }
                                                    </td>
                                                    <td className="px-3 py-2 font-medium text-slate-800">{r.data.nom}</td>
                                                    <td className="px-3 py-2 text-slate-600">{r.data.email}</td>
                                                    <td className="px-3 py-2">
                                                        {r.data.role && (
                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ROLE_COLORS[r.data.role?.toUpperCase()] ?? 'bg-gray-100 text-gray-600'}`}>
                                                                {ROLE_LABELS[r.data.role?.toUpperCase()] ?? r.data.role}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-red-600">
                                                        {r.erreurs.join(' · ')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {preview.invalides > 0 && (
                                <p className="text-xs text-slate-500">
                                    ⚠️ Les lignes en erreur seront ignorées lors de l'import.
                                </p>
                            )}
                        </div>
                    )}

                    {/* État initial */}
                    {!fichier && !preview && !resultat && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                            <p className="text-5xl mb-3">📋</p>
                            <p className="text-sm font-medium">Chargez un fichier pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, color }) {
    const colors = {
        blue:  'bg-blue-50 text-blue-700',
        green: 'bg-green-50 text-green-700',
        red:   'bg-red-50 text-red-700',
    };
    return (
        <div className={`rounded-xl p-4 ${colors[color]}`}>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-0.5">{label}</div>
        </div>
    );
}

function ErrorTable({ erreurs }) {
    return (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <h3 className="text-sm font-semibold text-red-800">
                    ⚠️ {erreurs.length} ligne(s) ignorée(s)
                </h3>
            </div>
            <ul className="divide-y divide-slate-50">
                {erreurs.map((e, i) => (
                    <li key={i} className="px-4 py-2.5">
                        <div className="flex items-start gap-2">
                            <span className="text-xs text-slate-400 w-10 shrink-0">L.{e.ligne}</span>
                            <div>
                                <span className="text-xs font-medium text-slate-700">{e.email}</span>
                                <ul className="mt-0.5 space-y-0.5">
                                    {e.messages.map((m, j) => (
                                        <li key={j} className="text-xs text-red-600">→ {m}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}