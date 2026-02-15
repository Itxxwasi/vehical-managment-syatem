'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreatePolicy() {
    const searchParams = useSearchParams();
    const vehicleIdParam = searchParams.get('vehicleId');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        vehicleId: vehicleIdParam || '',
        coverageDetails: 'Full Transit Coverage (Port to Home)',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => setVehicles(data));

        if (vehicleIdParam) {
            setFormData(prev => ({ ...prev, vehicleId: vehicleIdParam }));
        }
    }, [vehicleIdParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/policies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Request Insurance Policy</h1>
                <p style={{ color: 'var(--secondary)', marginBottom: '32px' }}>Link an insurance contract to a vehicle.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Select Vehicle</label>
                        <select
                            required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.vehicleId}
                            onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                        >
                            <option value="">Choose a vehicle...</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id}>{v.make} {v.model} - {v.chassisNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Coverage Type</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.coverageDetails}
                            onChange={(e) => setFormData({ ...formData, coverageDetails: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Insurance Amount ($)</label>
                        <input
                            type="number" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Submitting...' : 'Send for Approval'}
                    </button>
                </form>
            </div>
        </div>
    );
}
