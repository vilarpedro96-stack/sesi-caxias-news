import { Article, SchoolEvent, VideoItem, AdminUser } from '../types';
import { CALENDAR_EVENTS_2026 } from './calendarEvents';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Equipe de Robótica do SESI Conquista Primeiro Lugar no Torneio Regional',
    date: '17/08/2026',
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    excerpt: 'Com um projeto inovador focado em soluções sustentáveis e automação industrial, nossos alunos garantiram a classificação para a etapa nacional do torneio FIRST LEGO League.',
    content: `Com um projeto inovador focado em soluções sustentáveis e automação industrial, nossos alunos garantiram a classificação para a etapa nacional do torneio FIRST LEGO League.

A competição reuniu mais de 40 equipes de diversas escolas do estado, desafiando os jovens estudantes a projetar, construir e programar robôs autônomos capazes de cumprir missões de alta precisão em tempo recorde.

Além do desempenho técnico impecável na arena de desafios, a equipe do SESI destacou-se pelo Projeto de Inovação, apresentando um protótipo acessível de filtragem de água movido a energia solar.

"O empenho, o espírito de colaboração e a criatividade demonstrados por cada integrante refletem a excelência da metodologia STEAM aplicada diariamente em nossas salas de aula e laboratórios", destacou a coordenação pedagógica.

Parabenizamos todos os alunos e professores mentores por essa conquista inesquecível! A preparação para a etapa nacional já começou e promete grandes emoções.`
  },
  {
    id: 2,
    title: 'Abertura dos Jogos Escolares SESI 2026 Reúne Mais de 500 Alunos no Ginásio',
    date: '15/08/2026',
    category: 'Esportes',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1080',
    excerpt: 'A cerimônia oficial de abertura contou com desfile das turmas, acendimento da pira olímpica e partidas emocionantes de futsal, voleibol e handebol.',
    content: `A cerimônia oficial de abertura dos Jogos Escolares SESI 2026 transformou o ginásio poliesportivo em uma celebração vibrante de espírito esportivo, união e disciplina.

Mais de 500 estudantes do Ensino Fundamental e Médio participaram da marcha de abertura vestindo as cores de suas respectivas equipes. O momento mais emocionante foi o revezamento da tocha e o acendimento da pira olímpica por alunos atletas de destaque.

Durante as próximas duas semanas, as turmas competirão nas modalidades de Futsal, Voleibol, Basquetebol, Handebol, Xadrez e Natação. Venha torcer e prestigiar nossos talentos!`
  },
  {
    id: 3,
    title: 'Feira de Ciências e Sustentabilidade: Projetos dos Estudantes Ganham Destaque',
    date: '12/08/2026',
    category: 'Eventos',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1080',
    excerpt: 'Experimentos práticos, maquetes interativas e propostas de biotecnologia foram apresentados para a comunidade escolar e avaliadores convidados.',
    content: `A edição deste ano da Feira de Ciências e Sustentabilidade do SESI surpreendeu pelo nível técnico e relevância social das pesquisas desenvolvidas pelos estudantes.

Os estandes abordaram desde a reciclagem eficiente de polímeros até sistemas inteligentes de irrigação para hortas comunitárias. A feira esteve aberta para visitação de pais, responsáveis e estudantes de outras instituições.

A banca avaliadora premiou os três melhores trabalhos com bolsas de iniciação científica júnior e mentorias com pesquisadores do setor industrial.`
  },
  {
    id: 4,
    title: 'Festival de Arte e Cultura: Mostra Teatral e Musical Movimenta o Auditório',
    date: '08/08/2026',
    category: 'Cultura',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1080',
    excerpt: 'Apresentações de música ao vivo, dança contemporânea e peças clássicas adaptadas pelos alunos encantaram a plateia durante o final de semana.',
    content: `A expressão artística e o talento dos alunos do SESI brilharam intensamente no palco do Auditório Central durante o Festival Anual de Arte e Cultura.

Com performances preparadas ao longo do semestre nas oficinas de artes cênicas e música, o evento contou com releituras de clássicos da literatura brasileira e composições musicais autorais.

A iniciativa valoriza as múltiplas inteligências e reforça o compromisso da escola com a formação humana integral de seus estudantes.`
  },
  {
    id: 5,
    title: 'Comunicado Importante: Cronograma de Avaliações e Plantão de Dúvidas do 2º Trimestre',
    date: '05/08/2026',
    category: 'Comunicado',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1080',
    excerpt: 'Confira as datas das provas oficiais, períodos de revisão orientada e os horários de atendimento dos professores de todas as disciplinas.',
    content: `Prezados alunos, pais e responsáveis:

Informamos que o calendário oficial das avaliações do 2º Trimestre já está disponível para consulta no Portal do Aluno e no mural da secretaria.

Recomendamos atenção redobrada aos horários dos plantões de dúvidas, que acontecerão no contraturno escolar nas semanas que antecedem as provas. Os laboratórios de informática e a biblioteca estarão com horários estendidos para grupos de estudo.

Desejamos a todos uma excelente preparação e dedicação aos estudos!`
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = CALENDAR_EVENTS_2026.map((event, index) => ({
  ...event,
  id: index + 1
}));

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: 'Transmissão Ao Vivo: Grande Final dos Jogos Escolares SESI 2026',
    thumbnail: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=640',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Destaques da Mostra de Inovação e Robótica STEAM',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=640',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: 'Apresentação Teatral: Festival Cultural SESI',
    thumbnail: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=640',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 1,
    email: 'admin@sesi.edu.br',
    role: 'admin',
    password: null, // first access will prompt setup
    isPending: true
  },
  {
    id: 2,
    email: 'coordenacao@sesi.edu.br',
    role: 'admin',
    password: 'admin', // already configured password
    isPending: false
  },
  {
    id: 3,
    email: 'diretoria@sesi.edu.br',
    role: 'admin',
    password: null,
    isPending: true
  }
];
