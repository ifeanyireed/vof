import { neon } from '@neondatabase/serverless';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_LouPIU72xaSO@ep-broad-moon-b5bq0zrt-pooler.c-7.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const sql = neon(DATABASE_URL);

async function run() {
  console.log('Connecting to Neon Database...');
  console.log('Target database URL:', DATABASE_URL.replace(/:[^:]+@/, ':****@'));

  console.log('\n--- 1. Creating analytics_pageviews table ---');
  await sql`
    CREATE TABLE IF NOT EXISTS analytics_pageviews (
      id BIGSERIAL PRIMARY KEY,
      session_id VARCHAR(64) NOT NULL,
      visitor_id VARCHAR(64) NOT NULL,
      path VARCHAR(500) NOT NULL,
      title VARCHAR(255),
      referrer TEXT,
      referrer_domain VARCHAR(255),
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      utm_content VARCHAR(100),
      country VARCHAR(10),
      country_name VARCHAR(100),
      region VARCHAR(100),
      city VARCHAR(100),
      device_type VARCHAR(20) DEFAULT 'desktop',
      os VARCHAR(50),
      browser VARCHAR(50),
      screen_resolution VARCHAR(50),
      ip_masked VARCHAR(45),
      is_first_visit BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table analytics_pageviews ensured.');

  console.log('\n--- 2. Creating analytics_sessions table ---');
  await sql`
    CREATE TABLE IF NOT EXISTS analytics_sessions (
      session_id VARCHAR(64) PRIMARY KEY,
      visitor_id VARCHAR(64) NOT NULL,
      entry_path VARCHAR(500) NOT NULL,
      exit_path VARCHAR(500),
      page_count INT DEFAULT 1,
      duration_seconds INT DEFAULT 0,
      country VARCHAR(10),
      country_name VARCHAR(100),
      city VARCHAR(100),
      device_type VARCHAR(20) DEFAULT 'desktop',
      os VARCHAR(50),
      browser VARCHAR(50),
      referrer_domain VARCHAR(255),
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table analytics_sessions ensured.');

  console.log('\n--- 3. Creating Indexes ---');
  await sql`CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON analytics_pageviews(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pageviews_session_id ON analytics_pageviews(session_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON analytics_pageviews(visitor_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pageviews_path ON analytics_pageviews(path);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pageviews_country ON analytics_pageviews(country);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON analytics_sessions(last_seen DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_first_seen ON analytics_sessions(first_seen DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON analytics_sessions(visitor_id);`;
  console.log('✓ Indexes verified.');

  console.log('\n✅ All Traffic Analytics tables and indexes ready in Neon!');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
