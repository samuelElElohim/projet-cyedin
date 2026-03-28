import {router} from '@inertiajs/react';

export default function adminMain(){
    return <div>
        <h1>Dashboard Admin</h1>
        <button onClick={()=> router.get(route("admin.index.user"))} className="px-4 py-2 bg-blue-600 text-white rounded">Afficher DB</button>
        <button onClick={()=> router.get(route("admin.create.user"))} className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter DB</button>        

    </div>
}