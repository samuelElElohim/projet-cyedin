import { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function AdminIndexEnterprise({ entreprise, count }){
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    function handleEdit(entreprise) {
        setEditingId(entreprise.id); // entreprise (pas "e")
        setEditData(entreprise);
    }

    function handleSave(entreprise){
        router.post(route('admin.edit.entreprise', {id : entreprise.id}), editData);
        setEditingId(null);
    }

    return (
        <div>
            <h1>Liste Entreprise</h1>
            <div>
                <p>Number of entreprise : {count}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Addresse</th>
                    </tr>
                </thead>
                <tbody>
                    {entreprise.map((entreprise) => (
                        <tr key={entreprise.utilisateurs_id}>
                            <td className="px-4 py-2">
                                {entreprise.utilisateurs_id}
                            </td>
                            <td className="px-4 py-2">
                                {editingId === entreprise.utilisateurs_id  // accolade ouvrante manquante
                                    ? <input value={editData.nom_entreprise} onChange={e => setEditData({...editData, nom_entreprise: e.target.value})}/>
                                    : entreprise.nom_entreprise
                                }
                            </td>
                            <td className="px-4 py-2">
                                {editingId === entreprise.utilisateurs_id
                                    ? <button onClick={() => handleSave(entreprise)}>[Sauvegarder]</button>
                                    : <button onClick={() => handleEdit(entreprise)}>[Modifier]</button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href={route("admin.main.entreprise")} className="px-4 py-2 bg-blue-600 text-white rounded">
                Retour
            </Link>
        </div>
    );
}   