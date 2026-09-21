import { Pool } from 'pg';
import type { IncomingMessage, ServerResponse } from 'http';

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function getPool(): Pool | null {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) return null;

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function ensureSchema(): Promise<Pool> {
  const pg = getPool();
  if (!pg) {
    throw new Error('DATABASE_URL nao configurada na Vercel');
  }

  if (!schemaReady) {
    schemaReady = (async () => {
      await pg.query(`
        CREATE TABLE IF NOT EXISTS articles (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'Geral',
          image TEXT,
          excerpt TEXT,
          summary TEXT,
          content TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt TEXT;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS summary TEXT;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS image TEXT;
        ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral';

        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          description TEXT,
          location TEXT,
          status TEXT DEFAULT 'agendado',
          time TEXT,
          category TEXT DEFAULT 'Geral',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'agendado';
        ALTER TABLE events ADD COLUMN IF NOT EXISTS time TEXT;
        ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral';
        ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT;
        ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;

        CREATE TABLE IF NOT EXISTS videos (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          thumbnail TEXT,
          is_live BOOLEAN DEFAULT false,
          category TEXT DEFAULT 'Geral',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail TEXT;
        ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;
        ALTER TABLE videos ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Geral';

        CREATE TABLE IF NOT EXISTS admins (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'admin',
          password TEXT,
          password_hash TEXT,
          is_pending BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE admins ADD COLUMN IF NOT EXISTS password TEXT;
        ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash TEXT;
        ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT TRUE;
        ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
      `);

      const adminCount = await pg.query('SELECT COUNT(*)::int AS n FROM admins');
      if (adminCount.rows[0].n === 0) {
        await pg.query(
          `INSERT INTO admins (email, role, password, password_hash, is_pending)
           VALUES
            ('coordenacao@sesi.edu.br', 'admin', 'admin', 'admin', false),
            ('admin@sesi.edu.br', 'admin', NULL, NULL, true)
           ON CONFLICT (email) DO NOTHING`
        );
      }
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }

  await schemaReady;
  return pg;
}

export function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

export async function readBody(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function apiPath(req: IncomingMessage): string {
  const headerPath =
    (req.headers['x-invoke-path'] as string) ||
    (req.headers['x-matched-path'] as string) ||
    '';
  const raw = req.url || headerPath || '/';
  const pathname = new URL(raw, 'http://localhost').pathname;
  const stripped = pathname.replace(/^\/api/, '') || '/';
  return stripped.replace(/\/+$/, '') || '/';
}

export function youtubeThumb(url: string): string {
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  const id = match && match[2].length === 11 ? match[2] : null;
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=640';
}

export function mapArticle(row: any) {
  const excerpt = row.excerpt || row.summary || '';
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category: row.category || 'Geral',
    image: row.image || '',
    excerpt,
    summary: row.summary || excerpt,
    content: row.content || excerpt,
  };
}

export function mapEvent(row: any) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    time: row.time || undefined,
    description: row.description || '',
    location: row.location || '',
    status: row.status || 'agendado',
    category: row.category || 'Geral',
  };
}

export function mapVideo(row: any) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    thumbnail: row.thumbnail || youtubeThumb(row.url || ''),
    isLive: row.is_live ?? false,
    category: row.category || 'Geral',
  };
}

export function mapAdmin(row: any) {
  return {
    id: row.id,
    email: row.email,
    role: row.role || 'admin',
    password: null,
    isPending: row.is_pending ?? true,
  };
}
