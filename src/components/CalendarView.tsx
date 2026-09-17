import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SchoolEvent } from '../types';

interface CalendarViewProps {
  events: SchoolEvent[];
  onBack: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onBack }) => {
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Safe local date parser avoiding UTC midnight timezone shifts
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d);
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Automatically closes when the day ends (at midnight) or if manually marked
  const isEventEncerrado = useMemo(() => {
    return (evt: SchoolEvent) => {
      if (evt.status === 'encerrado') return true;
      const evtDate = parseLocalDate(evt.date);
      if (evtDate) {
        // Until 23:59:59 of the event day, it remains active. When midnight arrives, it automatically closes.
        evtDate.setHours(23, 59, 59, 999);
        return evtDate < new Date();
      }
      return false;
    };
  }, []);

  const { upcomingCount, pastCount } = useMemo(() => {
    let up = 0;
    let past = 0;
    events.forEach((evt) => {
      if (isEventEncerrado(evt)) {
        past++;
      } else {
        up++;
      }
    });
    return { upcomingCount: up, pastCount: past };
  }, [events, isEventEncerrado]);

  // Filter events based on active tab and query
  const filteredEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .filter((evt) => {
        const isEncerrado = isEventEncerrado(evt);

        if (filterType === 'upcoming') {
          if (isEncerrado) return false;
        } else if (filterType === 'past') {
          if (!isEncerrado) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = evt.title.toLowerCase().includes(q);
          const matchesDesc = evt.description?.toLowerCase().includes(q);
          const matchesLoc = evt.location?.toLowerCase().includes(q);
          return matchesTitle || matchesDesc || matchesLoc;
        }

        return true;
      });
  }, [events, filterType, searchQuery, isEventEncerrado]);

  // Group filtered events by month + year
  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce<Record<string, SchoolEvent[]>>((acc, event) => {
      const dateObj = new Date(event.date);
      let monthLabel = 'Outras Datas';
      if (!isNaN(dateObj.getTime())) {
        const str = dateObj.toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric'
        });
        monthLabel = str.charAt(0).toUpperCase() + str.slice(1);
      }
      if (!acc[monthLabel]) {
        acc[monthLabel] = [];
      }
      acc[monthLabel].push(event);
      return acc;
    }, {});
  }, [filteredEvents]);

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (evt: SchoolEvent) => {
    const title = encodeURIComponent(`SESI Caxias: ${evt.title}`);
    const details = encodeURIComponent(
      `${evt.description || ''}\nLocal: ${evt.location || 'SESI Caxias'}`
    );
    const location = encodeURIComponent(evt.location || 'SESI Caxias');

    const dateObj = new Date(evt.date);
    let dateStr = '';
    if (!isNaN(dateObj.getTime())) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      dateStr = `${y}${m}${d}/${y}${m}${d}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${
      dateStr ? `&dates=${dateStr}` : ''
    }`;
  };

  return (
    <motion.div
      id="calendar-full-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-24 pt-8 transition-colors duration-200"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            id="calendar-back-home-btn"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Voltar para o início</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
              <CalendarIcon size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Agenda Escolar Oficial
              </h1>
              <p className="text-xs text-gray-700 dark:text-neutral-300 font-medium">
                SESI Caxias • Ano Letivo {today.getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 sm:p-5 border border-gray-300 dark:border-neutral-700 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              Todos ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('upcoming')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'upcoming'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              Próximos ({upcomingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('past')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'past'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-100 border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }`}
            >
              Encerrados ({pastCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar evento, local ou assunto..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Grouped Events List */}
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-300 dark:border-neutral-700 shadow-xs">
            <CalendarIcon size={48} className="mx-auto text-red-500 dark:text-red-400 mb-3 opacity-80" />
            <p className="text-gray-800 dark:text-neutral-200 text-sm font-semibold">
              Nenhum evento encontrado para os critérios selecionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
              }}
              className="text-red-600 dark:text-red-400 text-xs font-bold mt-2 hover:underline cursor-pointer"
            >
              Limpar filtros e exibir tudo
            </button>
          </div>
        ) : (
          (Object.entries(groupedEvents) as [string, SchoolEvent[]][]).map(([monthYear, monthEvents]) => (
            <div key={monthYear} className="mb-10">
              {/* Month Header Banner */}
              <div className="flex items-center gap-3 mb-5">
                <span className="bg-red-600 text-white text-xs font-black uppercase px-3 py-1 rounded-md shadow-xs">
                  Mês
                </span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {monthYear}
                </h2>
                <div className="h-px bg-gray-300 dark:border-b dark:border-neutral-700 flex-1 ml-2" />
                <span className="text-xs text-gray-700 dark:text-neutral-300 font-bold">
                  {monthEvents.length} {monthEvents.length === 1 ? 'evento' : 'eventos'}
                </span>
              </div>

              {/* Event Cards in Month */}
              <div className="space-y-4">
                {monthEvents.map((evt) => {
                  const evtDate = parseLocalDate(evt.date);
                  const isPast = isEventEncerrado(evt);
                  const dayNum = evtDate ? evtDate.getDate() : '•';
                  const weekday = evtDate
                    ? evtDate
                        .toLocaleDateString('pt-BR', { weekday: 'short' })
                        .replace('.', '')
                        .toUpperCase()
                    : '';

                  return (
                    <motion.div
                      key={evt.id}
                      id={`calendar-event-${evt.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-gray-300 dark:border-neutral-700 hover:border-red-400 dark:hover:border-red-500/70 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      {/* Left: Date Badge + Info */}
                      <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                        {/* High-contrast Date Block */}
                        <div
                          className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                            isPast
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-600'
                              : 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-600/30'
                          }`}
                        >
                          <span className="text-2xl font-black leading-none">{dayNum}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                            {weekday}
                          </span>
                        </div>

                        {/* Event Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h3 className="text-base sm:text-lg font-bold leading-tight text-gray-900 dark:text-white">
                              {evt.title}
                            </h3>
                            {isPast ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600">
                                <CheckCircle2 size={11} className="text-neutral-500 dark:text-neutral-400" />
                                Encerrado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold">
                                <Sparkles size={10} className="text-emerald-600 dark:text-emerald-400" />
                                Confirmado
                              </span>
                            )}
                          </div>

                          {evt.description && (
                            <p className="text-xs sm:text-sm text-gray-700 dark:text-neutral-200 mb-2.5 leading-relaxed">
                              {evt.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-700 dark:text-neutral-200">
                            {evt.time && (
                              <span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-neutral-100">
                                <Clock size={13} className="text-red-500 shrink-0" />
                                <span>{evt.time}</span>
                              </span>
                            )}
                            {evt.location && (
                              <span className="flex items-center gap-1 font-medium truncate text-gray-700 dark:text-neutral-300">
                                <MapPin size={13} className="text-red-500 dark:text-red-400 shrink-0" />
                                <span className="truncate">{evt.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-200 dark:border-neutral-800">
                        {!isPast && (
                          <a
                            href={getGoogleCalendarUrl(evt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-neutral-700 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-neutral-600 hover:border-red-400 text-xs font-bold py-2 px-3.5 rounded-xl transition-all shadow-xs"
                            title="Salvar no meu Google Agenda"
                          >
                            <PlusCircle size={14} className="text-red-500" />
                            <span>Google Agenda</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};
