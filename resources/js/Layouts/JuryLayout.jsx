import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const ACCENT = { bg: '#FAF5FF', text: '#7C3AED', border: '#DDD6FE', stripe: '#EDE9FE' };

const NAV_ITEMS = [
    { label: 'Tableau de bord', href: 'jury.dashboard',      icon: HomeIcon },
    { label: 'Dossiers',        href: 'jury.index.dossiers', icon: FolderIcon },
    { label: 'Stages',          href: 'jury.index.stages',   icon: BriefcaseIcon },
];

export default function JuryLayout({ children, title = 'Espace Jury' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', fontFamily: "'Inter', sans-serif" }}>

            <aside className="ds-sidebar" style={{ width: sidebarOpen ? 240 : 64 }}>

                <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border)', gap: 12, flexShrink: 0 }}>
                    {sidebarOpen && (
                        <Link href={route('jury.dashboard')} className="ds-logo" style={{ flex: 1, color: ACCENT.text }}>
                            CY<span style={{ color: ACCENT.text }}>edin</span>
                        </Link>
                    )}
                    <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: sidebarOpen ? 0 : 'auto' }}>
                        <ChevronIcon direction={sidebarOpen ? 'left' : 'right'} />
                    </button>
                </div>

                {sidebarOpen && (
                    <div className="ds-role-stripe" style={{ background: ACCENT.stripe, color: ACCENT.text, borderBottom: `1px solid ${ACCENT.border}` }}>
                        Espace Jury
                    </div>
                )}

                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={route(item.href)}
                                className={`ds-nav-item ${isActive ? 'active violet' : ''}`}
                                title={!sidebarOpen ? item.label : undefined}
                                style={!sidebarOpen ? { justifyContent: 'center', padding: '9px' } : {}}
                            >
                                <Icon size={16} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span style={{ fontSize: 14 }}>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {sidebarOpen && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-page)', marginBottom: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{user?.prenom} {user?.nom}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                        </div>
                    )}
                    <button onClick={() => router.post(route('logout'))} className="ds-nav-item"
                        style={{ color: 'var(--status-error)', width: '100%', background: 'none', border: 'none', ...(!sidebarOpen ? { justifyContent: 'center', padding: '9px' } : {}) }}
                        title={!sidebarOpen ? 'Déconnexion' : undefined}
                    >
                        <LogoutIcon size={16} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span style={{ fontSize: 14 }}>Déconnexion</span>}
                    </button>
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <header className="ds-header">
                    <h1 style={{ flex: 1, fontFamily: "'Sora', sans-serif", fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                        {title}
                    </h1>
                    <div style={{ marginLeft: 'auto' }}><NotifDropdown /></div>
                </header>

                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
                </main>
            </div>
        </div>
    );
}

function HomeIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function FolderIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function BriefcaseIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function LogoutIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronIcon({ direction = 'left', size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={direction === 'left' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}/></svg>; }
