import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

// ─── Formulaire générique inline ─────────────────────────────────────────────
function InlineForm({ fields, onSubmit, processing, submitLabel = 'Ajouter', errors = {} }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-2 items-end mt-3">
            {fields.map(f => (
                <div key={f.name} className="flex flex-col gap-1">
                    {f.label && <label className="text-xs text-gray-500">{f.label}</label>}
                    {f.type === 'select' ? (
                        <select
                            value={f.value}
                            onChange={e => f.onChange(e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            required={f.required}
                        >
                            <option value="">— choisir —</option>
                            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={f.value}
                            onChange={e => f.onChange(e.target.value)}
                            placeholder={f.placeholder}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            required={f.required}
                        />
                    )}
                    {errors[f.name] && <p className="text-xs text-red-500">{errors[f.name]}</p>}
                </div>
            ))}
            <button
                type="submit"
                disabled={processing}
                className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {processing ? '…' : submitLabel}
            </button>
        </form>
    );
}

// ─── Bloc filière avec secteurs imbriqués ─────────────────────────────────────
function FiliereBlock({ filiere, allFilieres }) {
    const [editingFiliere, setEditingFiliere] = useState(false);
    const [editingSecteur, setEditingSecteur] = useState(null);
    const [editingTag, setEditingTag] = useState(null);
    const [showSecteurForm, setShowSecteurForm] = useState(false);

    // Formulaire ajout secteur sous cette filière
    const secteurForm = useForm({ secteur: '', filiere_id: filiere.id });
    // Formulaire édition filière
    const filiereEditForm = useForm({ filiere: filiere.filiere });

    function submitNewSecteur(e) {
        e.preventDefault();
        secteurForm.post(route('admin.hierarchie.secteur.store'), {
            onSuccess: () => { secteurForm.reset('secteur'); setShowSecteurForm(false); },
        });
    }

    function submitEditFiliere(e) {
        e.preventDefault();
        filiereEditForm.put(route('admin.hierarchie.filiere.update', filiere.id), {
            onSuccess: () => setEditingFiliere(false),
        });
    }

    function deleteFiliere() {
        if (confirm(`Supprimer la filière "${filiere.filiere}" et tous ses secteurs/tags ?`)) {
            router.delete(route('admin.hierarchie.filiere.destroy', filiere.id));
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            {/* En-tête filière */}
            <div className="flex items-center justify-between">
                {editingFiliere ? (
                    <form onSubmit={submitEditFiliere} className="flex gap-2">
                        <input
                            value={filiereEditForm.data.filiere}
                            onChange={e => filiereEditForm.setData('filiere', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-1 text-sm font-semibold"
                            required
                        />
                        <button type="submit" className="text-sm text-blue-600 hover:underline">OK</button>
                        <button type="button" onClick={() => setEditingFiliere(false)} className="text-sm text-gray-400 hover:underline">Annuler</button>
                    </form>
                ) : (
                    <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">{filiere.filiere}</h3>
                )}
                <div className="flex gap-3 text-xs">
                    <button onClick={() => setEditingFiliere(true)} className="text-blue-500 hover:underline">Renommer</button>
                    <button onClick={deleteFiliere} className="text-red-400 hover:underline">Supprimer</button>
                </div>
            </div>

            {/* Secteurs */}
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
                {filiere.secteurs?.map(secteur => (
                    <SecteurBlock
                        key={secteur.id}
                        secteur={secteur}
                        allFilieres={allFilieres}
                        editingSecteur={editingSecteur}
                        setEditingSecteur={setEditingSecteur}
                        editingTag={editingTag}
                        setEditingTag={setEditingTag}
                    />
                ))}

                {/* Ajout secteur */}
                <button
                    onClick={() => setShowSecteurForm(p => !p)}
                    className="text-xs text-blue-500 hover:underline mt-1"
                >
                    + Ajouter un secteur
                </button>
                {showSecteurForm && (
                    <InlineForm
                        fields={[{
                            name: 'secteur', label: 'Nom du secteur',
                            value: secteurForm.data.secteur,
                            onChange: v => secteurForm.setData('secteur', v),
                            placeholder: 'ex: DevWeb',
                            required: true,
                        }]}
                        onSubmit={submitNewSecteur}
                        processing={secteurForm.processing}
                        errors={secteurForm.errors}
                    />
                )}
            </div>
        </div>
    );
}

// ─── Bloc secteur avec tags imbriqués ─────────────────────────────────────────
function SecteurBlock({ secteur, allFilieres, editingSecteur, setEditingSecteur, editingTag, setEditingTag }) {
    const [showTagForm, setShowTagForm] = useState(false);
    const tagForm = useForm({ tag: '', secteur_id: secteur.id });
    const secteurEditForm = useForm({ secteur: secteur.secteur, filiere_id: secteur.filiere_id });

    function submitNewTag(e) {
        e.preventDefault();
        tagForm.post(route('admin.hierarchie.tag.store'), {
            onSuccess: () => { tagForm.reset('tag'); setShowTagForm(false); },
        });
    }

    function submitEditSecteur(e) {
        e.preventDefault();
        secteurEditForm.put(route('admin.hierarchie.secteur.update', secteur.id), {
            onSuccess: () => setEditingSecteur(null),
        });
    }

    function deleteSecteur() {
        if (confirm(`Supprimer le secteur "${secteur.secteur}" et ses tags ?`)) {
            router.delete(route('admin.hierarchie.secteur.destroy', secteur.id));
        }
    }

    const isEditing = editingSecteur === secteur.id;

    return (
        <div className="bg-gray-50 rounded-lg px-4 py-3">
            {/* En-tête secteur */}
            <div className="flex items-center justify-between">
                {isEditing ? (
                    <form onSubmit={submitEditSecteur} className="flex gap-2 flex-wrap">
                        <input
                            value={secteurEditForm.data.secteur}
                            onChange={e => secteurEditForm.setData('secteur', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-0.5 text-sm"
                            required
                        />
                        <select
                            value={secteurEditForm.data.filiere_id}
                            onChange={e => secteurEditForm.setData('filiere_id', Number(e.target.value))}
                            className="border border-gray-200 rounded px-2 py-0.5 text-sm"
                        >
                            {allFilieres.map(f => <option key={f.id} value={f.id}>{f.filiere}</option>)}
                        </select>
                        <button type="submit" className="text-sm text-blue-600 hover:underline">OK</button>
                        <button type="button" onClick={() => setEditingSecteur(null)} className="text-sm text-gray-400 hover:underline">Annuler</button>
                    </form>
                ) : (
                    <span className="text-sm font-semibold text-gray-700">{secteur.secteur}</span>
                )}
                {!isEditing && (
                    <div className="flex gap-3 text-xs">
                        <button onClick={() => setEditingSecteur(secteur.id)} className="text-blue-500 hover:underline">Modifier</button>
                        <button onClick={deleteSecteur} className="text-red-400 hover:underline">Supprimer</button>
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1.5 pl-2 border-l border-gray-200">
                {secteur.tags?.map(tag => (
                    <TagChip key={tag.id} tag={tag} editingTag={editingTag} setEditingTag={setEditingTag} />
                ))}
                <button onClick={() => setShowTagForm(p => !p)} className="text-xs text-blue-400 hover:underline">+ tag</button>
            </div>
            {showTagForm && (
                <InlineForm
                    fields={[{
                        name: 'tag', label: null,
                        value: tagForm.data.tag,
                        onChange: v => tagForm.setData('tag', v),
                        placeholder: 'ex: React',
                        required: true,
                    }]}
                    onSubmit={submitNewTag}
                    processing={tagForm.processing}
                    errors={tagForm.errors}
                />
            )}
        </div>
    );
}

// ─── Chip tag éditable ────────────────────────────────────────────────────────
function TagChip({ tag, editingTag, setEditingTag }) {
    const editForm = useForm({ tag: tag.tag, secteur_id: tag.secteur_id });

    function submitEdit(e) {
        e.preventDefault();
        editForm.put(route('admin.hierarchie.tag.update', tag.id), {
            onSuccess: () => setEditingTag(null),
        });
    }

    function deleteTag() {
        router.delete(route('admin.hierarchie.tag.destroy', tag.id));
    }

    if (editingTag === tag.id) {
        return (
            <form onSubmit={submitEdit} className="flex gap-1 items-center">
                <input
                    value={editForm.data.tag}
                    onChange={e => editForm.setData('tag', e.target.value)}
                    className="border border-gray-200 rounded px-2 py-0.5 text-xs w-24"
                    required
                />
                <button type="submit" className="text-xs text-blue-600 hover:underline">OK</button>
                <button type="button" onClick={() => setEditingTag(null)} className="text-xs text-gray-400 hover:underline">✕</button>
            </form>
        );
    }

    return (
        <span className="group flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
            {tag.tag}
            <button onClick={() => setEditingTag(tag.id)} className="hidden group-hover:inline text-blue-400 hover:text-blue-600">✎</button>
            <button onClick={deleteTag} className="hidden group-hover:inline text-red-300 hover:text-red-500">✕</button>
        </span>
    );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminHierarchie({ filieres = [], tags = [] }) {
    const [showFiliereForm, setShowFiliereForm] = useState(false);
    const filiereForm = useForm({ filiere: '' });

    function submitNewFiliere(e) {
        e.preventDefault();
        filiereForm.post(route('admin.hierarchie.filiere.store'), {
            onSuccess: () => { filiereForm.reset(); setShowFiliereForm(false); },
        });
    }

    return (
        <AdminLayout title="Hiérarchie Filière → Secteur → Tag">
            <Head title="Hiérarchie" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">Filière → Secteur → Tag</h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {filieres.length} filière{filieres.length !== 1 ? 's' : ''} —{' '}
                        {filieres.reduce((n, f) => n + (f.secteurs?.length ?? 0), 0)} secteurs —{' '}
                        {tags.length} tags
                    </p>
                </div>
                <button
                    onClick={() => setShowFiliereForm(p => !p)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
                >
                    + Filière
                </button>
            </div>

            {showFiliereForm && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nouvelle filière</p>
                    <InlineForm
                        fields={[{
                            name: 'filiere', label: null,
                            value: filiereForm.data.filiere,
                            onChange: v => filiereForm.setData('filiere', v),
                            placeholder: 'ex: MATHS',
                            required: true,
                        }]}
                        onSubmit={submitNewFiliere}
                        processing={filiereForm.processing}
                        errors={filiereForm.errors}
                        submitLabel="Créer"
                    />
                </div>
            )}

            <div className="space-y-4">
                {filieres.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-12">Aucune filière. Commencez par en créer une.</p>
                ) : (
                    filieres.map(f => (
                        <FiliereBlock key={f.id} filiere={f} allFilieres={filieres} />
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
