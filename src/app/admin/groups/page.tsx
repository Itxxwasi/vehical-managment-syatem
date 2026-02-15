'use client';

import { useState, useEffect } from 'react';

const AVAILABLE_PERMISSIONS = [
    { id: 'VEHICLES_MANAGE', label: 'Manage Vehicles (Reg/Track)' },
    { id: 'INSPECTIONS_MANAGE', label: 'Handle Inspections' },
    { id: 'POLICIES_APPROVE', label: 'Approve Insurance Policies' },
    { id: 'CLAIMS_PROCESS', label: 'Process Claims' },
    { id: 'REPORTS_VIEW', label: 'View Analytics Reports' },
    { id: 'ADMIN_ACCESS', label: 'System Admin (Users/Groups)' }
];

export default function GroupManagement() {
    const [groups, setGroups] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', permissions: [] as string[] });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        const res = await fetch('/api/admin/groups');
        const data = await res.json();
        setGroups(data);
    };

    const togglePermission = (permId: string) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setShowForm(false);
            setFormData({ name: '', permissions: [] });
            fetchGroups();
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>User Rights & Groups</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Create New Group'}
                </button>
            </div>

            {showForm && (
                <div className="glass fade-in" style={{ padding: '32px', marginBottom: '40px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Group Name</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.name}
                                placeholder="e.g. Finance Team, Logistics Managers"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '16px' }}>Assign Permissions (Rights)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                {AVAILABLE_PERMISSIONS.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => togglePermission(p.id)}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            border: '1px solid var(--card-border)',
                                            background: formData.permissions.includes(p.id) ? 'var(--primary)22' : 'transparent',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '4px',
                                            border: '2px solid var(--primary)',
                                            background: formData.permissions.includes(p.id) ? 'var(--primary)' : 'transparent'
                                        }} />
                                        <span style={{ fontSize: '0.9rem', color: formData.permissions.includes(p.id) ? 'white' : 'var(--secondary)' }}>
                                            {p.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                            Save Group & Permissions
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {groups.map(g => (
                    <div key={g._id} className="glass" style={{ padding: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>{g.name}</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {g.permissions.map((p: string) => (
                                <span key={p} style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--primary-glow)'
                                }}>
                                    {p.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
