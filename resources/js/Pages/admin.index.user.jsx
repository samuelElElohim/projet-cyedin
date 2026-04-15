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
    // Factoré pour tous les types de tables avec le ...Object.fromEntries etc.
    function handleEdit(row, extraFields = []) {
        setEditingId(row.utilisateur.id);
        setEditData({
            utilisateur_id: row.utilisateur.id,
            nom: row.utilisateur.nom,
            prenom: row.utilisateur.prenom,
            email: row.utilisateur.email,
            role: row.utilisateur.role,
            ...Object.fromEntries(extraFields.map(f => [f, row[f]])),
        });
    }
    // Pour users, pas de .utilisateur
    function handleEditUser(user) {
        setEditingId(user.id);
        setEditData({ utilisateur_id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role });
    }

    // Quand on clique on enregistre.
    function handleSave(){
        router.post(route('admin.edit.user', {id : editData.utilisateur_id}), editData);
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
                            <button onClick={() => handleSave()}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEditUser(user)}> [Modifier] </button>
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
                    <tr key={admin.utilisateur.id}>
                        <td className="px-4 py-2">
                        {admin.utilisateur.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === admin.utilisateur.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                admin.utilisateur.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === admin.utilisateur.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                admin.utilisateur.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === admin.utilisateur.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                admin.utilisateur.email}</td>
                        <td className="px-4 py-2">{
                        editingId === admin.utilisateur.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                admin.utilisateur.role}</td>
                        <td className="px-4 py-2">
                            {
                            editingId===admin.utilisateur.id
                            ?
                            <button onClick={() => handleSave()}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(admin, [])}> [Modifier] </button>
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
                    <tr key={ent.utilisateur.id}>
                        <td className="px-4 py-2">
                        {ent.utilisateur.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === ent.utilisateur.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                ent.utilisateur.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === ent.utilisateur.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                ent.utilisateur.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === ent.utilisateur.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                ent.utilisateur.email}</td>
                        <td className="px-4 py-2">{
                        editingId === ent.utilisateur.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                ent.utilisateur.role}</td>
                        <td className="px-4 py-2">{
                            editingId === ent.utilisateur.id
                                ? <input value={editData.addresse} onChange={e=>setEditData({...editData, role : e.target.value})}/>
                                :
                                ent.addresse
                            }
                        </td>
                        <td className="px-4 py-2">{
                            editingId === ent.utilisateur.id
                                ? <input value={editData.secteur} onChange={e=>setEditData({...editData, secteur : e.target.value})}/>
                                :
                                ent.secteur
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                            editingId===ent.utilisateur.id
                            ?
                            <button onClick={() => handleSave()}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(ent, ["addresse", "secteur"])}> [Modifier] </button>
                            }
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>)}

            {activeTable==="tutors" && (<table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Prenom</th>
                        <th className="px-4 py-2">email</th>
                        <th className="px-4 py-2">role</th>
                        <th className="px-4 py-2">secteur</th>
                        {/*<th className="px-4 py-2"> est_jury </th>*/}
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {tutors.map((tut)=>(
                    <tr key={tut.utilisateur.id}>
                        <td className="px-4 py-2">
                        {tut.utilisateur.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === tut.utilisateur.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                tut.utilisateur.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === tut.utilisateur.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                tut.utilisateur.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === tut.utilisateur.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                tut.utilisateur.email}</td>
                        <td className="px-4 py-2">{
                        editingId === tut.utilisateur.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                tut.utilisateur.role}</td>
                        <td className="px-4 py-2">{
                            editingId === tut.utilisateur.id
                                ? <input value={editData.addresse} on onChange={e=>setEditData({...editData, role : e.target.value})}/>
                                :
                                tut.departement
                            }
                        </td>
                        {/*<td className="px-4 py-2">{
                            editingId === tut.utilisateur.id
                                ? <input value={editData.est_jury} on onChange={e=>setEditData({...editData, secteur : e.target.value})}/>
                                :
                                tut.est_jury
                            }
                        </td>*/}
                        <td className="px-4 py-2">
                            {
                            editingId===tut.utilisateur.id
                            ?
                            <button onClick={() => handleSave()}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(tut, ["secteur"])}> [Modifier] </button>
                            }
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>)}

            {activeTable==="students" && (<table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Prenom</th>
                        <th className="px-4 py-2">email</th>
                        <th className="px-4 py-2">role</th>
                        <th className="px-4 py-2">filiere</th>
                        <th className="px-4 py-2">niveau étude</th>

                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((stu)=>(
                    <tr key={stu.utilisateur.id}>
                        <td className="px-4 py-2">
                        {stu.utilisateur.id}
                        </td>
                        <td className="px-4 py-2">
                            {
                                editingId === stu.utilisateur.id
                                // Si on est sur le user à modifier  :
                                // On edit les data (...editData permet de sauvegarder tout SAUF le nom)
                                ? <input value={editData.nom} onChange={e=> setEditData({...editData, nom : e.target.value})}/> 
                                :
                                // Sinon, on affiche juste le nom.
                                stu.utilisateur.nom
                            }
                        </td>
                        <td className="px-4 py-2">
                            {
                                
                                editingId === stu.utilisateur.id
                                ? <input value={editData.prenom} onChange={e=> setEditData({...editData, prenom : e.target.value})}/>
                                :
                                stu.utilisateur.prenom
                            }
                        </td>
                        <td className="px-4 py-2">{
                                editingId === stu.utilisateur.id
                                ? <input value={editData.email} onChange={e=> setEditData({...editData, email : e.target.value})}/>
                                :
                                stu.utilisateur.email}</td>
                        <td className="px-4 py-2">{
                        editingId === stu.utilisateur.id
                                ? <input value={editData.role} onChange={e=> setEditData({...editData, role : e.target.value})}/>
                                :
                                stu.utilisateur.role}</td>

                        <td className="px-4 py-2">{
                            editingId === stu.utilisateur.id
                                ? <input value={editData.addresse} on onChange={e=>setEditData({...editData, role : e.target.value})}/>
                                :
                                stu.filiere
                            }
                        </td>
                        <td className="px-4 py-2">{
                            editingId === stu.utilisateur.id
                                ? <input value={editData.addresse} on onChange={e=>setEditData({...editData, role : e.target.value})}/>
                                :
                                stu.niveau_etud
                            }
                        </td>
                       
                        <td className="px-4 py-2">
                            {
                            editingId===stu.utilisateur.id
                            ?
                            <button onClick={() => handleSave()}> [Sauvegarder] </button>
                            :
                            <button onClick={() => handleEdit(stu, ["filiere", "niveau_etud"])}> [Modifier] </button>
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


