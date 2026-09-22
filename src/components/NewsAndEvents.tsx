import React, { useState, useMemo } from 'react';
import { useLiveNow } from '../hooks/useLiveNow';
import { getEventCountdown, isEventEnded, parseLocalDate } from '../utils/eventCountdown';
import { motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ArrowRight,
  GraduationCap,
  Mail,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  Tag
} from 'lucide-react';
import { Article, SchoolEvent } from '../types';

interface NewsAndEventsProps {
  articles: Article[];
  events: SchoolEvent[];
  onArticleClick: (article: Article) => void;
  onCalendarClick: () => void;
}

export const NewsAndEvents: React.FC<NewsAndEventsProps> = ({
  articles,
  events,
  onArticleClick,
  onCalendarClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const now = useLiveNow();

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category && a.category.trim()) {
        set.add(a.category.trim());
      }
    });
    return ['Todas', ...Array.from(set)];
  }, [articles]);

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'Todas') return articles;
    return articles.filter(
      (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [articles, selectedCategory]);

  const displayEvents = useMemo(() => {
    const valid = (events || []).filter((event) => !isEventEnded(event.date, event.status, now));
    return valid.slice(0, 4);
  }, [events, now]);

  // Helper to construct Google Calendar Add Event URL
  const getGoogleCalendarUrl = (evt: SchoolEvent) => {
    const title = encodeURIComponent(`SESI Caxias: ${evt.title}`);
    const details = encodeURIComponent(`${evt.description || ''}\nLocal: ${evt.location || 'SESI Caxias'}`);
    const location = encodeURIComponent(evt.location || 'SESI Caxias');
    
    // Parse date into YYYYMMDD
    const dateObj = parseLocalDate(evt.date);
    let dateStr = '';
    if (dateObj) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      dateStr = `${y}${m}${d}/${y}${m}${d}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${dateStr ? `&dates=${dateStr}` : ''}`;
  };

  const getEventTimeStatus = (dateStr: string) => getEventCountdown(dateStr, now);

  return (
    <div id="portal-main-feed" className="bg-neutral-50 dark:bg-neutral-950 transition-colors duration-200">
      {/* =========================================================
          SEÇÃO 1: MURAL DE NOTÍCIAS (Espaçoso, sem aperto lateral)
         ========================================================= */}
      <section id="noticias-section" className="py-14 container mx-auto px-4 sm:px-6">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <span className="text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider block mb-1">
              Informativo Escolar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Últimas Notícias
            </h2>
          </div>

          {/* Filtro por Categorias */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat}`}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade de Notícias (3 colunas) */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-neutral-800">
            <p className="text-gray-500 dark:text-neutral-400 text-sm">
              Nenhuma notícia encontrada nesta categoria.
            </p>
            <button
              onClick={() => setSelectedCategory('Todas')}
              className="text-red-600 dark:text-red-400 text-xs font-bold mt-2 hover:underline cursor-pointer"
            >
              Ver todas as notícias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((item) => (
              <motion.article
                key={item.id}
                id={`article-card-${item.id}`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onArticleClick(item)}
                className="group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200/80 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col h-full cursor-pointer"
              >
                {/* Imagem da Notícia */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 dark:bg-neutral-900/90 text-gray-900 dark:text-neutral-100 px-2.5 py-1 text-[11px] font-bold uppercase rounded shadow-xs backdrop-blur-xs border border-transparent dark:border-neutral-700">
                    {item.category || 'Geral'}
                  </span>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-neutral-400 font-semibold mb-2.5">
                    <CalendarIcon size={13} className="text-red-500" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug mb-2.5 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-700 dark:text-neutral-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                    {item.excerpt || item.content}
                  </p>

                  <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400 mt-auto">
                    <span>Ler matéria</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          SEÇÃO 2: AGENDA ESCOLAR (Modernizada, Elegante & Completa)
         ========================================================= */}
      <section
        id="agenda-section"
        className="py-16 bg-gray-100/70 dark:bg-neutral-950 border-y border-gray-200 dark:border-neutral-800 transition-colors duration-200"
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                <CalendarIcon size={13} />
                <span>Compromissos e Datas Oficiais</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Agenda Escolar SESI Caxias
              </h2>
              <p className="text-sm text-gray-700 dark:text-neutral-300 mt-1 max-w-xl font-medium">
                Acompanhe o cronograma de avaliações, reuniões pedagógicas, eventos culturais e atividades esportivas.
              </p>
            </div>

            <button
              id="agenda-ver-completa-btn"
              type="button"
              onClick={onCalendarClick}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer w-fit active:scale-95"
            >
              <span>Ver Calendário Completo</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Cards de Eventos Modernizados */}
          {displayEvents.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-10 text-center border border-gray-300 dark:border-neutral-800 shadow-sm">
              <CalendarIcon size={40} className="mx-auto text-red-500 mb-2 opacity-80" />
              <p className="text-gray-800 dark:text-neutral-200 text-sm font-semibold">
                Nenhum evento agendado no momento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayEvents.map((evt) => {
                const evtDate = parseLocalDate(evt.date) || new Date(evt.date);
                const monthName = !isNaN(evtDate.getTime())
                  ? evtDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
                  : 'EVT';
                const dayNumber = !isNaN(evtDate.getTime()) ? evtDate.getDate() : '•';
                const weekday = !isNaN(evtDate.getTime())
                  ? evtDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase()
                  : '';
                const status = getEventTimeStatus(evt.date);

                return (
                  <div
                    key={evt.id}
                    id={`home-event-${evt.id}`}
                    className="group relative bg-white dark:bg-neutral-900 hover:bg-red-50/20 dark:hover:bg-neutral-800/80 rounded-2xl p-5 border border-gray-300/90 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Date Badge + Status Pill */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        {/* High-contrast Date Block */}
                        <div className="flex items-center gap-2.5">
                          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0 shadow-sm shadow-red-600/30">
                            <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                              {monthName}
                            </span>
                            <span className="text-lg font-black leading-none mt-0.5">
                              {dayNumber}
                            </span>
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-200">
                            {weekday}
                          </div>
                        </div>

                        {/* Status Badge */}
                        {status && (
                          <span
                            className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider shadow-xs ${status.class}`}
                          >
                            {status.label}
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h4
                        onClick={onCalendarClick}
                        className="font-black text-gray-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors cursor-pointer line-clamp-2 mb-2"
                      >
                        {evt.title}
                      </h4>

                      {/* Time & Location */}
                      <div className="space-y-1.5 text-xs text-gray-800 dark:text-neutral-200 mb-4">
                        {evt.time && (
                          <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-neutral-100">
                            <Clock size={13} className="text-red-500 shrink-0" />
                            <span>{evt.time}</span>
                          </div>
                        )}
                        {evt.location && (
                          <div className="flex items-center gap-1.5 truncate text-gray-700 dark:text-neutral-300">
                            <MapPin size={13} className="text-red-500 dark:text-red-400 shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={onCalendarClick}
                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>Detalhes</span>
                        <ChevronRight size={13} />
                      </button>

                      {/* Add to Google Calendar Button */}
                      <a
                        href={getGoogleCalendarUrl(evt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-700 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                        title="Salvar no meu Google Agenda"
                      >
                        <PlusCircle size={13} className="text-red-500" />
                        <span>Google Agenda</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          SEÇÃO 3: ACESSO RÁPIDO & RECURSOS PARA A FAMÍLIA E ALUNOS
         ========================================================= */}
      <section id="acesso-rapido-section" className="py-14 container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Portal do Aluno */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
                <GraduationCap size={22} className="text-blue-200" />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">Portal do Aluno SESI</h3>
              <p className="text-xs text-blue-200 leading-relaxed mb-4">
                Consulte notas, faltas, boletim e comunicados oficiais do corpo docente.
              </p>
            </div>
            <a
              id="home-portal-aluno-btn"
              href="https://www.firjansenaisesi.com.br/FrameHTML/Web/App/Edu/PortalEducacional/login/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-xs"
            >
              <span>Acessar Portal Educacional</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Card 2: Dúvidas e Sugestões */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 flex items-center justify-center mb-3">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Dúvidas e Sugestões</h3>
              <p className="text-xs text-gray-700 dark:text-neutral-300 leading-relaxed mb-4 font-medium">
                Tem dúvidas, sugestões de reportagens ou deseja colaborar com o jornal? Fale conosco!
              </p>
            </div>
            <a
              id="card-contact-email"
              href="mailto:sesicaxiasnews@hotmail.com"
              className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-orange-100/90 dark:bg-orange-950/50 hover:bg-orange-200 dark:hover:bg-orange-900/60 py-2.5 px-3 rounded-lg border border-orange-300 dark:border-orange-800 text-center transition-colors flex items-center justify-center gap-2"
              title="Enviar e-mail para sesicaxiasnews@hotmail.com"
            >
              <Mail size={14} />
              sesicaxiasnews@hotmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
