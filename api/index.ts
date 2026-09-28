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
  const date = String(row.date || '').slice(0, 10);
  const endDate = row.end_date ? String(row.end_date).slice(0, 10) : undefined;
  return {
    id: row.id,
    title: row.title,
    date,
    endDate,
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

function hasStoredPassword(row: any): boolean {
  const stored = String(row?.password || row?.password_hash || '').trim();
  return stored.length > 0;
}

function mapAdmin(row: any) {
  return {
    id: row.id,
    email: row.email,
    role: row.role || 'admin',
    password: null,
    isPending: !hasStoredPassword(row),
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
        ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date TEXT;

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

      await pg.query(`
        DELETE FROM events
        WHERE id IN (
          SELECT id FROM (
            SELECT id,
                   ROW_NUMBER() OVER (
                     PARTITION BY LOWER(TRIM(title)), TO_CHAR(date::timestamp, 'YYYY-MM-DD')
                     ORDER BY id ASC
                   ) AS rn
            FROM events
          ) ranked
          WHERE ranked.rn > 1
        )
      `);

      const existingEvents = await pg.query('SELECT title, date FROM events');
      const existingKeys = new Set(
        existingEvents.rows.map(
          (row: any) => `${String(row.title).trim().toLowerCase()}|${String(row.date).slice(0, 10)}`
        )
      );
      const calendar = [
          ['Retorno às aulas após o recesso escolar', '2026-08-03', null, null, 'Escola FIRJAN SESI Duque de Caxias', 'Retorno de todos os estudantes e equipe pedagógica para o 2º semestre letivo.'],
          ['Provas do 2º Trimestre', '2026-08-10', '2026-08-14', null, 'Salas de Aula', 'Semana de avaliações e provas do 2º Trimestre (10 a 14/08).'],
          ['Interclasses – Anos Iniciais', '2026-08-24', '2026-08-25', null, 'Ginásio Poliesportivo', 'Jogos esportivos Interclasses para os Anos Iniciais (24 e 25/08).'],
          ['Interclasses – Anos Finais', '2026-08-26', '2026-08-27', null, 'Ginásio Poliesportivo', 'Competições esportivas Interclasses para turmas dos Anos Finais (26 e 27/08).'],
          ['Passeio FESTMAT (Medalhistas Canguru + Integrantes MOB)', '2026-08-28', null, null, 'FESTMAT', 'Passeio cultural e pedagógico FESTMAT para medalhistas do Concurso Canguru e MOB.'],
          ['Recuperação Paralela – 2º Trimestre', '2026-08-31', '2026-09-04', null, 'Escola FIRJAN SESI', 'Aulas de reforço e avaliações de recuperação paralela (31/08 a 04/09).'],
          ['Interclasses – Ensino Médio', '2026-08-31', '2026-09-01', null, 'Ginásio Poliesportivo', 'Torneios esportivos Interclasses para o Ensino Médio (31/08 e 01/09).'],
          ['Término do 2º Trimestre', '2026-09-04', null, null, 'Escola FIRJAN SESI', 'Encerramento oficial das notas e atividades do 2º trimestre letivo.'],
          ['Feriado Nacional – Independência do Brasil', '2026-09-07', null, null, 'Feriado Nacional', 'Comemoração da Independência do Brasil (sem expediente escolar).'],
          ['Início do 3º Trimestre', '2026-09-08', null, null, 'Escola FIRJAN SESI', 'Abertura das aulas e conteúdos pedagógicos do 3º trimestre.'],
          ['Conselho de Classe – 2º Trimestre (Anos Iniciais)', '2026-09-09', null, null, 'Sala dos Professores', 'Reunião de avaliação do rendimento escolar dos Anos Iniciais.'],
          ['1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)', '2026-09-10', null, null, 'Salas de Aula', 'Aplicação das provas da 1ª fase da Olimpíada de Português BÊ-Á-BÁ.'],
          ['Conselho de Classe – 2º Trimestre (Ensino Médio)', '2026-09-14', null, null, 'Sala dos Professores', 'Reunião do corpo docente para fechamento pedagógico do Ensino Médio.'],
          ['Setembro Amarelo (Teatro FIRJAN SESI)', '2026-09-15', null, null, 'Teatro FIRJAN SESI', 'Palestras e dinâmicas de valorização da vida e saúde socioemocional.'],
          ['Conselho de Classe – 2º Trimestre (Anos Finais)', '2026-09-16', null, null, 'Sala dos Professores', 'Reunião de avaliação de desempenho dos alunos dos Anos Finais.'],
          ['Escola Aberta (Anos Iniciais – TARDE)', '2026-09-21', null, 'Turno da Tarde', 'Escola FIRJAN SESI Duque de Caxias', 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.'],
          ['Escola Aberta (Anos Iniciais – MANHÃ)', '2026-09-22', null, 'Turno da Manhã', 'Escola FIRJAN SESI Duque de Caxias', 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.'],
          ['Escola Aberta (Anos Finais e Ensino Médio)', '2026-09-23', '2026-09-25', 'Manhã e Tarde', 'Escola FIRJAN SESI Duque de Caxias', 'Dias de integração e vivência com as turmas de Anos Finais e Ensino Médio (23 e 25/09).'],
          ['Aulão UERJ (Teatro FIRJAN SESI)', '2026-09-24', null, '14:00 - 18:00', 'Teatro FIRJAN SESI', 'Super revisão preparatória interdisciplinar com foco no Vestibular Estadual da UERJ.'],
          ['Encontro da Família', '2026-09-26', null, '08:30 - 12:30', 'Escola FIRJAN SESI', 'Dia especial dedicado à aproximação, acolhimento e atividades entre família e escola.'],
          ['Avaliações Diversificadas (Testes Anos Iniciais e Finais)', '2026-09-28', '2026-10-02', null, 'Salas de Aula', 'Semana de aplicação de avaliações diversificadas e testes (28/09 a 02/10).'],
          ['1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)', '2026-10-03', null, null, 'Salas de Aula', 'Etapa complementar da Olimpíada de Português BÊ-Á-BÁ para os Anos Iniciais.'],
          ['Feriado Nacional – Nossa Senhora Aparecida', '2026-10-12', null, null, 'Feriado Nacional', 'Feriado Nacional de Nossa Senhora Aparecida e Dia das Crianças.'],
          ['Semana das Crianças', '2026-10-13', '2026-10-14', null, 'Pátio e Ginásio', 'Atividades recreativas, gincanas e oficinas comemorativas (13 e 14/10).'],
          ['Seminário STEAM EN JEANS', '2026-10-14', null, '09:00 - 15:00', 'Laboratório Maker / STEAM', 'Apresentação de projetos interdisciplinares de Ciência, Tecnologia, Engenharia, Artes e Matemática.'],
          ['Papo Responsa (Teatro FIRJAN SESI)', '2026-10-14', null, '14:00', 'Teatro FIRJAN SESI', 'Roda de diálogo sobre cidadania, protagonismo jovem e convivência ética.'],
          ['Dia do Professor (Feriado Escolar)', '2026-10-15', null, null, 'Escola FIRJAN SESI', 'Recesso escolar em comemoração ao Dia dos Professores e Educadores.'],
          ['Festival SESI Multicultural', '2026-10-17', null, '09:00 - 16:00', 'Escola FIRJAN SESI', 'Exposições artísticas, apresentações de dança, música e estandes culturais dos alunos.'],
          ['Aulão ENEM (Teatro FIRJAN SESI)', '2026-10-20', null, '13:30 - 17:30', 'Teatro FIRJAN SESI', 'Mega intensivão com resolução comentada de questões e dicas de redação para o ENEM.'],
          ['Janela de Aplicação do Avalia SESI II', '2026-10-27', '2026-10-30', null, 'Laboratórios de Informática e Salas', 'Período oficial de aplicação dos testes diagnósticos da rede (27 a 30/10).'],
          ['Feriado Nacional – Finados', '2026-11-02', null, null, 'Feriado Nacional', 'Feriado Nacional de Finados (sem atividades letivas).'],
          ['Feriado Nacional – Proclamação da República', '2026-11-15', null, null, 'Feriado Nacional', 'Comemoração cívica da Proclamação da República Brasileira.'],
          ['Culminância da Consciência Negra (Teatro FIRJAN SESI)', '2026-11-18', '2026-11-19', null, 'Teatro FIRJAN SESI', 'Mostra cultural, painéis reflexivos e debates temáticos sobre a Consciência Negra (18 e 19/11).'],
          ['Feriado Nacional – Dia Nacional de Zumbi e da Consciência Negra', '2026-11-20', null, null, 'Feriado Nacional', 'Feriado Nacional em celebração da ancestralidade e Consciência Negra.'],
          ['Provas do 3º Trimestre', '2026-11-23', '2026-11-27', null, 'Salas de Aula', 'Semana de avaliações e provas finais do 3º Trimestre (23 a 27/11).'],
          ['Amistoso – Esporte na Escola', '2026-11-28', null, '08:30 - 13:00', 'Ginásio Poliesportivo', 'Sábado esportivo com jogos amistosos de integração e confraternização.'],
          ['Torneio SESI de Robótica (FLL)', '2026-12-03', '2026-12-04', '08:00 - 17:00', 'Arena FIRJAN SESI', 'Competição oficial de robótica FIRST LEGO League (03 e 04/12).'],
          ['Recuperação Paralela – 3º Trimestre', '2026-12-08', '2026-12-10', null, 'Salas de Aula', 'Período de aulas de reforço e provas de recuperação do 3º Trimestre (08 a 10/12).'],
          ['Festa das Letras (1º e 5º Ano) – Teatro FIRJAN SESI', '2026-12-09', '2026-12-10', null, 'Teatro FIRJAN SESI', 'Cerimônia especial de transição e celebração literária dos anos concluintes (09 e 10/12).'],
          ['Término do 3º Trimestre', '2026-12-11', null, null, 'Escola FIRJAN SESI', 'Fechamento oficial das aulas regulares do 3º trimestre de 2026.'],
          ['Conselho de Classe – 3º Trimestre (9º Ano e 3ª Série)', '2026-12-11', null, null, 'Sala dos Professores', 'Reunião de avaliação e aprovação final das turmas concluintes do Fundamental e Médio.'],
          ['Recuperação Final', '2026-12-14', '2026-12-16', null, 'Salas de Aula', 'Plantão de estudos e aplicação das avaliações de Recuperação Final (14 a 16/12).'],
          ['Arrumação e Montagem da Formatura', '2026-12-15', null, 'A partir das 18:00', 'Teatro FIRJAN SESI', 'Preparativos técnicos, iluminação e ambientação para a formatura solene.'],
          ['Formatura do 9º Ano e da 3ª Série (Teatro FIRJAN SESI)', '2026-12-16', null, '19:00', 'Teatro FIRJAN SESI', 'Solenidade oficial de colação de grau dos formandos do Ensino Fundamental e Ensino Médio.'],
          ['Cantata de Natal (Teatro FIRJAN SESI)', '2026-12-17', null, '18:30', 'Teatro FIRJAN SESI', 'Emocionante apresentação musical natalina com coral de alunos e professores.'],
          ['Conselho de Classe – 3º Trimestre (Ensino Médio)', '2026-12-17', null, null, 'Sala dos Professores', 'Encerramento pedagógico e validação dos resultados do Ensino Médio.'],
          ['Conselho de Classe – 3º Trimestre (Anos Iniciais e Anos Finais)', '2026-12-18', null, null, 'Sala dos Professores', 'Fechamento dos diários de classe e validação de aprovação dos Anos Iniciais e Finais.'],
          ['Entrega dos Boletins', '2026-12-21', null, null, 'Secretaria Escolar / Portal', 'Disponibilização das notas finais no portal e atendimento aos responsáveis na secretaria.'],
          ['Natal', '2026-12-25', null, null, 'Feriado Nacional', 'Celebração de Natal. Boas Festas a toda a comunidade escolar SESI!']
        ];
        for (const [title, date, endDate, time, location, description] of calendar) {
          const key = `${String(title).trim().toLowerCase()}|${String(date).slice(0, 10)}`;
          if (existingKeys.has(key)) continue;
          await pg.query(
            `INSERT INTO events (title, date, end_date, time, location, category, description, status)
             VALUES ($1,$2,$3,$4,$5,'Geral',$6,'agendado')`,
            [title, date, endDate, time, location, description]
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
        `INSERT INTO events (title, date, end_date, time, location, category, description, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          body.title,
          body.date,
          body.endDate || null,
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
        'SELECT id, email, role, is_pending, password, password_hash FROM admins ORDER BY id ASC'
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
      const stored = String(data.password || data.password_hash || '').trim();
      if (!stored) {
        return send(res, 200, {
          isPending: true,
          admin: mapAdmin({ ...data, password: null, password_hash: null, is_pending: true }),
        });
      }
      if (String(password || '') !== stored) {
        return send(res, 401, { error: 'Senha incorreta. Use a senha ja cadastrada neste e-mail.' });
      }
      if (data.is_pending) {
        await pg.query('UPDATE admins SET is_pending = false WHERE id = $1', [data.id]);
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
         RETURNING id, email, role, is_pending, password, password_hash`,
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
