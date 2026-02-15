import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, status } = await req.json();
        if (!id || !status) {
            return NextResponse.json({ error: 'Missing ID or status' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();

        await db.collection('vehicles').updateOne(
            { _id: new ObjectId(id) },
            { $set: { currentStatus: status, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
