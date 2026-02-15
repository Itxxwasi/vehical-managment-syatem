import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const client = await clientPromise;
        const db = client.db();

        // Aggregating stats from multiple collections
        const vehicleCount = await db.collection('vehicles').countDocuments();
        const inspectionCount = await db.collection('inspections').countDocuments();
        const policyCount = await db.collection('policies').countDocuments();
        const claimCount = await db.collection('claims').countDocuments();

        const statusStats = await db.collection('vehicles').aggregate([
            { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
        ]).toArray();

        const financialStats = await db.collection('claims').aggregate([
            { $group: { _id: null, totalClaimed: { $sum: '$claimedAmount' }, totalApproved: { $sum: '$approvedAmount' } } }
        ]).toArray();

        const reportSummary = {
            summary: { vehicleCount, inspectionCount, policyCount, claimCount },
            statusStats,
            finances: financialStats[0] || { totalClaimed: 0, totalApproved: 0 }
        };

        // D7: Store generated report in Reports Database
        await db.collection('reports').insertOne({
            reportType: 'SYSTEM_SUMMARY',
            generatedBy: session.user?.name,
            data: reportSummary,
            createdAt: new Date()
        });

        return NextResponse.json(reportSummary);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
