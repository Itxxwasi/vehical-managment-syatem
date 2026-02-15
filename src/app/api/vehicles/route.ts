import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const {
            make, model, chassisNumber, engineNumber,
            color, engineCapacity, ownerName, ownerDetails, importRoute
        } = data;

        // Validation: All details provided? (Flowchart Decision)
        if (!make || !model || !chassisNumber || !engineNumber || !ownerName) {
            return NextResponse.json({ error: 'Missing required details' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('vehicles').insertOne({
            make,
            model,
            chassisNumber,
            engineNumber,
            color,
            engineCapacity,
            ownerName,
            ownerDetails,
            importRoute,
            currentStatus: 'PORT', // Default start status
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('Vehicle registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const vehicles = await db.collection('vehicles').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(vehicles);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
