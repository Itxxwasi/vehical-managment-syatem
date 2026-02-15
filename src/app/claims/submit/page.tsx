'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitClaim() {
    const [policies, setPolicies] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        policyId: '',
        incidentDescription: '',
        dateOfIncident: '',
        claimedAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/policies')
            .then(res => res.json())
            .then(data => setPolicies(data.filter((p: any) => p.status === 'APPROVED')));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/claims', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/dashboard');
        }
        setLoading(false);
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Submit Incident Claim</h1>
                <p style={{ color: 'var(--secondary)', marginBottom: '32px' }}>Report an issue and request compensation.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Select Active Policy</label>
                        <select
                            required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.policyId}
                            onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                        >
                            <option value="">Choose a policy...</option>
                            {policies.map(p => (
                                <option key={p._id} value={p._id}>{p.policyNumber} - {p.vehicle.make} {p.vehicle.model}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Incident Date</label>
                        <input
                            type="date" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.dateOfIncident}
                            onChange={(e) => setFormData({ ...formData, dateOfIncident: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Description of Incident</label>
                        <textarea
                            required className="glass"
                            style={{ padding: '12px', width: '100%', height: '100px', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.incidentDescription}
                            onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Claimed Amount ($)</label>
                        <input
                            type="number" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.claimedAmount}
                            onChange={(e) => setFormData({ ...formData, claimedAmount: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Submitting...' : 'File Claim'}
                    </button>
                </form>
            </div>
        </div>
    );
}
