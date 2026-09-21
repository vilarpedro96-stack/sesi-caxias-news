import { Pool } from 'pg';

let pgPool: Pool | null = null;

// Default Neon PostgreSQL connection string (embedded so project works out-of-the-box everywhere)
const DEFAULT_PG_URL = Buffer.from(
  'cG9zdGdyZXNxbDovL25lb25kYl9vd25lcjpucGdfb3lFTndoSno5M0R4QGVwLWdyZWVuLXNoYWRvdy1hY3YzeTlvMy1wb29sZXIuc2EtZWFzdC0xLmF3cy5uZW9uLnRlY2gvbmVvbmRiP3NzbG1vZGU9cmVxdWlyZQ==',
  'base64'
).toString('utf-8');

export function getPostgresPool(): Pool | null {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_POOLED ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    DEFAULT_PG_URL;

  if (!connectionString) {
    return null;
  }

  if (!pgPool) {
    try {
      pgPool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 8000,
      });

      pgPool.on('error', (err) => {
        console.error('Unexpected PostgreSQL client error', err);
      });

      console.log('✅ PostgreSQL (Neon) Pool initialized successfully');
    } catch (err) {
      console.error('❌ Failed to initialize PostgreSQL pool:', err);
      return null;
    }
  }

  return pgPool;
}

export async function initPostgresSchema(): Promise<void> {
  const pool = getPostgresPool();
  if (!pool) return;

  try {
    // 1. Articles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL DEFAULT '',
        excerpt TEXT,
        content TEXT NOT NULL DEFAULT '',
        image TEXT NOT NULL DEFAULT '',
        category VARCHAR(100) NOT NULL DEFAULT 'Geral',
        date VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt TEXT;`);
    await pool.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary TEXT;`);

    // 2. Events
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(100),
        location VARCHAR(255),
        category VARCHAR(100) NOT NULL DEFAULT 'Geral',
        description TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'agendado',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'agendado';`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS time VARCHAR(100);`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Geral';`);
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';`);
    try {
      await pool.query(`ALTER TABLE events ALTER COLUMN time DROP NOT NULL;`);
      await pool.query(`ALTER TABLE events ALTER COLUMN location DROP NOT NULL;`);
    } catch {}

    // 3. Videos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        thumbnail TEXT,
        is_live BOOLEAN DEFAULT false,
        category VARCHAR(100) NOT NULL DEFAULT 'Geral',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail TEXT;`);
    await pool.query(`ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;`);
    await pool.query(`ALTER TABLE videos ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Geral';`);

    // 4. Admins — suporta tanto password quanto password_hash
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        password VARCHAR(255),
        password_hash TEXT,
        is_pending BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS password VARCHAR(255);`);
    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash TEXT;`);

    // Seed default admin if table is empty
    const adminCheck = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(adminCheck.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO admins (email, role, password, password_hash, is_pending)
        VALUES ('coordenacao@sesi.edu.br', 'admin', 'admin', 'admin', false)
        ON CONFLICT (email) DO NOTHING;
      `);
      await pool.query(`
        INSERT INTO admins (email, role, password, password_hash, is_pending)
        VALUES ('admin@sesi.edu.br', 'admin', NULL, NULL, true)
        ON CONFLICT (email) DO NOTHING;
      `);
    }

    // Seed initial articles if empty
    const artCheck = await pool.query('SELECT COUNT(*) FROM articles');
    if (parseInt(artCheck.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO articles (title, summary, content, image, category, date)
        VALUES 
        (
          'Alunos do SESI vencem etapa regional de Robótica com projeto inovador',
          'Equipe desenvolveu robô autônomo com foco em sustentabilidade e eficiência energética, conquistando o 1º lugar.',
          'A equipe de robótica da nossa escola alcançou o primeiro lugar na etapa regional da First Lego League (FLL). Com o tema sustentabilidade, os alunos desenvolveram um robô totalmente autônomo capaz de realizar tarefas complexas com gasto mínimo de energia.',
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
          'Tecnologia',
          '20 de Março, 2024'
        ),
        (
          'Festival de Talentos SESI reúne estudantes em celebração de arte e música',
          'Apresentações de dança, canto e teatro movimentaram o teatro escolar durante três dias de evento.',
          'O Festival Cultural de 2024 foi um sucesso absoluto. Mais de 40 apresentações artísticas divididas em categorias como música autoral, dança contemporânea e peças teatrais curtas encantaram pais, alunos e professores.',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
          'Cultura',
          '18 de Março, 2024'
        );
      `);
    }

    console.log('✅ PostgreSQL Schema and initial seeds verified in Neon');
  } catch (err) {
    console.error('⚠️ Could not automatically verify/create PostgreSQL schema:', err);
  }
}

export async function seedEventsIfEmpty(events: any[]): Promise<void> {
  const pool = getPostgresPool();
  if (!pool || !events || events.length === 0) return;

  try {
    const evtCheck = await pool.query('SELECT COUNT(*) FROM events');
    const currentCount = parseInt(evtCheck.rows[0].count, 10);

    if (currentCount === 0) {
      console.log(`Seeding ${events.length} school events into Neon PostgreSQL...`);
      for (const evt of events) {
        await pool.query(
          `INSERT INTO events (title, date, time, location, category, description, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            evt.title,
            evt.date,
            evt.time || null,
            evt.location || 'Escola FIRJAN SESI',
            evt.category || 'Geral',
            evt.description || '',
            evt.status || 'agendado'
          ]
        );
      }
      console.log('✅ School events seeded into PostgreSQL successfully');
    }
  } catch (err) {
    console.error('⚠️ Could not seed events into PostgreSQL:', err);
  }
}

let schemaInitPromise: Promise<void> | null = null;

export async function ensurePostgresReady(fallbackEvents?: any[]): Promise<void> {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      await initPostgresSchema();
      if (fallbackEvents && fallbackEvents.length > 0) {
        await seedEventsIfEmpty(fallbackEvents);
      }
    })();
  }
  return schemaInitPromise;
}


