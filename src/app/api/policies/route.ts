import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { vehicleId, coverageDetails, amount } = await req.json();
        if (!vehicleId || !coverageDetails || !amount) {
            return NextResponse.json({ error: 'Missing policy details' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('policies').insertOne({
            vehicleId: new ObjectId(vehicleId),
            policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
            coverageDetails,
            amount: parseFloat(amount),
            status: 'PENDING_APPROVAL',
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

        const policies = await db.collection('policies').aggregate([
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicleId',
                    foreignField: '_id',
                    as: 'vehicle'
                }
            },
            { $unwind: '$vehicle' }
        ]).toArray();

        return NextResponse.json(policies);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, status } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        await db.collection('policies').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status,
                    managerId: new ObjectId(session.user?.id),
                    updatedAt: new Date()
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
