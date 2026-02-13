const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function deploy() {
    console.log('Deploying schema to Supabase...');
    
    const connectionString = envConfig.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL not found in .env.local');
        process.exit(1);
    }

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Read Phase 2 Schema (Recipes, Webhooks, API Keys)
        /*
        const phase2Path = path.join(process.cwd(), 'supabase/migrations/20240213_phase2_schema.sql');
        if (fs.existsSync(phase2Path)) {
            console.log('Applying Phase 2 Schema (Recipes, Webhooks)...');
            const sql = fs.readFileSync(phase2Path, 'utf8');
            await client.query(sql);
            console.log('✅ Phase 2 Schema applied.');
        }

        // 2. Read Phase 4 Profiles (Profiles table, RLS, Trigger)
        const phase4Path = path.join(process.cwd(), 'supabase/migrations/20240213_phase4_profiles.sql');
        if (fs.existsSync(phase4Path)) {
            console.log('Applying Phase 4 Profiles Schema...');
            const sql = fs.readFileSync(phase4Path, 'utf8');
            await client.query(sql);
            console.log('✅ Phase 4 Profiles Schema applied.');
        }

        // 3. Read Phase 5 Optimization (RLS, Cleanup)
        const phase5Path = path.join(process.cwd(), 'supabase/migrations/20240213_phase5_optimization.sql');
        if (fs.existsSync(phase5Path)) {
            console.log('Applying Phase 5 Optimization Schema...');
            const sql = fs.readFileSync(phase5Path, 'utf8');
            await client.query(sql);
            console.log('✅ Phase 5 Optimization Schema applied.');
        }
        */

        // 4. Read Phase 6 Preferences (Add preferences column)
        const phase6Path = path.join(process.cwd(), 'supabase/migrations/20240213_phase6_preferences.sql');
        if (fs.existsSync(phase6Path)) {
            console.log('Applying Phase 6 Preferences Schema...');
            const sql = fs.readFileSync(phase6Path, 'utf8');
            await client.query(sql);
            console.log('✅ Phase 6 Preferences Schema applied.');
        }

        console.log('All migrations completed successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
        console.error('Make sure your DATABASE_URL in .env.local is correct.');
    } finally {
        await client.end();
    }
}

deploy();
