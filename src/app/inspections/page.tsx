'use client';

import { useState, useEffect } from 'react';

export default function InspectionsQueue() {
    const [inspections, setInspections] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [report, setReport] = useState({ conditionReport: '', notes: '' });

    useEffect(() => {
        fetchInspections();
    }, []);

    const fetchInspections = () => {
        fetch('/api/inspections')
            .then(res => res.json())
            .then(data => setInspections(data));
    };

    const submitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/inspections', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selected._id, ...report }),
        });

        if (res.ok) {
            setSelected(null);
            fetchInspections();
        }
    };

    return (
        <div className="container fade-in" style={{ paddingTop: '120px' }}>
            <h1>Inspection Queue</h1>

            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '32px', marginTop: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {inspections.map(i => (
                        <div key={i._id} className="glass" style={{ padding: '20px', cursor: 'pointer', opacity: i.isComplete ? 0.6 : 1 }} onClick={() => !i.isComplete && setSelected(i)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>{i.vehicle.make} {i.vehicle.model}</strong>
                                <span style={{ color: i.isComplete ? 'var(--success)' : 'var(--accent)' }}>
                                    {i.isComplete ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(i.date).toLocaleDateString()} @ {i.location}</p>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2>Conduct Inspection</h2>
                        <p style={{ marginBottom: '24px' }}>{selected.vehicle.make} - {selected.vehicle.chassisNumber}</p>

                        <form onSubmit={submitReport}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Vehicle Condition Result *</label>
                                <select
                                    required className="glass"
                                    style={{ padding: '12px', width: '100%', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={report.conditionReport}
                                    onChange={(e) => setReport({ ...report, conditionReport: e.target.value })}
                                >
                                    <option value="">Select Condition...</option>
                                    <option value="EXCELLENT">Excellent</option>
                                    <option value="GOOD">Good / Normal Wear</option>
                                    <option value="MINOR_ISSUES">Minor Damage</option>
                                    <option value="MAJOR_ISSUES">Major Damage / Repair Needed</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>Inspector Notes</label>
                                <textarea
                                    className="glass"
                                    style={{ padding: '12px', width: '100%', height: '100px', outline: 'none', color: 'white', background: 'rgba(0,0,0,0.2)' }}
                                    value={report.notes}
                                    onChange={(e) => setReport({ ...report, notes: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Audit</button>
                                <button type="button" onClick={() => setSelected(null)} className="btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
