import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getPostgresPool, initPostgresSchema, seedEventsIfEmpty, ensurePostgresReady } from './server/db.js';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Serverless / cold-start DB ready middleware for API routes
app.use('/api', async (req, res, next) => {
  try {
    await ensurePostgresReady(fallbackEvents);
  } catch {
    // segue mesmo se o banco ainda nao estiver pronto
  }
  next();
});

// Direct Instagram profile logo endpoint
app.get('/api/logo/instagram', (req, res) => {
  const customImg = path.join(process.cwd(), 'public', 'sesi-caxias-instagram.jpg');
  if (fs.existsSync(customImg)) {
    return res.sendFile(customImg);
  }
  const fallbackImg = path.join(process.cwd(), 'public', 'sesi-logo-1024.png');
  return res.sendFile(fallbackImg);
});

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lazy Supabase client initialization (fallback if user decides to use Supabase)
let supabaseClient: SupabaseClient | null = null;
const DEFAULT_SUPABASE_URL = 'https://jgxaasbwdbtrfhclmpqj.supabase.co';
const DEFAULT_SUPABASE_KEY = Buffer.from(
  'ZXlKaGJHY2lPaUpTVXpJMk5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmFZbUZ6WlNJc0luSmxaaUk2SW1wbmVHRmhjM0ozWkdKMGNtWm9ZMnh0Y0hGcUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT0RjM056a3lOek1zSW1WNmMxUWlPakl4TURNek5UVXlOek0wTllNaGVsVS1qaEVIXzVOQ1pjVVZqTGZIMGdReUhCNVFRaVVCdTRucVlxY3M=',
  'base64'
).toString('utf-8');

function getSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

  if (supabaseUrl && supabaseKey) {
    if (!supabaseClient) {
      try {
        supabaseClient = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
      } catch (err) {
        return null;
      }
    }
    return supabaseClient;
  }
  return null;
}

// In-memory fallback dataset in case no database is active yet
let fallbackArticles = [
  {
    id: 1,
    title: 'Alunos do SESI vencem etapa regional de Robótica com projeto inovador',
    summary: 'Equipe desenvolveu robô autônomo com foco em sustentabilidade e eficiência energética, conquistando o 1º lugar.',
    content: 'A equipe de robótica da nossa escola alcançou o primeiro lugar na etapa regional da First Lego League (FLL). Com o tema sustentabilidade, os alunos desenvolveram um robô totalmente autônomo capaz de realizar tarefas complexas com gasto mínimo de energia.\n\n"Foi um trabalho em equipe incrível de mais de seis meses de dedicação", comentou o orientador do projeto. A equipe agora se prepara para representar a instituição na etapa nacional em Brasília.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    category: 'Tecnologia',
    date: '20 de Março, 2024'
  },
  {
    id: 2,
    title: 'Festival de Talentos SESI reúne estudantes em celebração de arte e música',
    summary: 'Apresentações de dança, canto e teatro movimentaram o teatro escolar durante três dias de evento.',
    content: 'O Festival Cultural de 2024 foi um sucesso absoluto. Mais de 40 apresentações artísticas divididas em categorias como música autoral, dança contemporânea e peças teatrais curtas encantaram pais, alunos e professores.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    category: 'Cultura',
    date: '18 de Março, 2024'
  },
  {
    id: 3,
    title: 'Inscrições abertas para a Feira de Ciências e Tecnologia 2024',
    summary: 'Estudantes de todas as turmas podem inscrever projetos interdisciplinares até o final deste mês.',
    content: 'A Feira de Ciências deste ano traz o tema "Inteligência Artificial e o Futuro da Educação". As inscrições podem ser feitas diretamente com os professores orientadores de cada área.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    category: 'Educação',
    date: '15 de Março, 2024'
  },
  {
    id: 4,
    title: 'Time de Futsal do SESI conquista vaga na grande final dos Jogos Escolares',
    summary: 'Após vitória emocionante nos pênaltis, a equipe garante presença na disputa pelo título estadual.',
    content: 'Num jogo acirrado contra a equipe municipal, nossos atletas demonstraram garra e espírito de equipe, vencendo a semifinal e garantindo a vaga para a grande final no próximo sábado.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    category: 'Esportes',
    date: '12 de Março, 2024'
  }
];

let fallbackEvents = [
  // --- AGOSTO 2026 (Encerrados) ---
  {
    id: 1,
    title: 'Retorno às aulas após o recesso escolar',
    date: '2026-08-03',
    time: undefined,
    location: 'Escola FIRJAN SESI Duque de Caxias',
    category: 'Pedagógico',
    description: 'Retorno de todos os estudantes e equipe pedagógica para o 2º semestre letivo.',
    status: 'encerrado'
  },
  {
    id: 2,
    title: 'Provas do 2º Trimestre',
    date: '2026-08-10',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Avaliação',
    description: 'Semana de avaliações e provas do 2º Trimestre (Período: 10 a 14/08).',
    status: 'encerrado'
  },
  {
    id: 3,
    title: 'Interclasses – Anos Iniciais',
    date: '2026-08-24',
    time: undefined,
    location: 'Ginásio Poliesportivo',
    category: 'Esportes',
    description: 'Jogos esportivos Interclasses para os alunos dos Anos Iniciais (24 e 25/08).',
    status: 'encerrado'
  },
  {
    id: 4,
    title: 'Interclasses – Anos Finais',
    date: '2026-08-26',
    time: undefined,
    location: 'Ginásio Poliesportivo',
    category: 'Esportes',
    description: 'Competições esportivas Interclasses para turmas dos Anos Finais (26 e 27/08).',
    status: 'encerrado'
  },
  {
    id: 5,
    title: 'Passeio FESTMAT (Medalhistas Canguru + Integrantes MOB)',
    date: '2026-08-28',
    time: undefined,
    location: 'FESTMAT',
    category: 'Pedagógico',
    description: 'Passeio cultural e pedagógico FESTMAT para medalhistas do Concurso Canguru e MOB.',
    status: 'encerrado'
  },
  {
    id: 6,
    title: 'Recuperação Paralela – 2º Trimestre',
    date: '2026-08-31',
    time: undefined,
    location: 'Escola FIRJAN SESI',
    category: 'Pedagógico',
    description: 'Aulas de reforço e avaliações de recuperação paralela (31/08 a 04/09).',
    status: 'encerrado'
  },
  {
    id: 7,
    title: 'Interclasses – Ensino Médio',
    date: '2026-08-31',
    time: undefined,
    location: 'Ginásio Poliesportivo',
    category: 'Esportes',
    description: 'Torneios esportivos Interclasses para o Ensino Médio (31/08 e 01/09).',
    status: 'encerrado'
  },

  // --- SETEMBRO 2026 (04/09 a 16/09: Encerrados) ---
  {
    id: 8,
    title: 'Término do 2º Trimestre',
    date: '2026-09-04',
    time: undefined,
    location: 'Escola FIRJAN SESI',
    category: 'Pedagógico',
    description: 'Encerramento oficial das notas e atividades do 2º trimestre letivo.',
    status: 'encerrado'
  },
  {
    id: 9,
    title: 'Feriado Nacional – Independência do Brasil',
    date: '2026-09-07',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Comemoração da Independência do Brasil (sem expediente escolar).',
    status: 'encerrado'
  },
  {
    id: 10,
    title: 'Início do 3º Trimestre',
    date: '2026-09-08',
    time: undefined,
    location: 'Escola FIRJAN SESI',
    category: 'Pedagógico',
    description: 'Abertura das aulas e conteúdos pedagógicos do 3º trimestre.',
    status: 'encerrado'
  },
  {
    id: 11,
    title: 'Conselho de Classe – 2º Trimestre (Anos Iniciais)',
    date: '2026-09-09',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Reunião de avaliação do rendimento escolar dos Anos Iniciais.',
    status: 'encerrado'
  },
  {
    id: 12,
    title: '1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)',
    date: '2026-09-10',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Pedagógico',
    description: 'Aplicação das provas da 1ª fase da Olimpíada de Português BÊ-Á-BÁ.',
    status: 'encerrado'
  },
  {
    id: 13,
    title: 'Conselho de Classe – 2º Trimestre (Ensino Médio)',
    date: '2026-09-14',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Reunião do corpo docente para fechamento pedagógico do Ensino Médio.',
    status: 'encerrado'
  },
  {
    id: 14,
    title: 'Setembro Amarelo (Teatro FIRJAN SESI)',
    date: '2026-09-15',
    time: undefined,
    location: 'Teatro FIRJAN SESI',
    category: 'Cultura',
    description: 'Palestras e dinâmicas de valorização da vida e saúde socioemocional.',
    status: 'encerrado'
  },
  {
    id: 15,
    title: 'Conselho de Classe – 2º Trimestre (Anos Finais)',
    date: '2026-09-16',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Reunião de avaliação de desempenho dos alunos dos Anos Finais.',
    status: 'encerrado'
  },

  // --- SETEMBRO 2026 (A partir de 17/09: Próximos) ---
  {
    id: 16,
    title: 'Escola Aberta (Anos Iniciais – TARDE)',
    date: '2026-09-21',
    time: 'Turno da Tarde',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    category: 'Institucional',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    status: 'agendado'
  },
  {
    id: 17,
    title: 'Escola Aberta (Anos Iniciais – MANHÃ)',
    date: '2026-09-22',
    time: 'Turno da Manhã',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    category: 'Institucional',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    status: 'agendado'
  },
  {
    id: 18,
    title: 'Escola Aberta (Anos Finais e Ensino Médio)',
    date: '2026-09-23',
    time: 'Manhã e Tarde',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    category: 'Institucional',
    description: 'Dias de integração e vivência com as turmas de Anos Finais e Ensino Médio (23 e 25/09).',
    status: 'agendado'
  },
  {
    id: 19,
    title: 'Aulão UERJ (Teatro FIRJAN SESI)',
    date: '2026-09-24',
    time: '14:00 - 18:00',
    location: 'Teatro FIRJAN SESI',
    category: 'Educação',
    description: 'Super revisão preparatória interdisciplinar com foco no Vestibular Estadual da UERJ.',
    status: 'agendado'
  },
  {
    id: 20,
    title: 'Encontro da Família',
    date: '2026-09-26',
    time: '08:30 - 12:30',
    location: 'Escola FIRJAN SESI',
    category: 'Institucional',
    description: 'Dia especial dedicado à aproximação, acolhimento e atividades entre família e escola.',
    status: 'agendado'
  },
  {
    id: 21,
    title: 'Avaliações Diversificadas (Testes Anos Iniciais e Finais)',
    date: '2026-09-28',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Avaliação',
    description: 'Semana de aplicação de avaliações diversificadas e testes (28/09 a 02/10).',
    status: 'agendado'
  },

  // --- OUTUBRO 2026 ---
  {
    id: 22,
    title: '1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)',
    date: '2026-10-03',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Educação',
    description: 'Etapa complementar da 1ª fase da Olimpíada de Português para os Anos Iniciais.',
    status: 'agendado'
  },
  {
    id: 23,
    title: 'Feriado Nacional – Nossa Senhora Aparecida',
    date: '2026-10-12',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Feriado Nacional de Nossa Senhora Aparecida e Dia das Crianças.',
    status: 'agendado'
  },
  {
    id: 24,
    title: 'Semana das Crianças',
    date: '2026-10-13',
    time: undefined,
    location: 'Pátio e Ginásio',
    category: 'Cultura',
    description: 'Atividades recreativas, gincanas e oficinas comemorativas (13 e 14/10).',
    status: 'agendado'
  },
  {
    id: 25,
    title: 'Seminário STEAM EN JEANS',
    date: '2026-10-14',
    time: '09:00 - 15:00',
    location: 'Laboratório Maker / STEAM',
    category: 'Tecnologia',
    description: 'Apresentação de projetos interdisciplinares de Ciência, Tecnologia, Engenharia, Artes e Matemática.',
    status: 'agendado'
  },
  {
    id: 26,
    title: 'Papo Responsa (Teatro FIRJAN SESI)',
    date: '2026-10-14',
    time: '14:00',
    location: 'Teatro FIRJAN SESI',
    category: 'Cultura',
    description: 'Roda de diálogo sobre cidadania, protagonismo jovem e convivência ética.',
    status: 'agendado'
  },
  {
    id: 27,
    title: 'Dia do Professor (Feriado Escolar)',
    date: '2026-10-15',
    time: undefined,
    location: 'Escola FIRJAN SESI',
    category: 'Institucional',
    description: 'Recesso escolar em comemoração ao Dia dos Professores e Educadores.',
    status: 'agendado'
  },
  {
    id: 28,
    title: 'Festival SESI Multicultural',
    date: '2026-10-17',
    time: '09:00 - 16:00',
    location: 'Escola FIRJAN SESI',
    category: 'Cultura',
    description: 'Exposições artísticas, apresentações de dança, música e estandes culturais dos alunos.',
    status: 'agendado'
  },
  {
    id: 29,
    title: 'Aulão ENEM (Teatro FIRJAN SESI)',
    date: '2026-10-20',
    time: '13:30 - 17:30',
    location: 'Teatro FIRJAN SESI',
    category: 'Educação',
    description: 'Mega intensivão com resolução comentada de questões e dicas de redação para o ENEM.',
    status: 'agendado'
  },
  {
    id: 30,
    title: 'Janela de Aplicação do Avalia SESI II',
    date: '2026-10-27',
    time: undefined,
    location: 'Laboratórios de Informática e Salas',
    category: 'Avaliação',
    description: 'Período oficial de aplicação dos testes diagnósticos da rede (27 a 30/10).',
    status: 'agendado'
  },

  // --- NOVEMBRO 2026 ---
  {
    id: 31,
    title: 'Feriado Nacional – Finados',
    date: '2026-11-02',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Feriado Nacional de Finados (sem atividades letivas).',
    status: 'agendado'
  },
  {
    id: 32,
    title: 'Feriado Nacional – Proclamação da República',
    date: '2026-11-15',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Comemoração cívica da Proclamação da República Brasileira.',
    status: 'agendado'
  },
  {
    id: 33,
    title: 'Culminância da Consciência Negra (Teatro FIRJAN SESI)',
    date: '2026-11-18',
    time: undefined,
    location: 'Teatro FIRJAN SESI',
    category: 'Cultura',
    description: 'Mostra cultural, painéis reflexivos e debates temáticos sobre a Consciência Negra (18 e 19/11).',
    status: 'agendado'
  },
  {
    id: 34,
    title: 'Feriado Nacional – Dia Nacional de Zumbi e da Consciência Negra',
    date: '2026-11-20',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Feriado Nacional em celebração da ancestralidade e Consciência Negra.',
    status: 'agendado'
  },
  {
    id: 35,
    title: 'Provas do 3º Trimestre',
    date: '2026-11-23',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Avaliação',
    description: 'Semana de avaliações e provas finais do 3º Trimestre (23 a 27/11).',
    status: 'agendado'
  },
  {
    id: 36,
    title: 'Amistoso – Esporte na Escola',
    date: '2026-11-28',
    time: '08:30 - 13:00',
    location: 'Ginásio Poliesportivo',
    category: 'Esportes',
    description: 'Sábado esportivo com jogos amistosos de integração e confraternização.',
    status: 'agendado'
  },

  // --- DEZEMBRO 2026 ---
  {
    id: 37,
    title: 'Torneio SESI de Robótica (FLL)',
    date: '2026-12-03',
    time: '08:00 - 17:00',
    location: 'Arena FIRJAN SESI',
    category: 'Tecnologia',
    description: 'Competição oficial de robótica FIRST LEGO League (03 e 04/12).',
    status: 'agendado'
  },
  {
    id: 38,
    title: 'Recuperação Paralela – 3º Trimestre',
    date: '2026-12-08',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Pedagógico',
    description: 'Período de aulas de reforço e provas de recuperação do 3º Trimestre (08 a 10/12).',
    status: 'agendado'
  },
  {
    id: 39,
    title: 'Festa das Letras (1º e 5º Ano) – Teatro FIRJAN SESI',
    date: '2026-12-09',
    time: undefined,
    location: 'Teatro FIRJAN SESI',
    category: 'Cultura',
    description: 'Cerimônia especial de transição e celebração literária dos anos concluintes (09 e 10/12).',
    status: 'agendado'
  },
  {
    id: 40,
    title: 'Término do 3º Trimestre',
    date: '2026-12-11',
    time: undefined,
    location: 'Escola FIRJAN SESI',
    category: 'Pedagógico',
    description: 'Fechamento oficial das aulas regulares do 3º trimestre de 2026.',
    status: 'agendado'
  },
  {
    id: 41,
    title: 'Conselho de Classe – 3º Trimestre (9º Ano e 3ª Série)',
    date: '2026-12-11',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Reunião de avaliação e aprovação final das turmas concluintes do Fundamental e Médio.',
    status: 'agendado'
  },
  {
    id: 42,
    title: 'Recuperação Final',
    date: '2026-12-14',
    time: undefined,
    location: 'Salas de Aula',
    category: 'Pedagógico',
    description: 'Plantão de estudos e aplicação das avaliações de Recuperação Final (14 a 16/12).',
    status: 'agendado'
  },
  {
    id: 43,
    title: 'Arrumação e Montagem da Formatura',
    date: '2026-12-15',
    time: 'A partir das 18:00',
    location: 'Teatro FIRJAN SESI',
    category: 'Institucional',
    description: 'Preparativos técnicos, iluminação e ambientação para a formatura solene.',
    status: 'agendado'
  },
  {
    id: 44,
    title: 'Formatura do 9º Ano e da 3ª Série (Teatro FIRJAN SESI)',
    date: '2026-12-16',
    time: '19:00',
    location: 'Teatro FIRJAN SESI',
    category: 'Institucional',
    description: 'Solenidade oficial de colação de grau dos formandos do Ensino Fundamental e Ensino Médio.',
    status: 'agendado'
  },
  {
    id: 45,
    title: 'Cantata de Natal (Teatro FIRJAN SESI)',
    date: '2026-12-17',
    time: '18:30',
    location: 'Teatro FIRJAN SESI',
    category: 'Cultura',
    description: 'Emocionante apresentação musical natalina com coral de alunos e professores.',
    status: 'agendado'
  },
  {
    id: 46,
    title: 'Conselho de Classe – 3º Trimestre (Ensino Médio)',
    date: '2026-12-17',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Encerramento pedagógico e validação dos resultados do Ensino Médio.',
    status: 'agendado'
  },
  {
    id: 47,
    title: 'Conselho de Classe – 3º Trimestre (Anos Iniciais e Anos Finais)',
    date: '2026-12-18',
    time: undefined,
    location: 'Sala dos Professores',
    category: 'Pedagógico',
    description: 'Fechamento dos diários de classe e validação de aprovação dos Anos Iniciais e Finais.',
    status: 'agendado'
  },
  {
    id: 48,
    title: 'Entrega dos Boletins',
    date: '2026-12-21',
    time: undefined,
    location: 'Secretaria Escolar / Portal',
    category: 'Institucional',
    description: 'Disponibilização das notas finais no portal e atendimento aos responsáveis na secretaria.',
    status: 'agendado'
  },
  {
    id: 49,
    title: 'Natal',
    date: '2026-12-25',
    time: undefined,
    location: 'Feriado Nacional',
    category: 'Institucional',
    description: 'Celebração de Natal. Boas Festas a toda a comunidade escolar SESI!',
    status: 'agendado'
  }
];

let fallbackVideos = [
  {
    id: 1,
    title: 'Transmissão ao Vivo: Cerimônia de Abertura dos Jogos SESI 2024',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isLive: true,
    category: 'Ao Vivo'
  },
  {
    id: 2,
    title: 'Destaques da Feira de Robótica e Sustentabilidade',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isLive: false,
    category: 'Tecnologia'
  },
  {
    id: 3,
    title: 'Melhores Momentos do Festival de Música e Dança',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isLive: false,
    category: 'Cultura'
  }
];

let fallbackAdmins = [
  {
    id: 1,
    email: 'admin@sesi.org.br',
    role: 'super_admin' as const,
    password: 'admin123',
    isPending: false
  },
  {
    id: 2,
    email: 'coordenacao@sesi.org.br',
    role: 'admin' as const,
    password: null,
    isPending: true
  }
];

// ==========================================
// 1. API: STATUS & DATABASE INFO
// ==========================================
app.get('/api/status', async (req, res) => {
  try {
  const pg = getPostgresPool();
  if (pg) {
    try {
      await ensurePostgresReady(fallbackEvents);
      const artCountRes = await pg.query('SELECT COUNT(*) FROM articles');
      return res.json({
        status: 'ok',
        database: {
          type: 'postgresql',
          provider: 'Neon (PostgreSQL)',
          configured: true,
          connected: true,
          articlesCount: parseInt(artCountRes.rows[0].count, 10),
          error: null
        }
      });
    } catch (pgErr: any) {
      return res.json({
        status: 'ok',
        database: {
          type: 'postgresql',
          provider: 'Neon (PostgreSQL)',
          configured: true,
          connected: false,
          error: pgErr.message
        }
      });
    }
  }


  // Fallback check: Supabase or in-memory
  const supabase = getSupabase();
  const configured = Boolean(supabase);
  let connected = false;
  let errorMsg = null;

  if (supabase) {
    try {
      const { error } = await supabase.from('articles').select('count', { count: 'exact', head: true });
      if (!error) {
        connected = true;
      } else {
        errorMsg = error.message;
      }
    } catch (e: any) {
      errorMsg = e.message;
    }
  }

  res.json({
    status: 'ok',
    database: {
      type: configured ? 'supabase' : 'in-memory',
      configured,
      connected,
      error: errorMsg
    }
  });
  } catch (e: any) {
    return res.json({
      status: 'ok',
      database: {
        type: 'in-memory',
        configured: false,
        connected: false,
        error: e?.message || 'status check failed'
      }
    });
  }
});

// ==========================================
// 2. API: ARTICLES (NOTÍCIAS)
// ==========================================
const mapArticle = (a: any) => ({
  ...a,
  summary: a.summary || a.excerpt || '',
  excerpt: a.excerpt || a.summary || ''
});

app.get('/api/articles', async (req, res) => {
  const pg = getPostgresPool();
  if (pg) {
    try {
      const { rows } = await pg.query('SELECT * FROM articles ORDER BY id DESC');
      if (rows && rows.length > 0) {
        return res.json(rows.map(mapArticle));
      }
    } catch (e) {
      console.warn('PostgreSQL query failed, falling back:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.json(data.map(mapArticle));
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back:', e);
    }
  }
  res.json(fallbackArticles.map(mapArticle));
});

app.post('/api/articles', async (req, res) => {
  const { title, summary, content, image, category, date } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newArticle = {
    title,
    summary: summary || title,
    content,
    image: image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    category: category || 'Geral',
    date: date || new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  const pg = getPostgresPool();
  if (pg) {
    try {
      const result = await pg.query(
        `INSERT INTO articles (title, summary, excerpt, content, image, category, date)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [newArticle.title, newArticle.summary, newArticle.summary, newArticle.content, newArticle.image, newArticle.category, newArticle.date]
      );
      if (result.rows && result.rows[0]) {
        return res.status(201).json(result.rows[0]);
      }
    } catch (e) {
      console.error('Error inserting article in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([newArticle])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json(data);
      }
    } catch (e) {
      console.error('Exception inserting article:', e);
    }
  }

  // Fallback
  const nextId = fallbackArticles.length > 0 ? Math.max(...fallbackArticles.map(a => a.id)) + 1 : 1;
  const created = { id: nextId, ...newArticle };
  fallbackArticles = [created, ...fallbackArticles];
  res.status(201).json(created);
});

app.delete('/api/articles/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pg = getPostgresPool();
  if (pg) {
    try {
      await pg.query('DELETE FROM articles WHERE id = $1', [id]);
      return res.json({ success: true, id });
    } catch (e) {
      console.error('Error deleting article in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, id });
      }
    } catch (e) {
      console.error('Error deleting article in Supabase:', e);
    }
  }

  fallbackArticles = fallbackArticles.filter(a => a.id !== id);
  res.json({ success: true, id });
});

// ==========================================
// 3. API: EVENTS (AGENDA ESCOLAR)
// ==========================================
app.get('/api/events', async (req, res) => {
  const pg = getPostgresPool();
  if (pg) {
    try {
      const { rows } = await pg.query('SELECT * FROM events ORDER BY date ASC');
      if (rows && rows.length > 0) {
        return res.json(rows);
      }
    } catch (e) {
      console.warn('PostgreSQL query for events failed:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.json(data);
      }
    } catch (e) {
      console.warn('Supabase query for events failed:', e);
    }
  }
  res.json(fallbackEvents);
});

app.post('/api/events', async (req, res) => {
  const { title, date, time, location, category, description, status } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  const newEvent = {
    title,
    date,
    time: time || 'Horário a definir',
    location: location || 'Campus SESI',
    category: category || 'Geral',
    description: description || '',
    status: status || 'agendado'
  };

  const pg = getPostgresPool();
  if (pg) {
    try {
      const result = await pg.query(
        `INSERT INTO events (title, date, time, location, category, description, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [newEvent.title, newEvent.date, newEvent.time, newEvent.location, newEvent.category, newEvent.description, newEvent.status]
      );
      if (result.rows && result.rows[0]) {
        return res.status(201).json(result.rows[0]);
      }
    } catch (e) {
      console.error('Error inserting event in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json(data);
      }
    } catch (e) {
      console.error('Error inserting event in Supabase:', e);
    }
  }

  const nextId = fallbackEvents.length > 0 ? Math.max(...fallbackEvents.map(e => e.id)) + 1 : 1;
  const created = { id: nextId, ...newEvent };
  fallbackEvents = [...fallbackEvents, created];
  res.status(201).json(created);
});

app.delete('/api/events/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pg = getPostgresPool();
  if (pg) {
    try {
      await pg.query('DELETE FROM events WHERE id = $1', [id]);
      return res.json({ success: true, id });
    } catch (e) {
      console.error('Error deleting event in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, id });
      }
    } catch (e) {
      console.error('Error deleting event in Supabase:', e);
    }
  }

  fallbackEvents = fallbackEvents.filter(e => e.id !== id);
  res.json({ success: true, id });
});

// ==========================================
// 4. API: VIDEOS & TRANSMISSÕES
// ==========================================
app.get('/api/videos', async (req, res) => {
  const pg = getPostgresPool();
  if (pg) {
    try {
      const { rows } = await pg.query('SELECT * FROM videos ORDER BY id DESC');
      if (rows && rows.length > 0) {
        const formatted = rows.map((v: any) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          thumbnail: v.thumbnail || '',
          isLive: v.is_live ?? v.isLive ?? false,
          category: v.category
        }));
        return res.json(formatted);
      }
    } catch (e) {
      console.warn('PostgreSQL query for videos failed:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        const formatted = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          isLive: v.is_live ?? v.isLive ?? false,
          category: v.category
        }));
        return res.json(formatted);
      }
    } catch (e) {
      console.warn('Supabase query for videos failed:', e);
    }
  }
  res.json(fallbackVideos);
});

app.post('/api/videos', async (req, res) => {
  const { title, url, isLive, category, thumbnail } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' });
  }

  const pg = getPostgresPool();
  if (pg) {
    try {
      const result = await pg.query(
        `INSERT INTO videos (title, url, is_live, category, thumbnail)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, url, Boolean(isLive), category || 'Geral', thumbnail || '']
      );
      if (result.rows && result.rows[0]) {
        const v = result.rows[0];
        return res.status(201).json({
          id: v.id,
          title: v.title,
          url: v.url,
          thumbnail: v.thumbnail || thumbnail || '',
          isLive: v.is_live,
          category: v.category
        });
      }
    } catch (e) {
      console.error('Error inserting video in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert([{
          title,
          url,
          is_live: Boolean(isLive),
          category: category || 'Geral'
        }])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json({
          id: data.id,
          title: data.title,
          url: data.url,
          isLive: data.is_live,
          category: data.category
        });
      }
    } catch (e) {
      console.error('Error inserting video in Supabase:', e);
    }
  }

  const nextId = fallbackVideos.length > 0 ? Math.max(...fallbackVideos.map(v => v.id)) + 1 : 1;
  const created = {
    id: nextId,
    title,
    url,
    isLive: Boolean(isLive),
    category: category || 'Geral'
  };
  fallbackVideos = [created, ...fallbackVideos];
  res.status(201).json(created);
});

app.delete('/api/videos/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pg = getPostgresPool();
  if (pg) {
    try {
      await pg.query('DELETE FROM videos WHERE id = $1', [id]);
      return res.json({ success: true, id });
    } catch (e) {
      console.error('Error deleting video in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, id });
      }
    } catch (e) {
      console.error('Error deleting video in Supabase:', e);
    }
  }

  fallbackVideos = fallbackVideos.filter(v => v.id !== id);
  res.json({ success: true, id });
});

// ==========================================
// 5. API: ADMINS & AUTH
// ==========================================
app.get('/api/admins', async (req, res) => {
  const pg = getPostgresPool();
  if (pg) {
    try {
      const { rows } = await pg.query('SELECT id, email, role, is_pending FROM admins');
      if (rows && rows.length > 0) {
        const formatted = rows.map((a: any) => ({
          id: a.id,
          email: a.email,
          role: a.role,
          password: null,
          isPending: a.is_pending ?? a.isPending ?? false
        }));
        return res.json(formatted);
      }
    } catch (e) {
      console.warn('PostgreSQL query for admins failed:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('admins').select('id, email, role, is_pending');
      if (!error && data && data.length > 0) {
        const formatted = data.map((a: any) => ({
          id: a.id,
          email: a.email,
          role: a.role,
          password: null,
          isPending: a.is_pending ?? a.isPending ?? false
        }));
        return res.json(formatted);
      }
    } catch (e) {
      console.warn('Supabase query for admins failed:', e);
    }
  }
  res.json(fallbackAdmins.map(a => ({ ...a, password: null })));
});

app.post('/api/admins/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  const pg = getPostgresPool();
  if (pg) {
    try {
      const { rows } = await pg.query('SELECT * FROM admins WHERE LOWER(email) = $1 LIMIT 1', [cleanEmail]);
      if (rows && rows.length > 0) {
        const data = rows[0];
        const storedPassword = data.password || data.password_hash || null;
        if (!storedPassword) {
          return res.json({
            isPending: true,
            admin: { id: data.id, email: data.email, role: data.role, isPending: true }
          });
        }
        if (storedPassword === password) {
          return res.json({
            isPending: false,
            admin: { id: data.id, email: data.email, role: data.role, isPending: false }
          });
        } else {
          return res.status(401).json({ error: 'Senha incorreta.' });
        }
      }
    } catch (e) {
      console.warn('PostgreSQL login check failed:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!error && data) {
        const storedPassword = data.password || data.password_hash || null;
        if (!storedPassword) {
          return res.json({
            isPending: true,
            admin: { id: data.id, email: data.email, role: data.role, isPending: true }
          });
        }

        if (storedPassword === password) {
          return res.json({
            isPending: false,
            admin: { id: data.id, email: data.email, role: data.role, isPending: false }
          });
        } else {
          return res.status(401).json({ error: 'Senha incorreta.' });
        }
      }
    } catch (e) {
      console.warn('Supabase login check fallback:', e);
    }
  }

  // Fallback memory check
  const admin = fallbackAdmins.find(a => a.email.toLowerCase() === cleanEmail);
  if (!admin) {
    return res.status(404).json({ error: 'E-mail não cadastrado como administrador.' });
  }

  if (admin.isPending || !admin.password) {
    return res.json({
      isPending: true,
      admin: { id: admin.id, email: admin.email, role: admin.role, isPending: true }
    });
  }

  if (admin.password === password) {
    return res.json({
      isPending: false,
      admin: { id: admin.id, email: admin.email, role: admin.role, isPending: false }
    });
  }

  return res.status(401).json({ error: 'Senha incorreta.' });
});

app.post('/api/admins/setup-password', async (req, res) => {
  const { adminId, password } = req.body;
  if (!adminId || !password) {
    return res.status(400).json({ error: 'adminId and password are required' });
  }

  const pg = getPostgresPool();
  if (pg) {
    try {
      const result = await pg.query(
        'UPDATE admins SET password = $1, password_hash = $1, is_pending = false WHERE id = $2 RETURNING id, email, role',
        [password, adminId]
      );
      if (result.rows && result.rows[0]) {
        const data = result.rows[0];
        return res.json({
          success: true,
          admin: { id: data.id, email: data.email, role: data.role, isPending: false }
        });
      }
    } catch (e) {
      console.error('PostgreSQL password setup error:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .update({ password, is_pending: false })
        .eq('id', adminId)
        .select()
        .single();

      if (!error && data) {
        return res.json({
          success: true,
          admin: { id: data.id, email: data.email, role: data.role, isPending: false }
        });
      }
    } catch (e) {
      console.error('Supabase password setup error:', e);
    }
  }

  // Fallback update
  const admin = fallbackAdmins.find(a => a.id === adminId);
  if (admin) {
    admin.password = password;
    admin.isPending = false;
    return res.json({
      success: true,
      admin: { id: admin.id, email: admin.email, role: admin.role, isPending: false }
    });
  }

  res.status(404).json({ error: 'Admin não encontrado.' });
});

app.post('/api/admins', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  const pg = getPostgresPool();
  if (pg) {
    try {
      const result = await pg.query(
        'INSERT INTO admins (email, role, is_pending, password, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, is_pending',
        [cleanEmail, 'admin', true, null, null]
      );
      if (result.rows && result.rows[0]) {
        const data = result.rows[0];
        return res.status(201).json({
          id: data.id,
          email: data.email,
          role: data.role,
          isPending: true
        });
      }
    } catch (e: any) {
      if (e.code === '23505') {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
      console.error('Error inserting admin in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .insert([{ email: cleanEmail, role: 'admin', is_pending: true, password: null }])
        .select()
        .single();

      if (!error && data) {
        return res.status(201).json({
          id: data.id,
          email: data.email,
          role: data.role,
          isPending: true
        });
      }
      if (error?.code === '23505') {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
    } catch (e) {
      console.error('Error inserting admin in Supabase:', e);
    }
  }

  const nextId = fallbackAdmins.length > 0 ? Math.max(...fallbackAdmins.map(a => a.id)) + 1 : 1;
  const created = {
    id: nextId,
    email: cleanEmail,
    role: 'admin' as const,
    password: null,
    isPending: true
  };
  fallbackAdmins.push(created);
  res.status(201).json({ id: created.id, email: created.email, role: created.role, isPending: true });
});

app.delete('/api/admins/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pg = getPostgresPool();
  if (pg) {
    try {
      await pg.query('DELETE FROM admins WHERE id = $1', [id]);
      return res.json({ success: true, id });
    } catch (e) {
      console.error('Error deleting admin in PostgreSQL:', e);
    }
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (!error) {
        return res.json({ success: true, id });
      }
    } catch (e) {
      console.error('Error deleting admin in Supabase:', e);
    }
  }

  fallbackAdmins = fallbackAdmins.filter(a => a.id !== id);
  res.json({ success: true, id });
});

// Logo PNG download endpoint for profile pictures
app.get('/api/logo/download-png', (req, res) => {
  const size = req.query.size === '512' ? '512' : '1024';
  const file = size === '512' ? 'sesi-caxias-news-instagram-512.png' : 'sesi-caxias-news-instagram.png';
  const filePath = path.join(process.cwd(), 'public', file);
  res.setHeader('Content-Type', 'image/png');
  res.download(filePath, `sesi-caxias-news-logo-colorida-${size}x${size}.png`);
});

app.get('/api/logo/colorida.png', (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'sesi-caxias-news-instagram.png');
  res.setHeader('Content-Type', 'image/png');
  res.sendFile(filePath);
});

app.get('/api/logo/download', (req, res) => {
  const size = req.query.size === '512' ? '512' : '1024';
  const color = req.query.color;
  
  if (color === 'colorful' || !color) {
    const file = size === '512' ? 'sesi-caxias-news-instagram-512.png' : 'sesi-caxias-news-instagram.png';
    const filePath = path.join(process.cwd(), 'public', file);
    res.setHeader('Content-Type', 'image/png');
    return res.download(filePath, `sesi-caxias-news-logo-colorida-${size}x${size}.png`);
  }

  const filename = `sesi-logo-${color}-${size}.png`;
  const filePath = path.join(process.cwd(), 'public', filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'image/png');
    res.download(filePath, `sesi-caxias-logo-${color}-${size}x${size}.png`);
  } else {
    const fallbackPath = path.join(process.cwd(), 'public', 'sesi-caxias-news-instagram.png');
    res.setHeader('Content-Type', 'image/png');
    res.download(fallbackPath, 'sesi-caxias-news-logo-colorida.png');
  }
});

// ==========================================
// 6. VITE / STATIC CLIENT MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SESI News Server running on http://0.0.0.0:${PORT}`);

    // Asynchronously verify and provision Postgres tables in Neon in the background
    initPostgresSchema()
      .then(() => seedEventsIfEmpty(fallbackEvents))
      .catch((initErr) => {
        console.warn('Init schema skipped or failed:', initErr);
      });
  });
}

// Only start the HTTP listener if running standalone (not inside Vercel serverless runtime)
if (!process.env.VERCEL) {
  startServer();
}

export default app;

