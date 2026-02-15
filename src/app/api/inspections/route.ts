import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { vehicleId, date, location } = await req.json();
        if (!vehicleId || !date || !location) {
            return NextResponse.json({ error: 'Missing inspection details' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('inspections').insertOne({
            vehicleId: new ObjectId(vehicleId),
            date: new Date(date),
            location,
            isComplete: false,
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

        // Aggregation to get vehicle details with inspections
        const inspections = await db.collection('inspections').aggregate([
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicleId',
                    foreignField: '_id',
                    as: 'vehicle'
                }
            },
            { $unwind: '$vehicle' },
            { $sort: { date: 1 } }
        ]).toArray();

        return NextResponse.json(inspections);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id, conditionReport, notes } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        await db.collection('inspections').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    conditionReport,
                    notes,
                    isComplete: true,
                    completedAt: new Date(),
                    inspectorId: new ObjectId(session.user?.id)
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
