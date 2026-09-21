import type { IncomingMessage, ServerResponse } from 'http';
import {
  apiPath,
  ensureSchema,
  getPool,
  mapAdmin,
  mapArticle,
  mapEvent,
  mapVideo,
  readBody,
  send,
  youtubeThumb,
} from './_lib';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    return send(res, 200, { ok: true });
  }

  const method = (req.method || 'GET').toUpperCase();
  const path = apiPath(req);

  try {
    if (path === '/health' || path === '/') {
      return send(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
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
            configured: Boolean(getPool()),
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
