export default function AdminIndexUser({ users }){
    return (
        <div>
            <h1>
                Liste Utilisateurs
            </h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prenom</th>
                        <th>email</th>
                        <th>role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user)=>(
                        <tr key={user.id}>
                            <th>
                            {user.id}
                            </th>
                            <th>{user.nom}</th>
                            <th>{user.prenom}</th>
                            <th>{user.email}</th>
                            <th>{user.role}</th>
                        </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}