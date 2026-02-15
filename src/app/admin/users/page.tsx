'use client';

import { useState, useEffect } from 'react';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', name: '', role: 'STAFF', groupId: '' });

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    };

    const fetchGroups = async () => {
        const res = await fetch('/api/admin/groups');
        const data = await res.json();
        setGroups(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            setShowForm(false);
            setFormData({ username: '', password: '', name: '', role: 'STAFF', groupId: '' });
            fetchUsers();
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Admin: User Management (1.0)</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Create System User'}
                </button>
            </div>

            {showForm && (
                <div className="glass fade-in" style={{ padding: '32px', marginBottom: '40px', maxWidth: '500px' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Login Username</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Security Password</label>
                            <input
                                type="password" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                            <input
                                type="text" required className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Assign to Group</label>
                            <select
                                className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.groupId}
                                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                            >
                                <option value="">No Group</option>
                                {groups.map(g => (
                                    <option key={g._id} value={g._id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Security Role (Legacy)</label>
                            <select
                                className="glass"
                                style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="STAFF">Staff</option>
                                <option value="MANAGER">Manager</option>
                                <option value="INSPECTOR">Inspector</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register New User</button>
                    </form>
                </div>
            )}

            <div className="glass" style={{ overflowX: 'auto', padding: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                            <th style={{ padding: '12px' }}>Name</th>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>Group / Access</th>
                            <th style={{ padding: '12px' }}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px' }}>{user.name}</td>
                                <td style={{ padding: '12px' }}>{user.username}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>
                                        {groups.find(g => g._id === user.groupId)?.name || 'Direct Rights'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        background: 'rgba(37, 99, 235, 0.1)',
                                        color: 'var(--primary-glow)'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
