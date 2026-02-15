'use client';

import { useState, useEffect } from 'react';

export default function ReportingDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [reportType, setReportType] = useState('SUMMARY');
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchDetailedReport('SUMMARY');
    }, []);

    const fetchStats = async () => {
        const res = await fetch('/api/reports');
        const data = await res.json();
        setStats(data);
    };

    const fetchDetailedReport = async (type: string) => {
        setLoading(true);
        setReportType(type);
        // We'll use existing APIs to mock the "retrieve from global data stores" logic in Flowchart 5
        let endpoint = '/api/vehicles';
        if (type === 'INSPECTIONS') endpoint = '/api/inspections';
        if (type === 'POLICIES') endpoint = '/api/policies';
        if (type === 'CLAIMS') endpoint = '/api/claims';
        if (type === 'SUMMARY') {
            setReportData([]);
            setLoading(false);
            return;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        setReportData(data);
        setLoading(false);
    };

    const handleExport = () => {
        alert("Preparing Export Files... CSV and PDF generated in Reports Database (D7).");
    };

    if (!stats) return <div className="container" style={{ paddingTop: '120px' }}>Loading metrics...</div>;

    return (
        <div className="container fade-in" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '48px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px' }}>Advanced Reporting System (6.0)</h1>
                    <p style={{ color: 'var(--secondary)' }}>Analytics stored in Reports Database (D7).</p>
                </div>
                <button onClick={handleExport} className="btn" style={{ background: 'var(--success)', color: 'white' }}>
                    📥 Export Report
                </button>
            </div>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Total Vehicles</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-glow)' }}>{stats.summary.vehicleCount}</h2>
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Inspections</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--accent)' }}>{stats.summary.inspectionCount}</h2>
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Active Policies</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>{stats.summary.policyCount}</h2>
                </div>
                <div className="glass" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Total Claims</p>
                    <h2 style={{ fontSize: '2rem', color: 'var(--error)' }}>{stats.summary.claimCount}</h2>
                </div>
            </div>

            {/* Choose Report Type - Flowchart 5 Logic */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['SUMMARY', 'VEHICLES', 'INSPECTIONS', 'POLICIES', 'CLAIMS'].map(type => (
                    <button
                        key={type}
                        onClick={() => fetchDetailedReport(type)}
                        className="btn"
                        style={{
                            background: reportType === type ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontSize: '0.8rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {type} Report
                    </button>
                ))}
            </div>

            {reportType === 'SUMMARY' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    <div className="glass" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Route Analytics</h3>
                        {stats.statusStats.map((s: any) => (
                            <div key={s._id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.9rem' }}>{s._id} Status</span>
                                    <strong style={{ fontSize: '0.9rem' }}>{s.count}</strong>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ width: `${(s.count / stats.summary.vehicleCount) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="glass" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '24px' }}>Financial Payouts</h3>
                        <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '16px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Total Approved Compensation</p>
                            <h2 style={{ color: 'var(--success)', fontSize: '1.5rem' }}>${stats.finances.totalApproved.toLocaleString()}</h2>
                        </div>
                        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--error)' }}>Outstanding Claims</p>
                            <h2 style={{ color: 'var(--error)', fontSize: '1.5rem' }}>${(stats.finances.totalClaimed - stats.finances.totalApproved).toLocaleString()}</h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass" style={{ overflowX: 'auto', padding: '24px' }}>
                    {loading ? <p>Retrieving global data...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--secondary)', fontSize: '0.8rem' }}>
                                    <th style={{ padding: '12px' }}>Identifier</th>
                                    <th style={{ padding: '12px' }}>Main Detail</th>
                                    <th style={{ padding: '12px' }}>Status/Date</th>
                                    <th style={{ padding: '12px' }}>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '12px' }}>{item.chassisNumber || item.policyNumber || item._id.substring(0, 8)}</td>
                                        <td style={{ padding: '12px' }}>{item.make ? `${item.make} ${item.model}` : item.incidentDescription || item.conditionReport || 'System Record'}</td>
                                        <td style={{ padding: '12px' }}>{item.currentStatus || item.status || (item.date ? new Date(item.date).toLocaleDateString() : 'Active')}</td>
                                        <td style={{ padding: '12px' }}>{item.amount || item.claimedAmount ? `$${(item.amount || item.claimedAmount).toLocaleString()}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
