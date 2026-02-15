'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterVehicle() {
    const [formData, setFormData] = useState({
        ownerName: '',
        make: '',
        model: '',
        chassisNumber: '',
        engineNumber: '',
        color: '',
        engineCapacity: '',
        ownerDetails: '',
        insuranceDetails: 'Standard Transit Policy',
        importRoute: 'Port -> Border -> Home'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccess(true);
            setTimeout(() => router.push('/'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="glass" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '8px' }}>Register New Vehicle</h1>
                <p style={{ color: 'var(--secondary)', marginBottom: '32px' }}>
                    Follow Flowchart 1: Input all required details to finalize registration.
                </p>

                {error && <div className="glass" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', marginBottom: '24px', borderRadius: '8px' }}>
                    ⚠️ Registration Failed: {error}
                </div>}

                {success && <div className="glass" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', marginBottom: '24px', borderRadius: '8px' }}>
                    ✅ Vehicle Registered Successfully! Redirecting...
                </div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Owner Name *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Vehicle Make *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Vehicle Model *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Chassis Number *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.chassisNumber}
                            onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Engine Number *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.engineNumber}
                            onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Color</label>
                        <input
                            type="text" className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Engine Capacity</label>
                        <input
                            type="text" className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.engineCapacity}
                            onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Initial Insurance Details *</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.insuranceDetails}
                            onChange={(e) => setFormData({ ...formData, insuranceDetails: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / span 2' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--secondary)' }}>Full Owner Details (Contact/Address) *</label>
                        <textarea
                            required className="glass"
                            style={{ padding: '12px', width: '100%', height: '80px', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.ownerDetails}
                            onChange={(e) => setFormData({ ...formData, ownerDetails: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / span 2', marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={() => router.back()} className="btn" style={{ background: 'transparent', border: '1px solid var(--card-border)' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Registering...' : 'Finalize Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
