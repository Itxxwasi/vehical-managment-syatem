'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VehicleInventory() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        setVehicles(data);
        setLoading(false);
    };

    const updateStatus = async (id: string, currentStatus: string) => {
        let nextStatus = 'PORT';
        if (currentStatus === 'PORT') nextStatus = 'BORDER';
        else if (currentStatus === 'BORDER') nextStatus = 'HOME';
        else return;

        const res = await fetch('/api/vehicles/status', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: nextStatus }),
        });

        if (res.ok) fetchVehicles();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PORT': return 'var(--accent)';
            case 'BORDER': return 'var(--primary-glow)';
            case 'HOME': return 'var(--success)';
            default: return 'var(--secondary)';
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Vehicle Inventory</h1>
                <Link href="/vehicles/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    + Register New
                </Link>
            </div>

            {loading ? (
                <p>Loading vehicles...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {vehicles.length === 0 && <p style={{ color: 'var(--secondary)' }}>No vehicles registered yet.</p>}
                    {vehicles.map((v) => (
                        <div key={v._id} className="glass" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0 }}>{v.make} {v.model}</h3>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    background: `${getStatusColor(v.currentStatus)}22`,
                                    color: getStatusColor(v.currentStatus),
                                    border: `1px solid ${getStatusColor(v.currentStatus)}44`
                                }}>
                                    {v.currentStatus}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <span>Chassis: {v.chassisNumber}</span>
                                <span>Engine: {v.engineNumber}</span>
                                <span style={{ gridColumn: '1 / span 2' }}>Owner: {v.ownerName}</span>
                                {v.insuranceDetails && <span style={{ gridColumn: '1 / span 2' }}>Insurance: {v.insuranceDetails}</span>}
                            </div>

                            <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '32px' }}>
                                <div style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: v.currentStatus === 'PORT' ? '0%' : v.currentStatus === 'BORDER' ? '50%' : '100%',
                                    background: 'var(--primary)',
                                    transition: 'width 0.5s ease'
                                }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.7rem' }}>
                                    <span>PORT</span>
                                    <span>BORDER</span>
                                    <span>HOME</span>
                                </div>
                            </div>

                            {v.currentStatus !== 'HOME' && (
                                <button
                                    onClick={() => updateStatus(v._id, v.currentStatus)}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '12px' }}
                                >
                                    Move to {v.currentStatus === 'PORT' ? 'Border' : 'Home'}
                                </button>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link
                                    href={`/inspections/book?vehicleId=${v._id}`}
                                    className="btn"
                                    style={{ flex: 1, border: '1px solid var(--card-border)', background: 'rgba(59, 130, 246, 0.1)', color: 'white', textDecoration: 'none', fontSize: '0.8rem', textAlign: 'center' }}
                                >
                                    Inspect
                                </Link>
                                <Link
                                    href={`/policies/create?vehicleId=${v._id}`}
                                    className="btn"
                                    style={{ flex: 1, border: '1px solid var(--card-border)', background: 'rgba(16, 185, 129, 0.1)', color: 'white', textDecoration: 'none', fontSize: '0.8rem', textAlign: 'center' }}
                                >
                                    Insure
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
