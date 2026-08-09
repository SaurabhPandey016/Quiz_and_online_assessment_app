import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new pg.Pool({
    connectionString : process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {

    console.log(`🌱 Starting database seeding processing execution...`);
    
    // 1. Seed Default Admin Account Securely
    const adminEmail = 'superadmin@quizapp.com';
    // FIXED: Changed the where key to use 'email' to match your User model schema
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if(!existingAdmin) {
        const hashedPassword = await bcrypt.hash('AdminSecurePass123!', 10);
        await prisma.user.create({
            data : {
                name : 'Platform Super Admin', 
                email : adminEmail, 
                password : hashedPassword, 
                role: 'ADMIN',
                status: 'active'
            }
        });
        console.log('✅ Default Admin User seeded successfully: superadmin@quizapp.com');
    }
    else {
        console.log('ℹ️ Admin user already exists. Skipping...');
    }

    // 2. Seed Default Application Core Categories
    const coreCategories = [
        { name: 'HTML', description: 'HyperText Markup Language core structure and syntax.' },
        { name: 'CSS', description: 'Cascading Style Sheets layouts, responsiveness, and design.' },
        { name: 'JavaScript', description: 'Core functional programming, scopes, closures, and async logic.' },
        { name: 'React', description: 'Component lifecycles, state management, hooks, and virtual DOM.' },
        { name: 'Node.js', description: 'Server-side runtime, V8 processing mechanics, and modular routing.' },
        { name: 'Python', description: 'Data scripting structures, OOP, dynamic syntax execution patterns.' },
        { name: 'Java', description: 'Object-oriented structural design patterns, typing controls, JVM architectures.' },
        { name: 'Database', description: 'SQL indexing queries, transaction isolations, and relational constraints.' },
        { name: 'Computer Networks', description: 'TCP/IP mapping pipelines, network layers, and routing security protocols.' },
        { name: 'Cyber Security', description: 'Threat vectors, cryptographic handshakes, and token protection layouts.' }
    ];

    for (const category of coreCategories) {
        await prisma.category.upsert({
            where : {name : category.name }, 
            update : {}, // if category already exists, change nothing
            create : category, 
        });
    }

    console.log(`✅ ${coreCategories.length} Core quiz categories synchronized cleanly.`);
}

main()
  .catch((e) => {
    console.error('❌ Database seeding execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 Seeding workflow complete. Connection closed safely.');
});