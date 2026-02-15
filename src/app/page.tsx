import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="container fade-in" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                textAlign: 'center'
            }}>
                <h1 style={{ lineHeight: '1.1', fontWeight: '900', marginBottom: '24px' }}>
                    Car Import Insurance <span style={{ color: 'var(--primary-glow)' }}>Management</span> System
                </h1>
                <p style={{ color: 'var(--secondary)', fontSize: '1.1rem', maxWidth: '90%', marginBottom: '40px' }}>
                    The complete ecosystem for vehicle registration, transit tracking, and insurance management.
                </p>
                <Link href="/login" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', textDecoration: 'none' }}>
                    Get Started & Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Welcome, {session.user?.name}</h1>
                <p style={{ color: 'var(--secondary)' }}>Select a module to manage your vehicle operations.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="glass" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '20px', fontSize: '2rem' }}>🚗</div>
                    <h3 style={{ marginBottom: '12px' }}>Vehicle Logistics (2.0)</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                        Register new imports and track status from Port to Home (D2, D3).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/vehicles/register" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                            New Registration
                        </Link>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href="/vehicles" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}>
                                Inventory
                            </Link>
                            <Link href="/drivers" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}>
                                Drivers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Module 5: User Management (1.0) */}
                {session.user?.role === 'ADMIN' && (
                    <div className="glass" style={{ padding: '32px' }}>
                        <div style={{ marginBottom: '20px', fontSize: '2rem' }}>👤</div>
                        <h3 style={{ marginBottom: '12px' }}>User Rights (1.0)</h3>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                            Control system access, roles, and group permissions (D1).
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/admin/users" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                                Manage Users
                            </Link>
                            <Link href="/admin/groups" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center' }}>
                                Groups & Rights
                            </Link>
                        </div>
                    </div>
                )}

                {/* Module 2: Inspections */}
                <div className="glass" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '20px', fontSize: '2rem' }}>🛠️</div>
                    <h3 style={{ marginBottom: '12px' }}>Inspections</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                        Schedule audits and record vehicle condition results.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/inspections/book" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                            Book Inspection
                        </Link>
                        <Link href="/inspections" className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center' }}>
                            Inspection Queue
                        </Link>
                    </div>
                </div>

                <div className="glass" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '20px', fontSize: '2rem' }}>🛡️</div>
                    <h3 style={{ marginBottom: '12px' }}>Policies & Claims</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                        Manage coverage, process approvals, and file claims.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href="/policies/create" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}>
                                New Request
                            </Link>
                            <Link href="/policies" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}>
                                Manage
                            </Link>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href="/claims/submit" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem', background: 'var(--accent)' }}>
                                File Claim
                            </Link>
                            <Link href="/claims" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', textDecoration: 'none', justifyContent: 'center', fontSize: '0.8rem' }}>
                                Queue
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Module 4: Reports */}
                <div className="glass" style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '20px', fontSize: '2rem' }}>📊</div>
                    <h3 style={{ marginBottom: '12px' }}>System Reports</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '24px', minHeight: '40px' }}>
                        Detailed analytics on volume, status, and financials (D7).
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/reports" className="btn btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>
                            View All Reports
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
