import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import NotifDropdown from '@/Components/Shared/NotifDropdown';

const NAV_ITEMS = [
    { label: "Vue d'ensemble",   href: 'admin.dashboard',     icon: HomeIcon },
    { label: 'Utilisateurs',     href: 'admin.main.user',     icon: UsersIcon },
    { label: 'Offres de stage',  href: 'admin.index.offre',   icon: ListIcon },
    { label: 'Stages',           href: 'admin.index.stage',   icon: BriefcaseIcon },
    { label: 'Dossiers',         href: 'admin.index.dossier', icon: FolderIcon },
    { label: 'Import CSV/Excel', href: 'admin.import.user',   icon: UploadIcon },
    { label: 'Hiérarchie',       href: 'admin.hierarchie',    icon: GridIcon },
    { label: 'Demandes',         href: 'admin.demandes',      icon: InboxIcon },
    { label: 'Fichier trace',    href: 'admin.trace',         icon: FileTextIcon },
];

export default function AdminLayout({ children, title = 'Administration' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)', fontFamily: "'Inter', sans-serif" }}>

            {/* Admin sidebar — deep navy */}
            <aside style={{
                width: sidebarOpen ? 240 : 64,
                background: 'var(--brand-navy)',
                display: 'flex', flexDirection: 'column', flexShrink: 0,
                transition: 'width 0.2s ease',
                boxShadow: '2px 0 8px rgba(0,0,0,.12)',
            }}>

                <div style={{ height: 60, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,.08)', gap: 12, flexShrink: 0 }}>
                    {sidebarOpen && (
                        <Link href={route('admin.dashboard')} style={{ flex: 1, fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', textDecoration: 'none' }}>
                            CY<span style={{ color: '#60A5FA' }}>edin</span>
                        </Link>
                    )}
                    <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', marginLeft: sidebarOpen ? 0 : 'auto' }}>
                        <ChevronIcon direction={sidebarOpen ? 'left' : 'right'} color="rgba(255,255,255,.5)" />
                    </button>
                </div>

                {sidebarOpen && (
                    <div style={{ padding: '4px 16px', background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.06)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', fontFamily: "'JetBrains Mono', monospace" }}>
                        Administration
                    </div>
                )}

                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = route().current(item.href);
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={route(item.href)}
                                title={!sidebarOpen ? item.label : undefined}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: sidebarOpen ? '9px 12px' : '9px',
                                    borderRadius: 8, fontSize: 14, fontWeight: 500,
                                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                                    textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden',
                                    transition: 'background 0.15s, color 0.15s',
                                    ...(isActive
                                        ? { background: 'rgba(255,255,255,.12)', color: '#fff' }
                                        : { color: 'rgba(255,255,255,.5)' }),
                                }}
                                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(255,255,255,.8)'; }}}
                                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.5)'; }}}
                            >
                                <Icon size={16} style={{ flexShrink: 0 }} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {sidebarOpen && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,.05)', marginBottom: 4 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.85)', lineHeight: 1.3 }}>{auth?.user?.nom}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auth?.user?.email}</div>
                        </div>
                    )}
                    <button onClick={() => router.post(route('logout'))}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '9px 12px' : '9px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#F87171', background: 'none', border: 'none', cursor: 'pointer', width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center', transition: 'background 0.15s' }}
                        title={!sidebarOpen ? 'Déconnexion' : undefined}
                    >
                        <LogoutIcon size={16} style={{ flexShrink: 0 }} />
                        {sidebarOpen && <span>Déconnexion</span>}
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
                    <div style={{ maxWidth: 1400, margin: '0 auto' }}>{children}</div>
                </main>
            </div>
        </div>
    );
}

function HomeIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function UsersIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function ListIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function BriefcaseIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>; }
function FolderIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function UploadIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>; }
function GridIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function InboxIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>; }
function FileTextIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function LogoutIcon({ size = 16, style }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronIcon({ direction = 'left', size = 16, color }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={direction === 'left' ? '15,18 9,12 15,6' : '9,18 15,12 9,6'}/></svg>; }
