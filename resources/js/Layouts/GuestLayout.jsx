import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--c-black)',
            fontFamily: "'VT323', monospace",
            padding: '24px 16px',
        }}>
            {/* Scanlines overlay */}
            <div style={{
                position: 'fixed', inset: 0,
                backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', marginBottom: 24, position: 'relative', zIndex: 1, display: 'block', textAlign: 'center' }}>
                <div className="glow" style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 48,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--c-cyan)',
                    textShadow: '0 0 10px var(--c-cyan), 0 0 30px var(--c-cyan), 0 0 60px #00ffff44',
                    lineHeight: 1,
                }}>
                    CY<span style={{ color: 'var(--c-magenta)', textShadow: '0 0 10px var(--c-magenta), 0 0 30px var(--c-magenta)' }}>edin</span>
                </div>
                <div style={{ fontSize: 11, letterSpacing: '0.3em', color: 'var(--c-muted)', fontFamily: "'Share Tech Mono', monospace", marginTop: 4 }}>
                    PLATEFORME OFFICIELLE CY TECH
                </div>
            </Link>

            {/* Card */}
            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: 460,
                background: '#00001a',
                border: '2px ridge var(--c-cyan)',
                boxShadow: '0 0 30px #00ffff22, inset 0 0 20px #000044',
                padding: '28px 32px',
            }}>
                {/* Corner decorations */}
                <span style={{ position: 'absolute', top: 6, left: 8, color: 'var(--c-cyan)', fontSize: 10, opacity: 0.5 }}>◄</span>
                <span style={{ position: 'absolute', top: 6, right: 8, color: 'var(--c-cyan)', fontSize: 10, opacity: 0.5, transform: 'scaleX(-1)', display: 'inline-block' }}>◄</span>
                <span style={{ position: 'absolute', bottom: 6, left: 8, color: 'var(--c-cyan)', fontSize: 10, opacity: 0.5, transform: 'rotate(180deg)', display: 'inline-block' }}>◄</span>
                <span style={{ position: 'absolute', bottom: 6, right: 8, color: 'var(--c-cyan)', fontSize: 10, opacity: 0.5, transform: 'rotate(180deg) scaleX(-1)', display: 'inline-block' }}>◄</span>

                {children}
            </div>

            {/* Footer marquee */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2,
                overflow: 'hidden', whiteSpace: 'nowrap',
                background: '#000', borderTop: '1px solid var(--c-cyan)',
                padding: '2px 0', fontSize: 12, color: 'var(--c-cyan)',
                fontFamily: "'VT323', monospace",
            }}>
                <span style={{ display: 'inline-block', animation: 'marquee-scroll 30s linear infinite' }}>
                    ★ CYEDIN — GESTION DES STAGES CY TECH PAU ★ &nbsp;&nbsp;
                    ● ETUDIANTS ● TUTEURS ● ENTREPRISES ● JURY ● ADMINISTRATEURS ●
                    &nbsp;&nbsp; ★ BEST VIEWED AT 1024x768 IN NETSCAPE NAVIGATOR 4.0 ★ &nbsp;&nbsp;
                    ◄ CYEDIN v2.0 — CYBER EDITION — TOUS DROITS RESERVES ►
                </span>
            </div>
        </div>
    );
}
