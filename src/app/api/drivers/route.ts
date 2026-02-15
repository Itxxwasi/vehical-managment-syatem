import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, licenseNumber, contact } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('drivers').insertOne({
            name,
            licenseNumber,
            contact,
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
        const drivers = await db.collection('drivers').find({}).toArray();
        return NextResponse.json(drivers);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
