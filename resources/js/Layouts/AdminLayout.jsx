import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const NAV_ITEMS = [
    { label: "Vue d'ensemble",  href: 'admin.dashboard',     icon: '█' },
    { label: 'Utilisateurs',    href: 'admin.main.user',     icon: '◉' },
    { label: 'Offres',          href: 'admin.index.offre',   icon: '◈' },
    { label: 'Stages',          href: 'admin.index.stage',   icon: '▣' },
    { label: 'Dossiers',        href: 'admin.index.dossier', icon: '▤' },
    { label: 'Import CSV',      href: 'admin.import.user',   icon: '▼' },
    { label: 'Hierarchie',      href: 'admin.hierarchie',    icon: '◆' },
    { label: 'Demandes',        href: 'admin.demandes',      icon: '✉' },
    { label: 'Trace',           href: 'admin.trace',         icon: '▶' },
];

export default function AdminLayout({ children, title = 'Administration' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--c-black)', fontFamily: "'VT323', monospace" }}>

            <aside
                className="scanlines flex flex-col shrink-0 transition-all duration-150"
                style={{ width: sidebarOpen ? 220 : 52, background: '#000008', borderRight: '2px solid var(--c-magenta)', boxShadow: 'inset -5px 0 15px #330033, 4px 0 15px #330033' }}
            >
                <div style={{ borderBottom: '2px solid #330033', padding: '10px 12px', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {sidebarOpen && (
                        <Link href={route('admin.dashboard')} className="cyber-logo" style={{ fontSize: 22 }}>
                            CY<span style={{ color: 'var(--c-magenta)', textShadow: '0 0 10px var(--c-magenta)' }}>edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        style={{ background: 'none', border: '1px solid #330033', color: 'var(--c-magenta)', padding: '2px 6px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, marginLeft: sidebarOpen ? 0 : 'auto' }}
                    >
                        {sidebarOpen ? '◄' : '►'}
                    </button>
                </div>

                {sidebarOpen && (
                    <div style={{ padding: '4px 12px', background: '#0e0018', borderBottom: '1px solid #330033', fontSize: 11, color: 'var(--c-magenta)', letterSpacing: '0.2em', fontFamily: "'Share Tech Mono', monospace" }}>
                        ■ ADMIN ROOT ■
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
                                        ? { background: 'var(--c-magenta)', color: '#000', borderLeftColor: 'var(--c-magenta)', boxShadow: '0 0 10px var(--c-magenta)' }
                                        : { borderLeftColor: 'transparent', color: '#9966cc' }),
                                    ...(!sidebarOpen ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 } : {}),
                                }}
                            >
                                <span style={{ fontSize: 16, minWidth: 16, textAlign: 'center' }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ margin: '0 12px', borderTop: '1px dashed #330033' }} />

                <div style={{ padding: '10px 12px' }}>
                    {sidebarOpen && (
                        <div style={{ fontSize: 13, color: '#664488', marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>
                            <div style={{ color: '#cc88ff' }}>{auth?.user?.nom}</div>
                            <div style={{ fontSize: 11 }}>{auth?.user?.email}</div>
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

                <header style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, gap: 16, background: 'var(--c-navy)', borderBottom: '2px solid var(--c-magenta)', boxShadow: '0 0 15px #ff00ff33' }}>
                    <span style={{ color: 'var(--c-magenta)', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>■</span>
                    <h1 style={{ flex: 1, color: 'var(--c-magenta)', fontFamily: "'VT323', monospace", fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 0 8px var(--c-magenta)', margin: 0 }}>
                        {title}
                    </h1>
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#cc44ff' }}>ROOT ACCESS</span>
                    <div style={{ marginLeft: 'auto' }}><NotifDropdown /></div>
                </header>

                <div className="cyber-marquee" style={{ borderColor: 'var(--c-magenta)', color: 'var(--c-magenta)' }}>
                    <span className="cyber-marquee-inner">
                        ★ PANNEAU ADMINISTRATEUR — ACCES RESTREINT ★ &nbsp;&nbsp;&nbsp;
                        ● GESTION COMPLETE DU SYSTEME ● UTILISATEURS ● OFFRES ● STAGES ● DOSSIERS ●
                        &nbsp;&nbsp;&nbsp; ★ CYEDIN v2.0 — ADMIN MODULE — AUTHORISATION NIVEAU 5 ★
                    </span>
                </div>

                <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    <div style={{ maxWidth: 1400, margin: '0 auto', color: 'var(--c-text)' }}>
                        {children}
                    </div>
                </main>

                <div className="cyber-statusbar">
                    <span className="blink" style={{ color: 'var(--c-magenta)' }}>█</span>
                    <span>CYEDIN v2.0</span>
                    <span style={{ color: 'var(--c-red)', fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>⚠ ROOT</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>SYS:OK</span>
                    <span style={{ color: 'var(--c-magenta)', fontSize: 11 }}>■ ADMIN ■</span>
                </div>
            </div>
        </div>
    );
}
