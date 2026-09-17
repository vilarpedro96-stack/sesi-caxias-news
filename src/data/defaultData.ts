import { Article, SchoolEvent, VideoItem, AdminUser } from '../types';

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

export const INITIAL_EVENTS: SchoolEvent[] = [
  // --- AGOSTO 2026 (Encerrados: 03/08 a 16/09) ---
  {
    id: 1,
    title: 'Retorno às aulas após o recesso escolar',
    date: '2026-08-03',
    description: 'Retorno de todos os estudantes e equipe pedagógica para o 2º semestre letivo.',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    status: 'encerrado'
  },
  {
    id: 2,
    title: 'Provas do 2º Trimestre',
    date: '2026-08-10',
    description: 'Semana de avaliações e provas do 2º Trimestre (Período: 10 a 14/08).',
    location: 'Salas de Aula',
    status: 'encerrado'
  },
  {
    id: 3,
    title: 'Interclasses – Anos Iniciais',
    date: '2026-08-24',
    description: 'Jogos esportivos Interclasses para os alunos dos Anos Iniciais (24 e 25/08).',
    location: 'Ginásio Poliesportivo',
    status: 'encerrado'
  },
  {
    id: 4,
    title: 'Interclasses – Anos Finais',
    date: '2026-08-26',
    description: 'Competições esportivas Interclasses para turmas dos Anos Finais (26 e 27/08).',
    location: 'Ginásio Poliesportivo',
    status: 'encerrado'
  },
  {
    id: 5,
    title: 'Passeio FESTMAT (Medalhistas Canguru + Integrantes MOB)',
    date: '2026-08-28',
    description: 'Passeio cultural e pedagógico FESTMAT para medalhistas do Concurso Canguru e MOB.',
    location: 'FESTMAT',
    status: 'encerrado'
  },
  {
    id: 6,
    title: 'Recuperação Paralela – 2º Trimestre',
    date: '2026-08-31',
    description: 'Aulas de reforço e avaliações de recuperação paralela (31/08 a 04/09).',
    location: 'Escola FIRJAN SESI',
    status: 'encerrado'
  },
  {
    id: 7,
    title: 'Interclasses – Ensino Médio',
    date: '2026-08-31',
    description: 'Torneios esportivos Interclasses para o Ensino Médio (31/08 e 01/09).',
    location: 'Ginásio Poliesportivo',
    status: 'encerrado'
  },

  // --- SETEMBRO 2026 (04/09 a 16/09: Encerrados) ---
  {
    id: 8,
    title: 'Término do 2º Trimestre',
    date: '2026-09-04',
    description: 'Encerramento oficial das notas e atividades do 2º trimestre letivo.',
    location: 'Escola FIRJAN SESI',
    status: 'encerrado'
  },
  {
    id: 9,
    title: 'Feriado Nacional – Independência do Brasil',
    date: '2026-09-07',
    description: 'Comemoração da Independência do Brasil (sem expediente escolar).',
    location: 'Feriado Nacional',
    status: 'encerrado'
  },
  {
    id: 10,
    title: 'Início do 3º Trimestre',
    date: '2026-09-08',
    description: 'Abertura das aulas e conteúdos pedagógicos do 3º trimestre.',
    location: 'Escola FIRJAN SESI',
    status: 'encerrado'
  },
  {
    id: 11,
    title: 'Conselho de Classe – 2º Trimestre (Anos Iniciais)',
    date: '2026-09-09',
    description: 'Reunião de avaliação do rendimento escolar dos Anos Iniciais.',
    location: 'Sala dos Professores',
    status: 'encerrado'
  },
  {
    id: 12,
    title: '1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)',
    date: '2026-09-10',
    description: 'Aplicação das provas da 1ª fase da Olimpíada de Português BÊ-Á-BÁ.',
    location: 'Salas de Aula',
    status: 'encerrado'
  },
  {
    id: 13,
    title: 'Conselho de Classe – 2º Trimestre (Ensino Médio)',
    date: '2026-09-14',
    description: 'Reunião do corpo docente para fechamento pedagógico do Ensino Médio.',
    location: 'Sala dos Professores',
    status: 'encerrado'
  },
  {
    id: 14,
    title: 'Setembro Amarelo (Teatro FIRJAN SESI)',
    date: '2026-09-15',
    description: 'Palestras e dinâmicas de valorização da vida e saúde socioemocional.',
    location: 'Teatro FIRJAN SESI',
    status: 'encerrado'
  },
  {
    id: 15,
    title: 'Conselho de Classe – 2º Trimestre (Anos Finais)',
    date: '2026-09-16',
    description: 'Reunião de avaliação de desempenho dos alunos dos Anos Finais.',
    location: 'Sala dos Professores',
    status: 'encerrado'
  },

  // --- SETEMBRO 2026 (A partir de 17/09: Próximos) ---
  {
    id: 16,
    title: 'Escola Aberta (Anos Iniciais – TARDE)',
    date: '2026-09-21',
    time: 'Turno da Tarde',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    status: 'agendado'
  },
  {
    id: 17,
    title: 'Escola Aberta (Anos Iniciais – MANHÃ)',
    date: '2026-09-22',
    time: 'Turno da Manhã',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    status: 'agendado'
  },
  {
    id: 18,
    title: 'Escola Aberta (Anos Finais e Ensino Médio)',
    date: '2026-09-23',
    time: 'Manhã e Tarde',
    description: 'Dias de integração e vivência com as turmas de Anos Finais e Ensino Médio (23 e 25/09).',
    location: 'Escola FIRJAN SESI Duque de Caxias',
    status: 'agendado'
  },
  {
    id: 19,
    title: 'Aulão UERJ (Teatro FIRJAN SESI)',
    date: '2026-09-24',
    time: '14:00 - 18:00',
    description: 'Super revisão preparatória interdisciplinar com foco no Vestibular Estadual da UERJ.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 20,
    title: 'Encontro da Família',
    date: '2026-09-26',
    time: '08:30 - 12:30',
    description: 'Dia especial dedicado à aproximação, acolhimento e atividades entre família e escola.',
    location: 'Escola FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 21,
    title: 'Avaliações Diversificadas (Testes Anos Iniciais e Finais)',
    date: '2026-09-28',
    description: 'Semana de aplicação de avaliações diversificadas e testes (28/09 a 02/10).',
    location: 'Salas de Aula',
    status: 'agendado'
  },

  // --- OUTUBRO 2026 ---
  {
    id: 22,
    title: '2ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)',
    date: '2026-10-03',
    description: 'Etapa complementar da 2ª fase da Olimpíada de Português para os Anos Iniciais.',
    location: 'Salas de Aula',
    status: 'agendado'
  },
  {
    id: 23,
    title: 'Feriado Nacional – Nossa Senhora Aparecida',
    date: '2026-10-12',
    description: 'Feriado Nacional de Nossa Senhora Aparecida e Dia das Crianças.',
    location: 'Feriado Nacional',
    status: 'agendado'
  },
  {
    id: 24,
    title: 'Semana das Crianças',
    date: '2026-10-13',
    description: 'Atividades recreativas, gincanas e oficinas comemorativas (13 a 16/10).',
    location: 'Pátio e Ginásio',
    status: 'agendado'
  },
  {
    id: 25,
    title: 'Seminário STEAM EN JEANS',
    date: '2026-10-14',
    time: '09:00 - 15:00',
    description: 'Apresentação de projetos interdisciplinares de Ciência, Tecnologia, Engenharia, Artes e Matemática.',
    location: 'Laboratório Maker / STEAM',
    status: 'agendado'
  },
  {
    id: 26,
    title: 'Papo Responsa (Teatro FIRJAN SESI)',
    date: '2026-10-14',
    time: '14:00',
    description: 'Roda de diálogo sobre cidadania, protagonismo jovem e convivência ética.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 27,
    title: 'Dia do Professor (Feriado Escolar)',
    date: '2026-10-15',
    description: 'Recesso escolar em comemoração ao Dia dos Professores e Educadores.',
    location: 'Escola FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 28,
    title: 'Festival SESI Multicultural',
    date: '2026-10-17',
    time: '09:00 - 16:00',
    description: 'Exposições artísticas, apresentações de dança, música e estandes culturais dos alunos.',
    location: 'Escola FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 29,
    title: 'Aulão ENEM (Teatro FIRJAN SESI)',
    date: '2026-10-20',
    time: '13:30 - 17:30',
    description: 'Mega intensivão com resolução comentada de questões e dicas de redação para o ENEM.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 30,
    title: 'Janela de Aplicação do Avalia SESI II',
    date: '2026-10-27',
    description: 'Período oficial de aplicação dos testes diagnósticos da rede (27 a 30/10).',
    location: 'Laboratórios de Informática e Salas',
    status: 'agendado'
  },

  // --- NOVEMBRO 2026 ---
  {
    id: 31,
    title: 'Feriado Nacional – Finados',
    date: '2026-11-02',
    description: 'Feriado Nacional de Finados (sem atividades letivas).',
    location: 'Feriado Nacional',
    status: 'agendado'
  },
  {
    id: 32,
    title: 'Feriado Nacional – Proclamação da República',
    date: '2026-11-15',
    description: 'Comemoração cívica da Proclamação da República Brasileira.',
    location: 'Feriado Nacional',
    status: 'agendado'
  },
  {
    id: 33,
    title: 'Culminância da Consciência Negra (Teatro FIRJAN SESI)',
    date: '2026-11-18',
    description: 'Mostra cultural, painéis reflexivos e debates temáticos sobre a Consciência Negra (18 e 19/11).',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 34,
    title: 'Feriado Nacional – Dia Nacional de Zumbi e da Consciência Negra',
    date: '2026-11-20',
    description: 'Feriado Nacional em celebração da ancestralidade e Consciência Negra.',
    location: 'Feriado Nacional',
    status: 'agendado'
  },
  {
    id: 35,
    title: 'Provas do 3º Trimestre',
    date: '2026-11-23',
    description: 'Semana de avaliações e provas finais do 3º Trimestre (23 a 27/11).',
    location: 'Salas de Aula',
    status: 'agendado'
  },
  {
    id: 36,
    title: 'Amistoso – Esporte na Escola',
    date: '2026-11-28',
    time: '08:30 - 13:00',
    description: 'Sábado esportivo com jogos amistosos de integração e confraternização.',
    location: 'Ginásio Poliesportivo',
    status: 'agendado'
  },

  // --- DEZEMBRO 2026 ---
  {
    id: 37,
    title: 'Torneio SESI de Robótica (FLL)',
    date: '2026-12-03',
    time: '08:00 - 17:00',
    description: 'Competição oficial de robótica FIRST LEGO League (03 e 04/12).',
    location: 'Arena FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 38,
    title: 'Recuperação Paralela – 3º Trimestre',
    date: '2026-12-08',
    description: 'Período de aulas de reforço e provas de recuperação do 3º Trimestre (08 a 10/12).',
    location: 'Salas de Aula',
    status: 'agendado'
  },
  {
    id: 39,
    title: 'Festa das Letras (1º e 5º Ano) – Teatro FIRJAN SESI',
    date: '2026-12-09',
    description: 'Cerimônia especial de transição e celebração literária dos anos concluintes (09 e 10/12).',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 40,
    title: 'Término do 3º Trimestre',
    date: '2026-12-11',
    description: 'Fechamento oficial das aulas regulares do 3º trimestre de 2026.',
    location: 'Escola FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 41,
    title: 'Conselho de Classe – 3º Trimestre (9º Ano e 3ª Série)',
    date: '2026-12-11',
    description: 'Reunião de avaliação e aprovação final das turmas concluintes do Fundamental e Médio.',
    location: 'Sala dos Professores',
    status: 'agendado'
  },
  {
    id: 42,
    title: 'Recuperação Final',
    date: '2026-12-14',
    description: 'Plantão de estudos e aplicação das avaliações de Recuperação Final (14 a 18/12).',
    location: 'Salas de Aula',
    status: 'agendado'
  },
  {
    id: 43,
    title: 'Arrumação e Montagem da Formatura',
    date: '2026-12-15',
    time: 'A partir das 18:00',
    description: 'Preparativos técnicos, iluminação e ambientação para a formatura solene.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 44,
    title: 'Formatura do 9º Ano e da 3ª Série (Teatro FIRJAN SESI)',
    date: '2026-12-16',
    time: '19:00',
    description: 'Solenidade oficial de colação de grau dos formandos do Ensino Fundamental e Ensino Médio.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 45,
    title: 'Cantata de Natal (Teatro FIRJAN SESI)',
    date: '2026-12-17',
    time: '18:30',
    description: 'Emocionante apresentação musical natalina com coral de alunos e professores.',
    location: 'Teatro FIRJAN SESI',
    status: 'agendado'
  },
  {
    id: 46,
    title: 'Conselho de Classe – 3º Trimestre (Ensino Médio)',
    date: '2026-12-17',
    description: 'Encerramento pedagógico e validação dos resultados do Ensino Médio.',
    location: 'Sala dos Professores',
    status: 'agendado'
  },
  {
    id: 47,
    title: 'Conselho de Classe – 3º Trimestre (Anos Iniciais e Anos Finais)',
    date: '2026-12-18',
    description: 'Fechamento dos diários de classe e validação de aprovação dos Anos Iniciais e Finais.',
    location: 'Sala dos Professores',
    status: 'agendado'
  },
  {
    id: 48,
    title: 'Entrega dos Boletins',
    date: '2026-12-21',
    description: 'Disponibilização das notas finais no portal e atendimento aos responsáveis na secretaria.',
    location: 'Secretaria Escolar / Portal',
    status: 'agendado'
  },
  {
    id: 49,
    title: 'Natal',
    date: '2026-12-25',
    description: 'Celebração de Natal. Boas Festas a toda a comunidade escolar SESI!',
    location: 'Feriado Nacional',
    status: 'agendado'
  }
];

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
