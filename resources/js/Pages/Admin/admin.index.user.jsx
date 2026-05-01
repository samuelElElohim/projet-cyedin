import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const ROLE_TABS = [
    { value: 'users',      label: 'Tous',        icon: '👥' },
    { value: 'admins',     label: 'Admins',       icon: '🔑' },
    { value: 'students',   label: 'Étudiants',    icon: '🎓' },
    { value: 'entreprises',label: 'Entreprises',  icon: '🏢' },
    { value: 'tutors',     label: 'Tuteurs',      icon: '👨‍🏫' },
];

const ROLE_LABELS = { A: 'Admin', S: 'Étudiant', E: 'Entreprise', T: 'Tuteur', J: 'Jury' };

export default function AdminIndexUser({ users, admins, students, entreprises, tutors, count, filieres }) {
    const [activeTab, setActiveTab]   = useState('users');
    const [editingId, setEditingId]   = useState(null);
    const [editData, setEditData]     = useState({});
    const [search, setSearch]         = useState('');

    function startEdit(row, extraFields = []) {
        setEditingId(row.utilisateur.id);
        setEditData({
            utilisateur_id: row.utilisateur.id,
            nom:            row.utilisateur.nom,
            prenom:         row.utilisateur.prenom,
            email:          row.utilisateur.email,
            role:           row.utilisateur.role,
            ...Object.fromEntries(extraFields.map(f => [f, row[f]])),
        });
    }

    function startEditUser(user) {
        setEditingId(user.id);
        setEditData({ utilisateur_id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role });
    }

    function save() {
        router.post(route('admin.edit.user', { id: editData.utilisateur_id }), editData, {
            onSuccess: () => setEditingId(null),
        });
    }

    function deleteUser(userId) {
        if (!confirm('Supprimer définitivement cet utilisateur ?')) return;
        router.delete(route('admin.delete.user', { id: userId }));
    }

    function toggleActive(userId) {
        router.post(route('admin.toggle.user', { id: userId }));
    }

    function field(key, label, isEditing, value, displayValue) {
        if (isEditing) {
            return (
                <input
                    value={editData[key] ?? ''}
                    onChange={e => setEditData(d => ({ ...d, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder={label}
                />
            );
        }
        return <span className="text-sm text-gray-800">{displayValue ?? value}</span>;
    }

    const filterRows = (rows, getSearchable) =>
        rows?.filter(r => getSearchable(r).toLowerCase().includes(search.toLowerCase())) ?? [];

    return (
        <AdminLayout title="Gestion des utilisateurs">
            <Head title="Utilisateurs — Admin" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-500">{count} utilisateurs enregistrés</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Rechercher…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <Link
                        href={route('admin.create.user')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        + Ajouter
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
                {ROLE_TABS.map(t => (
                    <button
                        key={t.value}
                        onClick={() => setActiveTab(t.value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            activeTab === t.value
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* Table wrapper */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

                {/* ── Tous les utilisateurs ── */}
                {activeTab === 'users' && (
                    <Table
                        heads={['ID', 'Nom', 'Prénom', 'Email', 'Rôle', 'Statut', '']}
                        rows={filterRows(users, u => `${u.nom} ${u.prenom} ${u.email}`)}
                        renderRow={user => (
                            <tr key={user.id} className="border-t border-gray-50 hover:bg-gray-50">
                                <Td>{user.id}</Td>
                                <Td>{field('nom', 'Nom', editingId === user.id, user.nom)}</Td>
                                <Td>{field('prenom', 'Prénom', editingId === user.id, user.prenom)}</Td>
                                <Td>{field('email', 'Email', editingId === user.id, user.email)}</Td>
                                <Td>
                                    {editingId === user.id
                                        ? <RoleSelect value={editData.role} onChange={v => setEditData(d => ({ ...d, role: v }))} />
                                        : <RoleBadge role={user.role} />}
                                </Td>
                                <Td><StatusBadge active={user.est_active} /></Td>
                                <Td>
                                    <ActionButtons
                                    isEditing={editingId === user.id}
                                    onEdit={() => startEditUser(user)}
                                    onSave={save}
                                    onCancel={() => setEditingId(null)}
                                    onToggle={() => toggleActive(user.id)}
                                    onDelete={() => deleteUser(user.id)}
                                    showDelete={user.role !== 'A'}   // ← pas de delete pour les admins
                                    active={user.est_active}
                                />
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {/* ── Admins ── */}
                {activeTab === 'admins' && (
                    <Table
                        heads={['ID', 'Nom', 'Prénom', 'Email', '']}
                        rows={filterRows(admins, a => `${a.utilisateur.nom} ${a.utilisateur.email}`)}
                        renderRow={admin => (
                            <tr key={admin.utilisateurs_id} className="border-t border-gray-50 hover:bg-gray-50">
                                <Td>{admin.utilisateur.id}</Td>
                                <Td>{field('nom', 'Nom', editingId === admin.utilisateur.id, admin.utilisateur.nom)}</Td>
                                <Td>{field('prenom', 'Prénom', editingId === admin.utilisateur.id, admin.utilisateur.prenom)}</Td>
                                <Td>{field('email', 'Email', editingId === admin.utilisateur.id, admin.utilisateur.email)}</Td>
                                <Td>
                                    <ActionButtons
                                        isEditing={editingId === admin.utilisateur.id}
                                        onEdit={() => startEdit(admin)}
                                        onSave={save}
                                        onCancel={() => setEditingId(null)}
                                        onToggle={() => toggleActive(admin.utilisateur.id)}
                                        active={admin.utilisateur.est_active}
                                    />
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {/* ── Étudiants ── */}
                
                {activeTab === 'students' && (
                    <Table
                    
                        heads={['ID', 'Nom', 'Email', 'Filière', 'Niveau', 'Statut', '']}
                        rows={filterRows(students, s => `${s.utilisateur.nom} ${s.utilisateur.email} ${s.filiere}`)}
                        renderRow={stu => {console.log(stu); return(
                            <tr key={stu.utilisateurs_id} className="border-t border-gray-50 hover:bg-gray-50">
                                <Td>{stu.utilisateur.id}</Td>
                                <Td>{stu.utilisateur.nom} {stu.utilisateur.prenom}</Td>
                                <Td>{stu.utilisateur.email}</Td>
                                <Td>{field('filiere', 'Filière', editingId === stu.utilisateur.id, stu.filiere?.filiere)}</Td>
                                <Td>{field('niveau_etud', 'Niveau', editingId === stu.utilisateur.id, stu.niveau_etud)}</Td>
                                <Td><StatusBadge active={stu.utilisateur.est_active} /></Td>
                                <Td>
                                    <ActionButtons
                                        isEditing={editingId === stu.utilisateur.id}
                                        onEdit={() => startEdit(stu, ['filiere', 'niveau_etud'])}
                                        onSave={save}
                                        onCancel={() => setEditingId(null)}
                                        onToggle={() => toggleActive(stu.utilisateur.id)}
                                        active={stu.utilisateur.est_active}
                                        onDelete={() => deleteUser(stu.utilisateur.id)}
                                        showDelete={true}
                                    />
                                </Td>
                            </tr>
                        )}
                    }
                        
                    />
                )}

                {/* ── Entreprises ── */}
                {activeTab === 'entreprises' && (
                    <Table
                        heads={['ID', 'Nom entreprise', 'Email', 'Secteurs', 'Adresse', 'Statut', '']}
                        rows={filterRows(entreprises, e => `${e.nom_entreprise} ${e.utilisateur.email}`)}
                        renderRow={ent => (
                            <tr key={ent.utilisateurs_id} className="border-t border-gray-50 hover:bg-gray-50">
                                <Td>{ent.utilisateur.id}</Td>
                                <Td className="font-medium">{field('nom', 'Nom', editingId === ent.utilisateur.id, ent.utilisateur.nom)}</Td>
                                <Td>{ent.utilisateur.email}</Td>
                                <Td>
                                    <div className="flex flex-wrap gap-1">
                                        {ent.secteurs?.length > 0
                                            ? ent.secteurs.map(s => (
                                                <span key={s.id} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                                                    {s.filiere?.filiere} / {s.secteur}
                                                </span>
                                            ))
                                            : <span className="text-xs text-gray-300">—</span>
                                        }
                                    </div>
                                </Td>
                                <Td>{field('addresse', 'Adresse', editingId === ent.utilisateur.id, ent.addresse)}</Td>
                                <Td><StatusBadge active={ent.utilisateur.est_active} /></Td>
                                <Td>
                                    <ActionButtons
                                        isEditing={editingId === ent.utilisateur.id}
                                        onEdit={() => startEdit(ent, ['addresse'])}
                                        onSave={save}
                                        onCancel={() => setEditingId(null)}
                                        onToggle={() => toggleActive(ent.utilisateur.id)}
                                        active={ent.utilisateur.est_active}
                                        onDelete={() => deleteUser(ent.utilisateur.id)}
                                        showDelete={true}
                                    />
                                </Td>
                            </tr>
                        )}
                    />
                )}

                {/* ── Tuteurs ── */}
                {activeTab === 'tutors' && (
                    <Table
                        heads={['ID', 'Nom', 'Email', 'Secteurs supervisés', 'Statut', '']}
                        rows={filterRows(tutors ?? [], t => `${t.utilisateur.nom} ${t.utilisateur.email}`)}
                        renderRow={tut => (
                            <tr key={tut.utilisateurs_id} className="border-t border-gray-50 hover:bg-gray-50">
                                <Td>{tut.utilisateur.id}</Td>
                                <Td>{tut.utilisateur.nom} {tut.utilisateur.prenom}</Td>
                                <Td>{tut.utilisateur.email}</Td>
                                <Td>
                                    <div className="flex flex-wrap gap-1">
                                        {tut.secteurs?.length > 0
                                            ? tut.secteurs.map(s => (
                                                <span key={s.id} className="px-1.5 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full">
                                                    {s.filiere?.filiere} / {s.secteur}
                                                </span>
                                            ))
                                            : <span className="text-xs text-gray-300">—</span>
                                        }
                                    </div>
                                </Td>
                                <Td><StatusBadge active={tut.utilisateur.est_active} /></Td>
                                <Td>
                                    <ActionButtons
                                        isEditing={editingId === tut.utilisateur.id}
                                        onEdit={() => startEdit(tut)}
                                        onSave={save}
                                        onCancel={() => setEditingId(null)}
                                        onToggle={() => toggleActive(tut.utilisateur.id)}
                                        active={tut.utilisateur.est_active}
                                        onDelete={() => deleteUser(tut.utilisateur.id)}
                                        showDelete={true}
                                    />
                                </Td>
                            </tr>
                        )}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

/* ─── Composants partagés ─────────────────────────────────────────────── */

function Table({ heads, rows, renderRow }) {
    return (
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    {heads.map(h => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={heads.length} className="px-4 py-8 text-center text-sm text-gray-400">
                            Aucun résultat.
                        </td>
                    </tr>
                ) : (
                    rows.map(renderRow)
                )}
            </tbody>
        </table>
    );
}

function Td({ children, className = '' }) {
    return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function RoleBadge({ role }) {
    const colors = {
        A: 'bg-purple-100 text-purple-800',
        S: 'bg-blue-100 text-blue-800',
        E: 'bg-amber-100 text-amber-800',
        T: 'bg-teal-100 text-teal-800',
        J: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[role] ?? 'bg-gray-100 text-gray-600'}`}>
            {ROLE_LABELS[role] ?? role}
        </span>
    );
}

function StatusBadge({ active }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
            {active ? 'Actif' : 'Inactif'}
        </span>
    );
}

function RoleSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
            <option value="A">Admin</option>
            <option value="S">Étudiant</option>
            <option value="E">Entreprise</option>
            <option value="T">Tuteur</option>
            <option value="J">Jury</option>
        </select>
    );
}

function ActionButtons({ isEditing, onEdit, onSave, onCancel, onToggle, onDelete, active, showDelete = false }) {
    return (
        <div className="flex items-center gap-2">
            {isEditing ? (
                <>
                    <button onClick={onSave} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                        Sauvegarder
                    </button>
                    <button onClick={onCancel} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                        Annuler
                    </button>
                </>
            ) : (
                <>
                    <button onClick={onEdit} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100">
                        Modifier
                    </button>
                    <button
                        onClick={onToggle}
                        className={`px-2 py-1 text-xs rounded ${
                            active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                    >
                        {active ? 'Désactiver' : 'Activer'}
                    </button>
                    {showDelete && (
                        <button
                            onClick={onDelete}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                            🗑 Supprimer
                        </button>
                    )}
                </>
            )}
        </div>
    );
}