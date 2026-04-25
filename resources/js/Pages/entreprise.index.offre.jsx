import { useForm, router } from "@inertiajs/react"

export default function OffreIndex({ offres }) {

    const { data, setData, post, reset, errors } = useForm({
        titre: '',
        description: '',
        duree_semaines: '',
    })

    function handleSubmit(e) {
        e.preventDefault()
        post(route('entreprise.store.offre'), {
            onSuccess: () => reset()
        })
    }

    return (
        <>
            <h1>Liste des offres :</h1>

            {(offres ?? []).map(o => (
                <div key={o.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                    
                    {/* Titre + badge candidatures */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <strong>{o.titre}</strong>
                        <span style={{
                            background: o.candidatures?.length > 0 ? '#dcfce7' : '#f3f4f6',
                            color: o.candidatures?.length > 0 ? '#16a34a' : '#6b7280',
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}>
                            {o.candidatures?.length ?? 0} candidature{o.candidatures?.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Liste des candidatures */}
                    {o.candidatures?.length > 0 && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {o.candidatures.map(c => (
                                <div key={c.id} style={{
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    padding: '0.6rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Infos étudiant */}
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                            {c.etudiant?.nom} {c.etudiant?.prenom}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {c.etudiant?.email}
                                        </p>
                                    </div>

                                    {/* Statut */}
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        background: c.statut === 'acceptee' ? '#dcfce7'
                                                  : c.statut === 'refusee'  ? '#fee2e2'
                                                  : '#fef9c3',
                                        color: c.statut === 'acceptee' ? '#16a34a'
                                             : c.statut === 'refusee'  ? '#dc2626'
                                             : '#854d0e',
                                    }}>
                                        {c.statut === 'acceptee' ? '✓ Acceptée'
                                       : c.statut === 'refusee'  ? '✗ Refusée'
                                       : '⏳ En attente'}
                                    </span>

                                    {/* Documents */}
                                    {c.documents?.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {c.documents.map(doc => (
                                                <a
                                                    key={doc.id}
                                                    href={`/storage/${doc.chemin_fichier}`}
                                                    target="_blank"
                                                    style={{ fontSize: '0.7rem', color: '#4f46e5', textDecoration: 'underline' }}
                                                >
                                                    {doc.nom}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <hr />
            <h2>Créer une nouvelle offre</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={data.titre}
                    onChange={e => setData('titre', e.target.value)}
                    placeholder="Titre de l'offre"
                />
                {errors.titre && <span>{errors.titre}</span>}

                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    placeholder="Description"
                />
                {errors.description && <span>{errors.description}</span>}

                <input
                    type="number"
                    value={data.duree_semaines}
                    onChange={e => setData('duree_semaines', e.target.value)}
                    placeholder="Durée en semaines"
                />
                {errors.duree_semaines && <span>{errors.duree_semaines}</span>}

                <button type="submit">Ajouter l'offre</button>
            </form>

            <button onClick={() => router.get(route('entreprise.dashboard'))}>
                Retour
            </button>
        </>
    )
}