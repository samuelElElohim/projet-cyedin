import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const NAV_ITEMS = [
    { label: 'Dashboard', href: 'jury.dashboard',      icon: '█' },
    { label: 'Dossiers',  href: 'jury.index.dossiers', icon: '▤' },
    { label: 'Stages',    href: 'jury.index.stages',   icon: '◉' },
];

export default function JuryLayout({ children, title = 'Espace Jury' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--c-black)', fontFamily: "'VT323', monospace" }}>

            <aside
                className="cyber-sidebar scanlines flex flex-col shrink-0 transition-all duration-150"
                style={{ width: sidebarOpen ? 220 : 52, borderRightColor: '#440066' }}
            >
                <div style={{ borderBottom: '2px solid #440066', padding: '10px 12px', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {sidebarOpen && (
                        <Link href={route('jury.dashboard')} className="cyber-logo" style={{ fontSize: 22 }}>
                            CY<span style={{ color: '#cc66ff', textShadow: '0 0 10px #cc66ff' }}>edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        style={{ background: 'none', border: '1px solid #440066', color: '#cc66ff', padding: '2px 6px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, marginLeft: sidebarOpen ? 0 : 'auto' }}
                    >
                        {sidebarOpen ? '◄' : '►'}
                    </button>
                </div>

                {sidebarOpen && (
                    <div style={{ padding: '4px 12px', background: '#0e0018', borderBottom: '1px solid #440066', fontSize: 11, color: '#cc66ff', letterSpacing: '0.2em', fontFamily: "'Share Tech Mono', monospace" }}>
                        ■ JURY ■
                    </div>
                )}

                <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className="nav-item"
                                style={{
                                    ...(isActive
                                        ? { background: '#cc66ff', color: '#000', borderLeftColor: '#cc66ff', boxShadow: '0 0 10px #cc66ff' }
                                        : { borderLeftColor: 'transparent', color: '#884499' }),
                                    ...(!sidebarOpen ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 } : {}),
                                }}
                            >
                                <span style={{ fontSize: 16, minWidth: 16, textAlign: 'center' }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ margin: '0 12px', borderTop: '1px dashed #440066' }} />

                <div style={{ padding: '10px 12px' }}>
                    {sidebarOpen && (
                        <div style={{ fontSize: 13, color: '#664488', marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>
                            <div style={{ color: '#cc88ff' }}>{user?.prenom} {user?.nom}</div>
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

                <header style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, gap: 16, background: 'var(--c-navy)', borderBottom: '2px solid #cc66ff', boxShadow: '0 0 15px #cc66ff33' }}>
                    <span style={{ color: '#cc66ff', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>■</span>
                    <h1 style={{ flex: 1, color: '#cc66ff', fontFamily: "'VT323', monospace", fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 0 8px #cc66ff', margin: 0 }}>
                        {title}
                    </h1>
                    <div style={{ marginLeft: 'auto' }}><NotifDropdown /></div>
                </header>

                <div className="cyber-marquee" style={{ borderColor: '#cc66ff', color: '#cc66ff' }}>
                    <span className="cyber-marquee-inner">
                        ★ ESPACE JURY — EVALUATION DES STAGES ★ &nbsp;&nbsp;&nbsp;
                        ● CONSULTATION DES DOSSIERS ● VALIDATION ● NOTATION ●
                        &nbsp;&nbsp;&nbsp; ★ CYEDIN v2.0 — MODULE JURY ★
                    </span>
                </div>

                <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', color: 'var(--c-text)' }}>
                        {children}
                    </div>
                </main>

                <div className="cyber-statusbar">
                    <span className="blink" style={{ color: '#cc66ff' }}>█</span>
                    <span>CYEDIN v2.0</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>SYS:OK</span>
                    <span style={{ color: '#cc66ff', fontSize: 11 }}>■ JURY ■</span>
                </div>
            </div>
        </div>
    );
}
