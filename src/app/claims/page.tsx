'use client';

import { useState, useEffect } from 'react';

export default function ClaimsManager() {
    const [claims, setClaims] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [approvedAmount, setApprovedAmount] = useState('');

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = () => {
        fetch('/api/claims')
            .then(res => res.json())
            .then(data => setClaims(data));
    };

    const processClaim = async (status: string) => {
        const res = await fetch('/api/claims', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selected._id, status, approvedAmount }),
        });

        if (res.ok) {
            setSelected(null);
            fetchClaims();
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <h1>Claims Management</h1>

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '32px', marginTop: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {claims.length === 0 && <p style={{ color: 'var(--secondary)' }}>No claims found.</p>}
                    {claims.map(c => (
                        <div key={c._id} className="glass" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => setSelected(c)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <strong>{c.vehicle.make} {c.vehicle.model}</strong>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: c.status === 'APPROVED' ? 'var(--success)22' : 'var(--accent)22',
                                    color: c.status === 'APPROVED' ? 'var(--success)' : 'var(--accent)'
                                }}>
                                    {c.status}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{c.incidentDescription.substring(0, 100)}...</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                <span style={{ fontSize: '0.8rem' }}>Claimed: ${c.claimedAmount.toLocaleString()}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(c.dateOfIncident).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2>Process Claim</h2>
                        <div style={{ margin: '24px 0', borderBottom: '1px solid var(--card-border)', paddingBottom: '16px' }}>
                            <p><strong>Vehicle:</strong> {selected.vehicle.make} {selected.vehicle.model}</p>
                            <p><strong>Policy:</strong> {selected.policy.policyNumber}</p>
                            <p style={{ marginTop: '12px' }}><strong>Details:</strong> {selected.incidentDescription}</p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Approved Compensation ($)</label>
                            <input
                                type="number" className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={approvedAmount}
                                onChange={(e) => setApprovedAmount(e.target.value)}
                                placeholder={selected.claimedAmount.toString()}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => processClaim('APPROVED')} className="btn btn-primary" style={{ flex: 1 }}>Approve Claim</button>
                            <button onClick={() => processClaim('REJECTED')} className="btn" style={{ flex: 1, color: 'var(--error)' }}>Reject Claim</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
