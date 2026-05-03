import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: "'Inter', sans-serif",
            background: 'var(--bg-page)',
        }}>
            {/* Left panel — brand */}
            <div style={{
                display: 'none',
                flex: 1,
                background: 'linear-gradient(160deg, var(--brand-navy) 0%, #1F3C88 60%, #2F80ED 100%)',
                padding: '48px',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }} className="guest-brand-panel">

                <div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 48 }}>
                        CY<span style={{ color: '#60A5FA' }}>edin</span>
                    </div>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 16 }}>
                        Plateforme de gestion des stages
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, lineHeight: 1.7, maxWidth: 380 }}>
                        Gérez vos candidatures, conventions et dossiers de stage au sein de l'écosystème CY Tech.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {['Étudiants', 'Tuteurs', 'Entreprises', 'Jury', 'Admins'].map(role => (
                        <span key={role} style={{
                            padding: '6px 14px',
                            background: 'rgba(255,255,255,.1)',
                            borderRadius: 99,
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,.75)',
                            border: '1px solid rgba(255,255,255,.15)',
                        }}>
                            {role}
                        </span>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div style={{
                width: '100%',
                maxWidth: 480,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '40px 32px',
                background: '#fff',
                boxShadow: '-1px 0 0 var(--border)',
            }}>
                {/* Logo */}
                <div style={{ marginBottom: 36 }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 24, fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '-0.03em' }}>
                            CY<span style={{ color: 'var(--brand-accent)' }}>edin</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
                            CY Tech · Gestion des stages
                        </div>
                    </Link>
                </div>

                {/* Slot */}
                <div>{children}</div>

                {/* Footer */}
                <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        CYedin © {new Date().getFullYear()} · CY Tech Pau
                    </p>
                </div>
            </div>

            <style>{`
                @media (min-width: 900px) {
                    .guest-brand-panel { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
