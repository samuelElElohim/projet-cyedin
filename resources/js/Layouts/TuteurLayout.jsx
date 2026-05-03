import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const ACCENT = { bg: '#F0FDFA', text: '#0D9488', border: '#99F6E4', stripe: '#CCFBF1' };

const NAV_ITEMS = [
    { label: 'Tableau de bord',   href: 'tuteur.dashboard',       icon: HomeIcon },
    { label: 'Offres de stage',   href: 'tuteur.offres',          icon: SearchIcon },
    { label: 'Affecter un stage', href: 'tuteur.create.stage',    icon: PlusIcon },
    { label: 'Suivre étudiant',   href: 'tuteur.etudiant.follow', icon: UsersIcon },
    { label: 'Suggérer',          href: 'demande.hierarchie',     icon: LightbulbIcon },
];

export default function TuteurLayout({ children, title = 'Espace Tuteur' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', fontFamily: "'Inter', sans-serif" }}>

            <aside className="ds-sidebar" style={{ width: sidebarOpen ? 240 : 64 }}>

                <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border)', gap: 12, flexShrink: 0 }}>
                    {sidebarOpen && (
                        <Link href={route('tuteur.dashboard')} className="ds-logo" style={{ flex: 1, color: ACCENT.text }}>
                            CY<span style={{ color: ACCENT.text }}>edin</span>
                        </Link>
                    )}
                    <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginLeft: sidebarOpen ? 0 : 'auto' }}>
                        <ChevronIcon direction={sidebarOpen ? 'left' : 'right'} />
                    </button>
                </div>

                {sidebarOpen && (
                    <div className="ds-role-stripe" style={{ background: ACCENT.stripe, color: ACCENT.text, borderBottom: `1px solid ${ACCENT.border}` }}>
                        Espace Tuteur
                    </div>
                )}

                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={route(item.href)}
                                className={`ds-nav-item ${isActive ? 'active teal' : ''}`}
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
                    <NotifDropdown />
                </header>

                <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto' }}>{children}</div>
                </main>
            </div>
        </div>
    );
}

function HomeIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function SearchIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function PlusIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function UsersIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function LightbulbIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>; }
function LogoutIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronIcon({ direction = 'left', size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={direction === 'left' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}/></svg>; }
