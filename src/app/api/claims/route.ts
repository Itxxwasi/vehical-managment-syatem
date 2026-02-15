import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { policyId, incidentDescription, dateOfIncident, claimedAmount } = await req.json();
        if (!policyId || !incidentDescription || !claimedAmount) {
            return NextResponse.json({ error: 'Missing claim details' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('claims').insertOne({
            policyId: new ObjectId(policyId),
            customerId: new ObjectId(session.user?.id),
            incidentDescription,
            dateOfIncident: new Date(dateOfIncident),
            claimedAmount: parseFloat(claimedAmount),
            status: 'SUBMITTED',
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const client = await clientPromise;
        const db = client.db();

        const claims = await db.collection('claims').aggregate([
            {
                $lookup: {
                    from: 'policies',
                    localField: 'policyId',
                    foreignField: '_id',
                    as: 'policy'
                }
            },
            { $unwind: '$policy' },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'policy.vehicleId',
                    foreignField: '_id',
                    as: 'vehicle'
                }
            },
            { $unwind: '$vehicle' }
        ]).toArray();

        return NextResponse.json(claims);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, status, approvedAmount } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        await db.collection('claims').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    approvedAmount: parseFloat(approvedAmount || 0),
                    processedAt: new Date()
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
