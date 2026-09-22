import type { IncomingMessage, ServerResponse } from 'http';

type Json = Record<string, unknown> | unknown[];

function send(res: ServerResponse, status: number, data: Json) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

function getPath(req: IncomingMessage): string {
  const raw = req.url || '/';
  let pathname = raw.split('?')[0] || '/';
  if (pathname.startsWith('/api')) pathname = pathname.slice(4) || '/';
  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
  return pathname;
}

async function readBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
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

function youtubeThumb(url: string): string {
  const match = String(url).match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  const id = match && match[2].length === 11 ? match[2] : null;
  return id
    ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=640';
}

function mapArticle(row: any) {
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

function mapEvent(row: any) {
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

function mapVideo(row: any) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    thumbnail: row.thumbnail || youtubeThumb(row.url || ''),
    isLive: row.is_live ?? false,
    category: row.category || 'Geral',
  };
}

function mapAdmin(row: any) {
  return {
    id: row.id,
    email: row.email,
    role: row.role || 'admin',
    password: null,
    isPending: row.is_pending ?? true,
  };
}

let pool: any = null;
let schemaReady: Promise<void> | null = null;

async function getPool() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error('DATABASE_URL nao configurada na Vercel');
  }
  if (!pool) {
    const pg = await import('pg');
    const Pool = (pg as any).Pool || (pg as any).default?.Pool;
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

async function ensureSchema() {
  const pg = await getPool();
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method === 'OPTIONS') {
      return send(res, 200, { ok: true });
    }

    const method = (req.method || 'GET').toUpperCase();
    const path = getPath(req);

    if (path === '/health' || path === '/') {
      return send(res, 200, { status: 'ok', timestamp: new Date().toISOString(), path });
    }

    if (path === '/status' && method === 'GET') {
      try {
        const pg = await ensureSchema();
        const art = await pg.query('SELECT COUNT(*)::int AS n FROM articles');
        return send(res, 200, {
          status: 'ok',
          database: {
            type: 'postgresql',
            provider: 'Neon (PostgreSQL)',
            configured: true,
            connected: true,
            articlesCount: art.rows[0].n,
            error: null,
          },
        });
      } catch (e: any) {
        return send(res, 200, {
          status: 'ok',
          database: {
            type: 'postgresql',
            provider: 'Neon (PostgreSQL)',
            configured: Boolean(
              process.env.DATABASE_URL || process.env.POSTGRES_URL
            ),
            connected: false,
            error: e?.message || 'Falha ao conectar no Neon',
          },
        });
      }
    }

    const pg = await ensureSchema();

    if (path === '/articles' && method === 'GET') {
      const { rows } = await pg.query('SELECT * FROM articles ORDER BY id DESC');
      return send(res, 200, rows.map(mapArticle));
    }

    if (path === '/articles' && method === 'POST') {
      const body = await readBody(req);
      if (!body.title) return send(res, 400, { error: 'Titulo obrigatorio' });
      const summary = body.summary || body.excerpt || body.content || '';
      const content = body.content || summary;
      const { rows } = await pg.query(
        `INSERT INTO articles (title, date, category, image, excerpt, summary, content)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
          body.title,
          body.date || new Date().toLocaleDateString('pt-BR'),
          body.category || 'Geral',
          body.image || '',
          summary,
          summary,
          content,
        ]
      );
      return send(res, 201, mapArticle(rows[0]));
    }

    const articleDelete = path.match(/^\/articles\/(\d+)$/);
    if (articleDelete && method === 'DELETE') {
      await pg.query('DELETE FROM articles WHERE id = $1', [Number(articleDelete[1])]);
      return send(res, 200, { success: true, id: Number(articleDelete[1]) });
    }

    if (path === '/events' && method === 'GET') {
      const { rows } = await pg.query('SELECT * FROM events ORDER BY date ASC');
      return send(res, 200, rows.map(mapEvent));
    }

    if (path === '/events' && method === 'POST') {
      const body = await readBody(req);
      if (!body.title || !body.date) return send(res, 400, { error: 'Titulo e data obrigatorios' });
      const { rows } = await pg.query(
        `INSERT INTO events (title, date, time, location, category, description, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
          body.title,
          body.date,
          body.time || null,
          body.location || 'SESI Caxias',
          body.category || 'Geral',
          body.description || '',
          body.status || 'agendado',
        ]
      );
      return send(res, 201, mapEvent(rows[0]));
    }

    const eventDelete = path.match(/^\/events\/(\d+)$/);
    if (eventDelete && method === 'DELETE') {
      await pg.query('DELETE FROM events WHERE id = $1', [Number(eventDelete[1])]);
      return send(res, 200, { success: true, id: Number(eventDelete[1]) });
    }

    if (path === '/videos' && method === 'GET') {
      const { rows } = await pg.query('SELECT * FROM videos ORDER BY id DESC');
      return send(res, 200, rows.map(mapVideo));
    }

    if (path === '/videos' && method === 'POST') {
      const body = await readBody(req);
      if (!body.title || !body.url) return send(res, 400, { error: 'Titulo e URL obrigatorios' });
      const thumbnail = body.thumbnail || youtubeThumb(body.url);
      const { rows } = await pg.query(
        `INSERT INTO videos (title, url, thumbnail, is_live, category)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [body.title, body.url, thumbnail, Boolean(body.isLive), body.category || 'Geral']
      );
      return send(res, 201, mapVideo(rows[0]));
    }

    const videoDelete = path.match(/^\/videos\/(\d+)$/);
    if (videoDelete && method === 'DELETE') {
      await pg.query('DELETE FROM videos WHERE id = $1', [Number(videoDelete[1])]);
      return send(res, 200, { success: true, id: Number(videoDelete[1]) });
    }

    if (path === '/admins' && method === 'GET') {
      const { rows } = await pg.query(
        'SELECT id, email, role, is_pending FROM admins ORDER BY id ASC'
      );
      return send(res, 200, rows.map(mapAdmin));
    }

    if (path === '/admins' && method === 'POST') {
      const body = await readBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!email) return send(res, 400, { error: 'Email is required' });
      try {
        const { rows } = await pg.query(
          `INSERT INTO admins (email, role, is_pending, password, password_hash)
           VALUES ($1, 'admin', true, NULL, NULL)
           RETURNING id, email, role, is_pending`,
          [email]
        );
        return send(res, 201, mapAdmin(rows[0]));
      } catch (e: any) {
        if (e.code === '23505') {
          return send(res, 400, { error: 'Este e-mail ja esta cadastrado.' });
        }
        throw e;
      }
    }

    const adminDelete = path.match(/^\/admins\/(\d+)$/);
    if (adminDelete && method === 'DELETE') {
      await pg.query('DELETE FROM admins WHERE id = $1', [Number(adminDelete[1])]);
      return send(res, 200, { success: true, id: Number(adminDelete[1]) });
    }

    if (path === '/admins/login' && method === 'POST') {
      const body = await readBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = body.password;
      if (!email) return send(res, 400, { error: 'Email is required' });

      const { rows } = await pg.query(
        'SELECT * FROM admins WHERE LOWER(email) = $1 LIMIT 1',
        [email]
      );
      if (!rows.length) {
        return send(res, 404, { error: 'E-mail nao cadastrado como administrador.' });
      }
      const data = rows[0];
      const stored = data.password || data.password_hash || null;
      if (!stored) {
        return send(res, 200, {
          isPending: true,
          admin: mapAdmin({ ...data, is_pending: true }),
        });
      }
      if (stored !== password) {
        return send(res, 401, { error: 'Senha incorreta.' });
      }
      return send(res, 200, {
        isPending: false,
        admin: mapAdmin({ ...data, is_pending: false }),
      });
    }

    if (path === '/admins/setup-password' && method === 'POST') {
      const body = await readBody(req);
      if (!body.adminId || !body.password) {
        return send(res, 400, { error: 'adminId and password are required' });
      }
      const { rows } = await pg.query(
        `UPDATE admins
         SET password = $1, password_hash = $1, is_pending = false
         WHERE id = $2
         RETURNING id, email, role, is_pending`,
        [body.password, body.adminId]
      );
      if (!rows.length) return send(res, 404, { error: 'Admin nao encontrado.' });
      return send(res, 200, { success: true, admin: mapAdmin(rows[0]) });
    }

    return send(res, 404, { error: 'Rota nao encontrada', path, method });
  } catch (err: any) {
    console.error('API error', err);
    return send(res, 500, {
      error: 'Falha na API',
      message: err?.message || String(err),
    });
  }
}
