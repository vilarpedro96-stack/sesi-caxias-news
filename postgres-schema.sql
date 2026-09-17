-- ==============================================================================
-- SESI NEWS - ESQUEMA COMPLETO POSTGRESQL
-- Compatível com: Vercel Postgres, Neon, Railway, Render, Supabase, Docker, etc.
-- ==============================================================================

-- 1. Tabela de Notícias (articles)
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Geral',
    date VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Eventos / Agenda (events)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Geral',
    description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Vídeos e Transmissões (videos)
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    is_live BOOLEAN DEFAULT false,
    category VARCHAR(100) NOT NULL DEFAULT 'Geral',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Administradores (admins)
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    password VARCHAR(255),
    is_pending BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inserir dados padrão caso o banco esteja vazio
INSERT INTO articles (title, summary, content, image, category, date)
VALUES 
(
    'Alunos do SESI vencem etapa regional de Robótica com projeto inovador',
    'Equipe desenvolveu robô autônomo com foco em sustentabilidade e eficiência energética, conquistando o 1º lugar.',
    'A equipe de robótica da nossa escola alcançou o primeiro lugar na etapa regional da First Lego League (FLL). Com o tema sustentabilidade, os alunos desenvolveram um robô totalmente autônomo capaz de realizar tarefas complexas com gasto mínimo de energia.\n\n"Foi um trabalho em equipe incrível de mais de seis meses de dedicação", comentou o orientador do projeto. A equipe agora se prepara para representar a instituição na etapa nacional em Brasília.',
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
),
(
    'Inscrições abertas para a Feira de Ciências e Tecnologia 2024',
    'Estudantes de todas as turmas podem inscrever projetos interdisciplinares até o final deste mês.',
    'A Feira de Ciências deste ano traz o tema "Inteligência Artificial e o Futuro da Educação". As inscrições podem ser feitas diretamente com os professores orientadores de cada área.',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    'Educação',
    '15 de Março, 2024'
),
(
    'Time de Futsal do SESI conquista vaga na grande final dos Jogos Escolares',
    'Após vitória emocionante nos pênaltis, a equipe garante presença na disputa pelo título estadual.',
    'Num jogo acirrado contra a equipe municipal, nossos atletas demonstraram garra e espírito de equipe, vencendo a semifinal e garantindo a vaga para a grande final no próximo sábado.',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    'Esportes',
    '12 de Março, 2024'
)
ON CONFLICT DO NOTHING;

INSERT INTO events (title, date, time, location, category, description)
VALUES
('Reunião de Pais e Mestres - 1º Bimestre', '2024-04-10', '19:00', 'Auditório Principal', 'Institucional', 'Encontro para discussão do rendimento pedagógico e metas do bimestre.'),
('Feira de Ciências e Tecnologia 2024', '2024-04-25', '08:00 às 17:00', 'Ginásio Poliesportivo', 'Educação', 'Exposição dos projetos dos alunos de todas as séries.'),
('Final dos Jogos Escolares Interclasses', '2024-05-04', '09:00', 'Quadra Coberta', 'Esportes', 'Disputa final dos torneios de Futsal, Vôlei e Queimada.'),
('Palestra: Profissões do Futuro & IA', '2024-05-18', '14:00', 'Sala Multimídia', 'Carreira', 'Palestra especial para alunos do Ensino Médio com especialistas convidados.')
ON CONFLICT DO NOTHING;

INSERT INTO videos (title, url, is_live, category)
VALUES
('Transmissão ao Vivo: Cerimônia de Abertura dos Jogos SESI 2024', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 'Ao Vivo'),
('Destaques da Feira de Robótica e Sustentabilidade', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 'Tecnologia'),
('Melhores Momentos do Festival de Música e Dança', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', false, 'Cultura')
ON CONFLICT DO NOTHING;

INSERT INTO admins (email, role, password, is_pending)
VALUES
('admin@sesi.org.br', 'super_admin', 'admin123', false),
('coordenacao@sesi.org.br', 'admin', null, true)
ON CONFLICT (email) DO NOTHING;
