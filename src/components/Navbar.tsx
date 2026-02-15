'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '1200px',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'white', fontWeight: '800', fontSize: '1rem' }}>
                CAR IMPORT INSURANCE <span style={{ color: 'var(--primary-glow)' }}>MANAGEMENT</span>
            </Link>

            <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', overflowX: 'auto' }}>
                {session ? (
                    <>
                        <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Dashboard</Link>
                        <Link href="/vehicles" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Inventory</Link>
                        {session.user?.role === 'ADMIN' && (
                            <>
                                <Link href="/admin/users" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Users</Link>
                                <Link href="/admin/groups" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Rights</Link>
                            </>
                        )}
                        <Link href="/drivers" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Drivers</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--card-border)', paddingLeft: '20px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', whiteSpace: 'nowrap' }}>{session.user?.name}</span>
                            <button
                                onClick={() => signOut()}
                                className="btn"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: '0.85rem' }}>Login</Link>
                )}
            </div>
        </nav>
    );
}
