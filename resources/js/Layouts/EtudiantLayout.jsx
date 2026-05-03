import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const ALL_NAV_ITEMS = [
    { label: 'Dashboard',       href: 'etudiant.dashboard',      icon: '█', always: true },
    { label: 'Offres',          href: 'etudiant.offres',         icon: '◈', always: true },
    { label: 'Candidatures',    href: 'etudiant.candidatures',   icon: '✉', always: true },
    { label: 'Documents',       href: 'etudiant.porte.document', icon: '▤', always: true },
    { label: 'Dossier',         href: 'etudiant.dossier',        icon: '▣', needsStage: true },
    { label: 'Mon Stage',       href: 'etudiant.mon.stage',      icon: '◉', needsStageActif: true },
    { label: 'Suggerer',        href: 'demande.hierarchie',      icon: '◆', always: true },
];

const ROLE_COLORS = {
    sidebar: '#0000cc',
    accent:  '#00ffff',
    label:   'ETUDIANT',
};

export default function EtudiantLayout({ children, title = 'Espace Etudiant' }) {
    const { auth, etudiant_flags } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const hasStage   = etudiant_flags?.has_stage   ?? false;
    const stageActif = etudiant_flags?.stage_actif ?? false;

    const visibleNavItems = ALL_NAV_ITEMS.filter(item => {
        if (item.always)          return true;
        if (item.needsStage)      return hasStage;
        if (item.needsStageActif) return stageActif;
        return true;
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div className="min-h-screen flex" style={{ background: 'var(--c-black)', fontFamily: "'VT323', monospace" }}>

            {/* SIDEBAR */}
            <aside
                className="cyber-sidebar scanlines flex flex-col shrink-0 transition-all duration-150"
                style={{ width: sidebarOpen ? 220 : 52 }}
            >
                {/* Logo */}
                <div style={{ borderBottom: '2px solid var(--c-dim)', padding: '10px 12px', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {sidebarOpen && (
                        <Link href={route('etudiant.dashboard')} className="cyber-logo" style={{ fontSize: 22 }}>
                            CY<span>edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        style={{ background: 'none', border: '1px solid var(--c-dim)', color: 'var(--c-cyan)', padding: '2px 6px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 14, marginLeft: sidebarOpen ? 0 : 'auto' }}
                    >
                        {sidebarOpen ? '◄' : '►'}
                    </button>
                </div>

                {/* Role badge */}
                {sidebarOpen && (
                    <div style={{ padding: '4px 12px', background: '#00001a', borderBottom: '1px solid var(--c-dim)', fontSize: 11, color: 'var(--c-cyan)', letterSpacing: '0.2em', fontFamily: "'Share Tech Mono', monospace" }}>
                        ■ {ROLE_COLORS.label} ■
                    </div>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
                    {visibleNavItems.map(item => {
                        const isActive = route().current(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                                style={!sidebarOpen ? { justifyContent: 'center', paddingLeft: 0, paddingRight: 0 } : {}}
                            >
                                <span style={{ fontSize: 16, minWidth: 16, textAlign: 'center' }}>{item.icon}</span>
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Separator */}
                <div style={{ margin: '0 12px', borderTop: '1px dashed var(--c-dim)' }} />

                {/* User */}
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

            {/* MAIN */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

                {/* Header */}
                <header className="cyber-header" style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 52, gap: 16 }}>
                    <span style={{ color: 'var(--c-cyan)', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>■</span>
                    <h1 style={{ flex: 1, color: 'var(--c-cyan)', fontFamily: "'VT323', monospace", fontSize: 22, letterSpacing: '0.1em', textTransform: 'uppercase', textShadow: '0 0 8px var(--c-cyan)', margin: 0 }}>
                        {title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <NotifDropdown />
                    </div>
                </header>

                {/* Marquee */}
                <div className="cyber-marquee">
                    <span className="cyber-marquee-inner">
                        ★ BIENVENUE SUR CYEDIN — PLATEFORME DE GESTION DES STAGES CY TECH ★ &nbsp;&nbsp;&nbsp;
                        ● ESPACE ETUDIANT ● CONSULTER LES OFFRES ● SUIVRE VOS CANDIDATURES ●
                        &nbsp;&nbsp;&nbsp; ★ VERSION 2.0 — CYBER EDITION ★ &nbsp;&nbsp;&nbsp;
                        ◄ UTILISEZ FIREFOX 3.0 OU NETSCAPE NAVIGATOR POUR UNE MEILLEURE EXPERIENCE ►
                    </span>
                </div>

                {/* Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', color: 'var(--c-text)' }}>
                        {children}
                    </div>
                </main>

                {/* Status bar */}
                <div className="cyber-statusbar">
                    <span className="blink">█</span>
                    <span>CYEDIN v2.0</span>
                    <span style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>SYS:OK</span>
                    <span style={{ color: 'var(--c-cyan)', fontSize: 11 }}>■ ETUDIANT ■</span>
                </div>
            </div>
        </div>
    );
}
