import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized Admin Access Required' }, { status: 401 });
    }

    try {
        const { username, password, name, role } = await req.json();
        const client = await clientPromise;
        const db = client.db();

        // Check if user exists
        const existing = await db.collection('users').findOne({ username });
        if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            username,
            password: hashedPassword,
            name,
            role,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
