'use client';

import { useState, useEffect } from 'react';

export default function DriverManagement() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', licenseNumber: '', contact: '' });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        const res = await fetch('/api/drivers');
        const data = await res.json();
        setDrivers(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/drivers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setShowForm(false);
            setFormData({ name: '', licenseNumber: '', contact: '' });
            fetchDrivers();
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Driver & Logistics Management (2.0)</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Add New Driver'}
                </button>
            </div>

            {showForm && (
                <div className="glass fade-in" style={{ padding: '32px', marginBottom: '40px', maxWidth: '500px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Driver Name</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>License Number</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Contact Number</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Driver Details</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {drivers.length === 0 && <p style={{ color: 'var(--secondary)' }}>No drivers in Data Store D2.</p>}
                {drivers.map(d => (
                    <div key={d._id} className="glass" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '12px' }}>{d.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>License: {d.licenseNumber}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginTop: '4px' }}>Contact: {d.contact}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
