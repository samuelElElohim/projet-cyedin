import { useState } from "react";
import { Link, router } from "@inertiajs/react";


const ROLES = [
        {value: 'users', label: 'Utilisateur'},
        { value: 'admins', label: 'Administrateur' },
        { value: 'entreprises', label: 'Entreprise' },
        { value: 'tutors', label: 'Tuteur' },
        { value: 'students', label: 'Étudiant' },
        { value: 'jury', label: 'Jury' },
    ]


export default function AdminIndexUser({ users, admins, entreprises, tutors, students, jury, count }){
    const [editingId, setEditingId] = useState(null); // On set les valeurs et les tableaus à null et {}
    const [editData, setEditData] = useState({});
    const [activeTable, setActiveTable] = useState('users');
    
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

            {/* Boutons de sélection de table */}
            <div style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
                {ROLES.map(t => (
                    <button
                        key={t.value}
                        onClick={() => setActiveTable(t.value)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            background: activeTable === t.value ? '#2563eb' : '#e5e7eb',
                            color: activeTable === t.value ? '#fff' : '#111',
                            fontWeight: activeTable === t.value ? '700' : '400',
                        }}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* CONTENU DYNAMIQUE SELON LA TABLE ACTIVE*/}
            {activeTable==="users" && (<table>
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
            </table>)}
            
            {activeTable==="admins" && (<table>
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
                    {admins.map((admin)=>(
                    <tr key={admin.id}>
                        <td className="px-4 py-2">
                        {admin.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === admin.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                admin.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === admin.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                admin.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === admin.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                admin.email}</td>
                        <td className="px-4 py-2">{
                        editingId === admin.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                admin.role}</td>
                        <td className="px-4 py-2">
                            {
                            editingId===admin.id
                            ?
                            <button onClick={() => handleSave(admin)}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(admin)}> [Modifier] </button>
                            }
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>)}

            {activeTable==="entreprises" && (<table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Prenom</th>
                        <th className="px-4 py-2">email</th>
                        <th className="px-4 py-2">role</th>
                        <th className="px-4 py-2">addresse</th>
                        <th className="px-4 py-2">secteur</th>
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {entreprises.map((ent)=>(
                    <tr key={ent.id}>
                        <td className="px-4 py-2">
                        {ent.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === ent.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                ent.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === ent.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                ent.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === ent.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                ent.email}</td>
                        <td className="px-4 py-2">{
                        editingId === ent.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                ent.role}</td>
                        <td className="px-4 py-2">{
                            editingId === ent.id
                                ? <input value={editData.addresse} on onChange={e=>setEditData({...editData, role : e.target.value})}/>
                                :
                                ent.addresse
                            }
                        </td>
                        <td className="px-4 py-2">{
                            editingId === ent.id
                                ? <input value={editData.secteur} on onChange={e=>setEditData({...editData, secteur : e.target.value})}/>
                                :
                                ent.secteur
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                            editingId===ent.id
                            ?
                            <button onClick={() => handleSave(ent)}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(ent)}> [Modifier] </button>
                            }
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>)}

            <Link href={route("admin.main.user")}
            className="px-4 py-2 bg-blue-600 text-white rounded">
            Retour
            </Link>
        </div>
    )


}


