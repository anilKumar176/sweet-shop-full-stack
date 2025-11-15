import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const currentTimestamp = new Date().toISOString();

    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    const sampleUsers = [
        {
            email: 'superadmin@sweetshop.com',
            password: hashedAdminPassword,
            name: 'Super Admin',
            role: 'super_admin',
            createdAt: currentTimestamp,
        },
        {
            email: 'admin1@sweetshop.com',
            password: hashedAdminPassword,
            name: 'Admin One',
            role: 'admin',
            createdAt: currentTimestamp,
        },
        {
            email: 'admin2@sweetshop.com',
            password: hashedAdminPassword,
            name: 'Admin Two',
            role: 'admin',
            createdAt: currentTimestamp,
        },
        {
            email: 'admin3@sweetshop.com',
            password: hashedAdminPassword,
            name: 'Admin Three',
            role: 'admin',
            createdAt: currentTimestamp,
        },
        {
            email: 'user1@sweetshop.com',
            password: hashedUserPassword,
            name: 'Regular User One',
            role: 'user',
            createdAt: currentTimestamp,
        },
        {
            email: 'user2@sweetshop.com',
            password: hashedUserPassword,
            name: 'Regular User Two',
            role: 'user',
            createdAt: currentTimestamp,
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});