const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined');
        return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        const users = db.collection('users');

        // Check if admin user already exists
        const adminExists = await users.findOne({ email: 'wasi@gmail.com' });
        if (adminExists) {
            console.log('Admin user already exists with email: wasi@gmail.com');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('123456', 10);
        
        // Create admin user
        await users.insertOne({
            username: 'wasi',
            email: 'wasi@gmail.com',
            password: hashedPassword,
            name: 'Wasi Admin',
            role: 'ADMIN',
            createdAt: new Date(),
        });

        console.log('✓ Admin user created successfully!');
        console.log('==========================================');
        console.log('Email: wasi@gmail.com');
        console.log('Password: 123456');
        console.log('Role: ADMIN');
        console.log('==========================================');
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await client.close();
    }
}

seed();
