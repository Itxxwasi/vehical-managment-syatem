'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('Invalid username or password');
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="container fade-in" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <div className="glass" style={{ padding: '48px', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800' }}>
                    Car Import Insurance <span style={{ color: 'var(--primary-glow)' }}>Management</span>
                </h1>
                <p style={{ color: 'var(--secondary)', textAlign: 'center', marginBottom: '32px', fontSize: '0.9rem' }}>
                    System Login
                </p>

                {error && <p style={{ color: 'var(--error)', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            className="glass"
                            style={{ padding: '12px', width: '100%', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
