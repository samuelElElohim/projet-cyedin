import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const NAV_ITEMS = [
    { label: 'Dashboard',       href: 'tuteur.dashboard',       icon: '█' },
    { label: 'Offres',          href: 'tuteur.offres',          icon: '◈' },
    { label: 'Affecter Stage',  href: 'tuteur.create.stage',    icon: '▲' },
    { label: 'Suivi Etudiant',  href: 'tuteur.etudiant.follow', icon: '◎' },
    { label: 'Suggerer',        href: 'demande.hierarchie',     icon: '◆' },
];

export default function TuteurLayout({ children, title = 'Espace Tuteur' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--c-black)', fontFamily: "'VT323', monospace" }}>

            {/* SIDEBAR */}
            <aside
                className="cyber-sidebar scanlines flex flex-col shrink-0 transition-all duration-150"
                style={{ width: sidebarOpen ? 220 : 52 }}
            >
                <div style={{ borderBottom: '2px solid var(--c-dim)', padding: '10px 12px', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {sidebarOpen && (
                        <Link href={route('tuteur.dashboard')} className="cyber-logo" style={{ fontSize: 22 }}>
                            CY<span style={{ color: 'var(--c-green)', textShadow: '0 0 10px var(--c-green)' }}>edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        style={{ background: 'none', border: '1px solid var(--c-dim)', color: 'var(--c-green)', padding: '2px 6px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, marginLeft: sidebarOpen ? 0 : 'auto' }}
                    >
                        {sidebarOpen ? '◄' : '►'}
                    </button>
                </div>

                {sidebarOpen && (
                    <div style={{ padding: '4px 12px', background: '#001a0a', borderBottom: '1px solid var(--c-dim)', fontSize: 11, color: 'var(--c-green)', letterSpacing: '0.2em', fontFamily: "'Share Tech Mono', monospace" }}>
                        ■ TUTEUR ■
                    </div>
                )}

                <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                style={{
                                    ...(isActive ? { background: 'var(--c-green)', color: '#000', borderLeftColor: 'var(--c-green)', boxShadow: '0 0 10px var(--c-green)' } : { borderLeftColor: 'transparent' }),
                                    ...(!sidebarOpen ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 } : {}),
                                }}
                            >
                                <span style={{ fontSize: 16, minWidth: 16, textAlign: 'center' }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ margin: '0 12px', borderTop: '1px dashed var(--c-dim)' }} />

                <div style={{ padding: '10px 12px' }}>
                    {sidebarOpen && (
                        <div style={{ fontSize: 13, color: 'var(--c-muted)', marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>
                            <div style={{ color: 'var(--c-text)' }}>{user?.prenom} {user?.nom}</div>
                            <div style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                        </div>
                    )}
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="nav-item"
                        style={{ width: '100%', border: '1px solid #330011', color: 'var(--c-red)', background: 'none', fontSize: 14, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
                    >
                        <span>⏻</span>
                        {sidebarOpen && <span>DECONNEXION</span>}
                    </button>
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

                <header className="cyber-header" style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, gap: 16, borderBottomColor: 'var(--c-green)', boxShadow: '0 0 15px #00ff6633' }}>
                    <span style={{ color: 'var(--c-green)', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>■</span>
                    <h1 style={{ flex: 1, color: 'var(--c-green)', fontFamily: "'VT323', monospace", fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 0 8px var(--c-green)', margin: 0 }}>
                        {title}
                    </h1>
                    <NotifDropdown />
                </header>

                <div className="cyber-marquee" style={{ borderColor: 'var(--c-green)', color: 'var(--c-green)' }}>
                    <span className="cyber-marquee-inner">
                        ★ ESPACE TUTEUR — SUIVI DES STAGES EN TEMPS REEL ★ &nbsp;&nbsp;&nbsp;
                        ● SUPERVISER ● SIGNER LES CONVENTIONS ● VALIDER LES CAHIERS DE STAGE ●
                        &nbsp;&nbsp;&nbsp; ★ CYEDIN v2.0 — TUTEUR MODULE ★
                    </span>
                </div>

                <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', color: 'var(--c-text)' }}>
                        {children}
                    </div>
                </main>

                <div className="cyber-statusbar">
                    <span className="blink" style={{ color: 'var(--c-green)' }}>█</span>
                    <span>CYEDIN v2.0</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>SYS:OK</span>
                    <span style={{ color: 'var(--c-green)', fontSize: 11 }}>■ TUTEUR ■</span>
                </div>
            </div>
        </div>
    );
}
