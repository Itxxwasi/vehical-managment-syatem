'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BookInspectionForm() {
    const searchParams = useSearchParams();
    const vehicleIdParam = searchParams.get('vehicleId');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        vehicleId: vehicleIdParam || '',
        date: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/vehicles')
            .then(res => res.json())
            .then(data => setVehicles(data.filter((v: any) => v.currentStatus !== 'HOME')));

        if (vehicleIdParam) {
            setFormData(prev => ({ ...prev, vehicleId: vehicleIdParam }));
        }
    }, [vehicleIdParam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/inspections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => router.push('/inspections'), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                <h1>Book Inspection</h1>
                <p style={{ color: 'var(--secondary)', marginBottom: '32px' }}>Schedule a physical vehicle check.</p>

                {success && <div className="glass" style={{ padding: '16px', color: 'var(--success)', marginBottom: '16px' }}>✅ Inspection Booked!</div>}

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
                        <label style={{ display: 'block', marginBottom: '8px' }}>Date</label>
                        <input
                            type="date" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Location</label>
                        <input
                            type="text" required className="glass"
                            style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                        {loading ? 'Processing...' : 'Schedule Inspection'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function BookInspection() {
    return (
        <Suspense fallback={
            <div className="container fade-in" style={{ paddingTop: '120px' }}>
                <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <BookInspectionForm />
        </Suspense>
    );
}
