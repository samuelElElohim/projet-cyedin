import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const ALL_NAV_ITEMS = [
    { label: 'Tableau de bord',  href: 'etudiant.dashboard',      icon: HomeIcon,    always: true },
    { label: 'Offres de stage',  href: 'etudiant.offres',         icon: SearchIcon,  always: true },
    { label: 'Mes candidatures', href: 'etudiant.candidatures',   icon: InboxIcon,   always: true },
    { label: 'Porte-document',   href: 'etudiant.porte.document', icon: FolderIcon,  always: true },
    { label: 'Mon dossier',      href: 'etudiant.dossier',        icon: FileIcon,    needsStage: true },
    { label: 'Mon stage',        href: 'etudiant.mon.stage',      icon: BriefcaseIcon, needsStageActif: true },
    { label: 'Suggérer',         href: 'demande.hierarchie',      icon: LightbulbIcon, always: true },
];

export default function EtudiantLayout({ children, title = 'Espace Étudiant' }) {
    const { auth, etudiant_flags } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const hasStage   = etudiant_flags?.has_stage   ?? false;
    const stageActif = etudiant_flags?.stage_actif ?? false;

    const visibleItems = ALL_NAV_ITEMS.filter(item => {
        if (item.always)          return true;
        if (item.needsStage)      return hasStage;
        if (item.needsStageActif) return stageActif;
        return true;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', fontFamily: "'Inter', sans-serif" }}>

            {/* ── SIDEBAR ── */}
            <aside className="ds-sidebar" style={{ width: sidebarOpen ? 240 : 64 }}>

                {/* Logo */}
                <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border)', gap: 12, flexShrink: 0 }}>
                    {sidebarOpen && (
                        <Link href={route('etudiant.dashboard')} className="ds-logo" style={{ flex: 1 }}>
                            CY<span>edin</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(p => !p)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: sidebarOpen ? 0 : 'auto' }}
                        title={sidebarOpen ? 'Réduire' : 'Agrandir'}
                    >
                        <ChevronIcon direction={sidebarOpen ? 'left' : 'right'} />
                    </button>
                </div>

                {/* Role badge */}
                {sidebarOpen && (
                    <div className="ds-role-stripe" style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', borderBottom: '1px solid #DBEAFE' }}>
                        Espace Étudiant
                    </div>
                )}

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {visibleItems.map(item => {
                        const isActive = route().current(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={route(item.href)}
                                className={`ds-nav-item ${isActive ? 'active' : ''}`}
                                title={!sidebarOpen ? item.label : undefined}
                                style={!sidebarOpen ? { justifyContent: 'center', padding: '9px' } : {}}
                            >
                                <Icon size={16} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span style={{ fontSize: 14 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {sidebarOpen && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-page)', marginBottom: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{user?.prenom} {user?.nom}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                        </div>
                    )}
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="ds-nav-item"
                        style={{ color: 'var(--status-error)', width: '100%', background: 'none', border: 'none', ...(!sidebarOpen ? { justifyContent: 'center', padding: '9px' } : {}) }}
                        title={!sidebarOpen ? 'Déconnexion' : undefined}
                    >
                        <LogoutIcon size={16} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ fontSize: 14 }}>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

                {/* Header */}
                <header className="ds-header">
                    <h1 style={{ flex: 1, fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                        {title}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <NotifDropdown />
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

/* ── INLINE SVG ICONS (Lucide-style) ─────────────────────── */

function HomeIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function SearchIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function InboxIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
}
function FolderIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}
function FileIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
function BriefcaseIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function LightbulbIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>;
}
function LogoutIcon({ size = 16, style }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
}
function ChevronIcon({ direction = 'left', size = 16 }) {
    const d = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6';
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={d === 'M15 18l-6-6 6-6' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}/></svg>;
}
