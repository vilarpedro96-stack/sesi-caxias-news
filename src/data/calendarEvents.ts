import { SchoolEvent } from '../types';

export const CALENDAR_EVENTS_2026: Omit<SchoolEvent, 'id'>[] = [
  {
    title: 'Retorno às aulas após o recesso escolar',
    date: '2026-08-03',
    description: 'Retorno de todos os estudantes e equipe pedagógica para o 2º semestre letivo.',
    location: 'Escola FIRJAN SESI Duque de Caxias'
  },
  {
    title: 'Provas do 2º Trimestre',
    date: '2026-08-10',
    endDate: '2026-08-14',
    description: 'Semana de avaliações e provas do 2º Trimestre (10 a 14/08).',
    location: 'Salas de Aula'
  },
  {
    title: 'Interclasses – Anos Iniciais',
    date: '2026-08-24',
    endDate: '2026-08-25',
    description: 'Jogos esportivos Interclasses para os Anos Iniciais (24 e 25/08).',
    location: 'Ginásio Poliesportivo'
  },
  {
    title: 'Interclasses – Anos Finais',
    date: '2026-08-26',
    endDate: '2026-08-27',
    description: 'Competições esportivas Interclasses para turmas dos Anos Finais (26 e 27/08).',
    location: 'Ginásio Poliesportivo'
  },
  {
    title: 'Passeio FESTMAT (Medalhistas Canguru + Integrantes MOB)',
    date: '2026-08-28',
    description: 'Passeio cultural e pedagógico FESTMAT para medalhistas do Concurso Canguru e MOB.',
    location: 'FESTMAT'
  },
  {
    title: 'Recuperação Paralela – 2º Trimestre',
    date: '2026-08-31',
    endDate: '2026-09-04',
    description: 'Aulas de reforço e avaliações de recuperação paralela (31/08 a 04/09).',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Interclasses – Ensino Médio',
    date: '2026-08-31',
    endDate: '2026-09-01',
    description: 'Torneios esportivos Interclasses para o Ensino Médio (31/08 e 01/09).',
    location: 'Ginásio Poliesportivo'
  },
  {
    title: 'Término do 2º Trimestre',
    date: '2026-09-04',
    description: 'Encerramento oficial das notas e atividades do 2º trimestre letivo.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Feriado Nacional – Independência do Brasil',
    date: '2026-09-07',
    description: 'Comemoração da Independência do Brasil (sem expediente escolar).',
    location: 'Feriado Nacional'
  },
  {
    title: 'Início do 3º Trimestre',
    date: '2026-09-08',
    description: 'Abertura das aulas e conteúdos pedagógicos do 3º trimestre.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Conselho de Classe – 2º Trimestre (Anos Iniciais)',
    date: '2026-09-09',
    description: 'Reunião de avaliação do rendimento escolar dos Anos Iniciais.',
    location: 'Sala dos Professores'
  },
  {
    title: '1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais)',
    date: '2026-09-10',
    description: 'Aplicação das provas da 1ª fase da Olimpíada de Português BÊ-Á-BÁ.',
    location: 'Salas de Aula'
  },
  {
    title: 'Conselho de Classe – 2º Trimestre (Ensino Médio)',
    date: '2026-09-14',
    description: 'Reunião do corpo docente para fechamento pedagógico do Ensino Médio.',
    location: 'Sala dos Professores'
  },
  {
    title: 'Setembro Amarelo (Teatro FIRJAN SESI)',
    date: '2026-09-15',
    description: 'Palestras e dinâmicas de valorização da vida e saúde socioemocional.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Conselho de Classe – 2º Trimestre (Anos Finais)',
    date: '2026-09-16',
    description: 'Reunião de avaliação de desempenho dos alunos dos Anos Finais.',
    location: 'Sala dos Professores'
  },
  {
    title: 'Escola Aberta (Anos Iniciais – TARDE)',
    date: '2026-09-21',
    time: 'Turno da Tarde',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    location: 'Escola FIRJAN SESI Duque de Caxias'
  },
  {
    title: 'Escola Aberta (Anos Iniciais – MANHÃ)',
    date: '2026-09-22',
    time: 'Turno da Manhã',
    description: 'Visitação, oficinas e integração das famílias dos alunos dos Anos Iniciais.',
    location: 'Escola FIRJAN SESI Duque de Caxias'
  },
  {
    title: 'Escola Aberta (Anos Finais e Ensino Médio)',
    date: '2026-09-23',
    endDate: '2026-09-25',
    time: 'Manhã e Tarde',
    description: 'Dias de integração e vivência com as turmas de Anos Finais e Ensino Médio (23 e 25/09).',
    location: 'Escola FIRJAN SESI Duque de Caxias'
  },
  {
    title: 'Aulão UERJ (Teatro FIRJAN SESI)',
    date: '2026-09-24',
    time: '14:00 - 18:00',
    description: 'Super revisão preparatória interdisciplinar com foco no Vestibular Estadual da UERJ.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Encontro da Família',
    date: '2026-09-26',
    time: '08:30 - 12:30',
    description: 'Dia especial dedicado à aproximação, acolhimento e atividades entre família e escola.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Avaliações Diversificadas (Testes Anos Iniciais e Finais)',
    date: '2026-09-28',
    endDate: '2026-10-02',
    description: 'Semana de aplicação de avaliações diversificadas e testes (28/09 a 02/10).',
    location: 'Salas de Aula'
  },
  {
    title: '1ª Fase da Olimpíada de Português BÊ-Á-BÁ (Anos Iniciais) – Continuação',
    date: '2026-10-03',
    description: 'Etapa complementar da Olimpíada de Português BÊ-Á-BÁ para os Anos Iniciais.',
    location: 'Salas de Aula'
  },
  {
    title: 'Feriado Nacional – Nossa Senhora Aparecida',
    date: '2026-10-12',
    description: 'Feriado Nacional de Nossa Senhora Aparecida e Dia das Crianças.',
    location: 'Feriado Nacional'
  },
  {
    title: 'Semana das Crianças',
    date: '2026-10-13',
    endDate: '2026-10-14',
    description: 'Atividades recreativas, gincanas e oficinas comemorativas (13 e 14/10).',
    location: 'Pátio e Ginásio'
  },
  {
    title: 'Seminário STEAM EN JEANS',
    date: '2026-10-14',
    time: '09:00 - 15:00',
    description: 'Apresentação de projetos interdisciplinares de Ciência, Tecnologia, Engenharia, Artes e Matemática.',
    location: 'Laboratório Maker / STEAM'
  },
  {
    title: 'Papo Responsa (Teatro FIRJAN SESI)',
    date: '2026-10-14',
    time: '14:00',
    description: 'Roda de diálogo sobre cidadania, protagonismo jovem e convivência ética.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Dia do Professor (Feriado Escolar)',
    date: '2026-10-15',
    description: 'Recesso escolar em comemoração ao Dia dos Professores e Educadores.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Festival SESI Multicultural',
    date: '2026-10-17',
    time: '09:00 - 16:00',
    description: 'Exposições artísticas, apresentações de dança, música e estandes culturais dos alunos.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Aulão ENEM (Teatro FIRJAN SESI)',
    date: '2026-10-20',
    time: '13:30 - 17:30',
    description: 'Mega intensivão com resolução comentada de questões e dicas de redação para o ENEM.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Janela de Aplicação do Avalia SESI II',
    date: '2026-10-27',
    endDate: '2026-10-30',
    description: 'Período oficial de aplicação dos testes diagnósticos da rede (27 a 30/10).',
    location: 'Laboratórios de Informática e Salas'
  },
  {
    title: 'Feriado Nacional – Finados',
    date: '2026-11-02',
    description: 'Feriado Nacional de Finados (sem atividades letivas).',
    location: 'Feriado Nacional'
  },
  {
    title: 'Feriado Nacional – Proclamação da República',
    date: '2026-11-15',
    description: 'Comemoração cívica da Proclamação da República Brasileira.',
    location: 'Feriado Nacional'
  },
  {
    title: 'Culminância da Consciência Negra (Teatro FIRJAN SESI)',
    date: '2026-11-18',
    endDate: '2026-11-19',
    description: 'Mostra cultural, painéis reflexivos e debates temáticos sobre a Consciência Negra (18 e 19/11).',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Feriado Nacional – Dia Nacional de Zumbi e da Consciência Negra',
    date: '2026-11-20',
    description: 'Feriado Nacional em celebração da ancestralidade e Consciência Negra.',
    location: 'Feriado Nacional'
  },
  {
    title: 'Provas do 3º Trimestre',
    date: '2026-11-23',
    endDate: '2026-11-27',
    description: 'Semana de avaliações e provas finais do 3º Trimestre (23 a 27/11).',
    location: 'Salas de Aula'
  },
  {
    title: 'Amistoso – Esporte na Escola',
    date: '2026-11-28',
    time: '08:30 - 13:00',
    description: 'Sábado esportivo com jogos amistosos de integração e confraternização.',
    location: 'Ginásio Poliesportivo'
  },
  {
    title: 'Torneio SESI de Robótica (FLL)',
    date: '2026-12-03',
    endDate: '2026-12-04',
    time: '08:00 - 17:00',
    description: 'Competição oficial de robótica FIRST LEGO League (03 e 04/12).',
    location: 'Arena FIRJAN SESI'
  },
  {
    title: 'Recuperação Paralela – 3º Trimestre',
    date: '2026-12-08',
    endDate: '2026-12-10',
    description: 'Período de aulas de reforço e provas de recuperação do 3º Trimestre (08 a 10/12).',
    location: 'Salas de Aula'
  },
  {
    title: 'Festa das Letras (1º e 5º Ano) – Teatro FIRJAN SESI',
    date: '2026-12-09',
    endDate: '2026-12-10',
    description: 'Cerimônia especial de transição e celebração literária dos anos concluintes (09 e 10/12).',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Término do 3º Trimestre',
    date: '2026-12-11',
    description: 'Fechamento oficial das aulas regulares do 3º trimestre de 2026.',
    location: 'Escola FIRJAN SESI'
  },
  {
    title: 'Conselho de Classe – 3º Trimestre (9º Ano e 3ª Série)',
    date: '2026-12-11',
    description: 'Reunião de avaliação e aprovação final das turmas concluintes do Fundamental e Médio.',
    location: 'Sala dos Professores'
  },
  {
    title: 'Recuperação Final',
    date: '2026-12-14',
    endDate: '2026-12-16',
    description: 'Plantão de estudos e aplicação das avaliações de Recuperação Final (14 a 16/12).',
    location: 'Salas de Aula'
  },
  {
    title: 'Arrumação e Montagem da Formatura',
    date: '2026-12-15',
    time: 'A partir das 18:00',
    description: 'Preparativos técnicos, iluminação e ambientação para a formatura solene.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Formatura do 9º Ano e da 3ª Série (Teatro FIRJAN SESI)',
    date: '2026-12-16',
    time: '19:00',
    description: 'Solenidade oficial de colação de grau dos formandos do Ensino Fundamental e Ensino Médio.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Cantata de Natal (Teatro FIRJAN SESI)',
    date: '2026-12-17',
    time: '18:30',
    description: 'Emocionante apresentação musical natalina com coral de alunos e professores.',
    location: 'Teatro FIRJAN SESI'
  },
  {
    title: 'Conselho de Classe – 3º Trimestre (Ensino Médio)',
    date: '2026-12-17',
    description: 'Encerramento pedagógico e validação dos resultados do Ensino Médio.',
    location: 'Sala dos Professores'
  },
  {
    title: 'Conselho de Classe – 3º Trimestre (Anos Iniciais e Anos Finais)',
    date: '2026-12-18',
    description: 'Fechamento dos diários de classe e validação de aprovação dos Anos Iniciais e Finais.',
    location: 'Sala dos Professores'
  },
  {
    title: 'Entrega dos Boletins',
    date: '2026-12-21',
    description: 'Disponibilização das notas finais no portal e atendimento aos responsáveis na secretaria.',
    location: 'Secretaria Escolar / Portal'
  },
  {
    title: 'Natal',
    date: '2026-12-25',
    description: 'Celebração de Natal. Boas Festas a toda a comunidade escolar SESI!',
    location: 'Feriado Nacional'
  }
];
