import { useState } from "react";
import { Link, router } from "@inertiajs/react";



export default function AdminIndexUser({ users, count }){
    const [editingId, setEditingId] = useState(null); // On set les valeurs et les tableaus à null et {}
    const [editData, setEditData] = useState({});

    // Quand on clique sur modifier on tombe là dessus, ça initialise le dataset qu'on a.
    function handleEdit(user) {
        setEditingId(user.id);
        setEditData(user);
    }

    // Quand on clique on enregistre.
    function handleSave(user){
        router.post(route('admin.edit.user', {id : user.id}), editData);
        setEditingId(null);
    }

    return (
        <div>
            <h1>
                Liste Utilisateurs
            </h1>
            <div>
                <p> Number of users : {count}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Prenom</th>
                        <th className="px-4 py-2">email</th>
                        <th className="px-4 py-2">role</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user)=>(
                    <tr key={user.id}>
                        <td className="px-4 py-2">
                        {user.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === user.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                user.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === user.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                user.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === user.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                user.email}</td>
                        <td className="px-4 py-2">{
                        editingId === user.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                user.role}</td>
                        <td className="px-4 py-2">
                            {
                            editingId===user.id
                            ?
                            <button onClick={() => handleSave(user)}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(user)}> [Modifier] </button>
                            }
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <Link href={route("admin.main.user")}
            className="px-4 py-2 bg-blue-600 text-white rounded">
            Retour
            </Link>
        </div>
    )


}


