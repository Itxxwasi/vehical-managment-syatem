'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PolicyManager() {
    const [policies, setPolicies] = useState<any[]>([]);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = () => {
        fetch('/api/policies')
            .then(res => res.json())
            .then(data => setPolicies(data));
    };

    const handleApproval = async (id: string, status: string) => {
        const res = await fetch('/api/policies', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status }),
        });

        if (res.ok) fetchPolicies();
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Policy Management (4.0)</h1>
                <Link href="/policies/create" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    + Request New Policy
                </Link>
            </div>

            <div style={{ marginTop: '20px' }}>
                {policies.length === 0 && <p style={{ color: 'var(--secondary)' }}>No policies found.</p>}
                {policies.map(p => (
                    <div key={p._id} className="glass" style={{ padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                                <h3 style={{ margin: 0 }}>{p.policyNumber}</h3>
                                <span style={{
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    background: p.status === 'APPROVED' ? 'var(--success)22' : 'var(--accent)22',
                                    color: p.status === 'APPROVED' ? 'var(--success)' : 'var(--accent)'
                                }}>
                                    {p.status}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                Vehicle: {p.vehicle.make} {p.vehicle.model} ({p.vehicle.chassisNumber})
                            </p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', marginTop: '4px' }}>
                                Amount: ${p.amount.toLocaleString()}
                            </p>
                        </div>

                        {p.status === 'PENDING_APPROVAL' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => handleApproval(p._id, 'APPROVED')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Approve</button>
                                <button onClick={() => handleApproval(p._id, 'REJECTED')} className="btn" style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--error)' }}>Reject</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
