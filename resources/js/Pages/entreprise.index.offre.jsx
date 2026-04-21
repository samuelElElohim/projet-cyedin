export default function OffreIndex({ offres }) {
    return (
        <>
            <h1>
                Liste des offres actives : 
            </h1>
            {(offres ?? []).map(o => (
                <div key={o.id}>{o.titre}</div>
            ))}
        </>
    );
}