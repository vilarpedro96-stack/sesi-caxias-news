import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Calendar,
  Video,
  Users,
  Plus,
  Trash2,
  LogOut,
  Clock,
  MapPin,
  Shield,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';
import { Article, SchoolEvent, VideoItem, AdminUser } from '../types';
import { apiService } from '../services/api';
import { SesiLogo } from './SesiLogo';
import { useTheme } from '../context/ThemeContext';
import { getEventCountdown, isEventEnded, parseLocalDate } from '../utils/eventCountdown';
import { useLiveNow } from '../hooks/useLiveNow';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  articles: Article[];
  events: SchoolEvent[];
  videos: VideoItem[];
  admins: AdminUser[];
  onAddArticle: (article: Omit<Article, 'id'>) => void;
  onDeleteArticle: (id: number) => void;
  onAddEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  onDeleteEvent: (id: number) => void;
  onAddVideo: (video: Omit<VideoItem, 'id'>) => void;
  onDeleteVideo: (id: number) => void;
  onAddAdmin: (email: string) => void;
  onDeleteAdmin: (id: number) => void;
  onLogout: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  articles,
  events,
  videos,
  admins,
  onAddArticle,
  onDeleteArticle,
  onAddEvent,
  onDeleteEvent,
  onAddVideo,
  onDeleteVideo,
  onAddAdmin,
  onDeleteAdmin,
  onLogout,
  onRefreshData
}) => {
  const { theme, toggleTheme } = useTheme();
  const now = useLiveNow();
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'videos' | 'admins'>('news');

  // Database status state
  const [dbStatus, setDbStatus] = useState<{
    status: string;
    database: {
      type: string;
      provider?: string;
      configured: boolean;
      connected: boolean;
      url?: string | null;
      error?: string | null;
    };
  } | null>(null);

  // Form States
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('Geral');
  const [articleImage, setArticleImage] = useState('');
  const [articleExcerpt, setArticleExcerpt] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [newAdminEmail, setNewAdminEmail] = useState('');

  // Check backend and DB status on mount
  const fetchDbStatus = async () => {
    try {
      const res = await apiService.getStatus();
      setDbStatus(res);
    } catch (e) {
      console.warn('Error checking db status:', e);
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  // Handlers
  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle.trim() || !articleExcerpt.trim()) {
      toast.error('Preencha o título e o conteúdo da notícia.');
      return;
    }

    const defaultImg =
      articleImage.trim() ||
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1080';

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(
      now.getMonth() + 1
    ).padStart(2, '0')}/${now.getFullYear()}`;

    onAddArticle({
      title: articleTitle,
      category: articleCategory,
      image: defaultImg,
      summary: articleExcerpt.slice(0, 140) + '...',
      content: articleExcerpt,
      date: formattedDate
    });

    setArticleTitle('');
    setArticleImage('');
    setArticleExcerpt('');
    toast.success('Notícia enviada com sucesso!');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) {
      toast.error('Preencha o título e a data do evento.');
      return;
    }

    onAddEvent({
      title: eventTitle,
      date: eventDate,
      endDate: eventEndDate || undefined,
      time: eventTime.trim() || undefined,
      description: eventDescription.trim() || undefined,
      location: eventDescription.trim() || undefined
    });

    setEventTitle('');
    setEventDate('');
    setEventEndDate('');
    setEventTime('');
    setEventDescription('');
    toast.success('Evento agendado com sucesso!');
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      toast.error('Preencha o título e o link do vídeo.');
      return;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    const thumbnail = videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=640';

    onAddVideo({
      title: videoTitle,
      url: videoUrl,
      thumbnail
    });

    setVideoTitle('');
    setVideoUrl('');
    toast.success('Vídeo cadastrado com sucesso!');
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newAdminEmail.trim().toLowerCase();
    if (!email) {
      toast.error('Informe um e-mail válido.');
      return;
    }

    const exists = admins.some((a) => a.email.toLowerCase() === email);
    if (exists) {
      toast.error('Este e-mail já está cadastrado como administrador.');
      return;
    }

    onAddAdmin(email);
    setNewAdminEmail('');
    toast.success('Administrador cadastrado com sucesso!');
  };

  return (
    <div id="admin-dashboard" className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20 transition-colors duration-200">
      {/* Top Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SesiLogo className="h-10 w-10" size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">
                  Painel Administrativo
                </h1>
                {dbStatus?.database?.connected ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {dbStatus?.database?.provider || 'Neon (PostgreSQL) Conectado'}
                  </span>
                ) : dbStatus?.database?.configured ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    PostgreSQL / Supabase
                  </span>
                ) : (
                  <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Modo Local / API
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Logado como: <span className="font-semibold text-gray-700 dark:text-neutral-200">{currentAdmin.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="admin-theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} className="text-amber-400" />
                  <span className="hidden sm:inline">Claro</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-indigo-600" />
                  <span className="hidden sm:inline">Escuro</span>
                </>
              )}
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="text-gray-600 dark:text-neutral-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-200 dark:border-neutral-700"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-neutral-800 mb-8 overflow-x-auto">
          <button
            id="tab-news-btn"
            onClick={() => setActiveTab('news')}
            className={`py-3 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'news'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30'
                : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Newspaper size={18} />
            Notícias ({articles.length})
          </button>
          <button
            id="tab-events-btn"
            onClick={() => setActiveTab('events')}
            className={`py-3 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'events'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30'
                : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Calendar size={18} />
            Eventos ({events.length})
          </button>
          <button
            id="tab-videos-btn"
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'videos'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30'
                : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Video size={18} />
            Vídeos ({videos.length})
          </button>
          <button
            id="tab-admins-btn"
            onClick={() => setActiveTab('admins')}
            className={`py-3 px-6 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'admins'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30'
                : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Users size={18} />
            Admins ({admins.length})
          </button>
        </div>

        {/* TAB 1: NOTÍCIAS */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 h-fit transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Plus size={18} className="text-red-600 dark:text-red-400" />
                Publicar Nova Notícia
              </h3>
              <form onSubmit={handleCreateArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Título da Notícia
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alunos vencem olimpíada de física"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    required
                  />
                </div>

                {/* Categoria com cores explícitas tanto em claro quanto no escuro */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 cursor-pointer font-medium"
                  >
                    <option value="Geral" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Geral</option>
                    <option value="Tecnologia" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Tecnologia</option>
                    <option value="Esportes" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Esportes</option>
                    <option value="Eventos" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Eventos</option>
                    <option value="Cultura" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Cultura</option>
                    <option value="Comunicado" className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100">Comunicado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    URL da Imagem de Capa
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={articleImage}
                    onChange={(e) => setArticleImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                  />
                  <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
                    Deixe em branco para usar uma imagem padrão do SESI.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Conteúdo / Texto da Notícia
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Escreva os parágrafos e detalhes da notícia aqui..."
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  Publicar Notícia
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Notícias Publicadas ({articles.length})
              </h3>
              <div className="space-y-3">
                {articles.map((item) => (
                  <div
                    key={item.id}
                    id={`admin-article-item-${item.id}`}
                    className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center gap-4 hover:border-gray-300 dark:hover:border-neutral-700 transition-all"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border border-gray-100 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Categoria Badge claramente visível em tema claro e escuro */}
                        <span className="text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-2 py-0.5 rounded uppercase">
                          {item.category || 'Geral'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-neutral-400">{item.date}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-neutral-100 text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {item.summary || item.content}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
                          onDeleteArticle(item.id);
                          toast.success('Notícia removida');
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 rounded-lg transition-colors cursor-pointer"
                      title="Remover Notícia"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                {articles.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 text-gray-400 dark:text-neutral-500 text-sm">
                    Nenhuma notícia cadastrada.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTOS */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 h-fit transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Plus size={18} className="text-red-600 dark:text-red-400" />
                Adicionar Evento
              </h3>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Nome do Evento
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião de Pais e Mestres"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Data do Evento
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Data final (opcional)
                  </label>
                  <input
                    type="date"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Horário (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 09:00 - 12:00"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    Local / Descrição (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Auditório Principal"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  Adicionar Evento
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Próximos Eventos ({events.length})
              </h3>
              <div className="space-y-3">
                {events.map((evt) => {
                  const dateObj = parseLocalDate(evt.date) || new Date(evt.date);
                  const monthName = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('pt-BR', { month: 'short' })
                    : 'EVT';
                  const dayNum = !isNaN(dateObj.getTime()) ? dateObj.getDate() : '•';

                  const isEncerrado = isEventEnded(evt.date, evt.status, now, evt.endDate);
                  const countdown = getEventCountdown(evt.date, now, evt.endDate);

                  return (
                    <div
                      key={evt.id}
                      id={`admin-event-item-${evt.id}`}
                      className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex gap-4 items-center min-w-0">
                        <div className={`px-3 py-2 rounded-lg text-center min-w-[60px] border ${
                          isEncerrado 
                            ? 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 border-gray-300 dark:border-neutral-700'
                            : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
                        }`}>
                          <span className="block text-xs font-bold uppercase">
                            {monthName}
                          </span>
                          <span className="block text-xl font-bold leading-none">
                            {dayNum}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 dark:text-white text-sm truncate">
                              {evt.title}
                            </span>
                            {isEncerrado ? (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-300 dark:border-neutral-700">
                                Encerrado
                              </span>
                            ) : countdown ? (
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${countdown.class}`}>
                                {countdown.label}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-gray-600 dark:text-neutral-300 text-xs flex flex-wrap gap-3 items-center mt-1">
                            {evt.time && (
                              <span className="flex items-center gap-1 font-medium">
                                <Clock size={12} className="text-red-500" />
                                <span>{evt.time}</span>
                              </span>
                            )}
                            {(evt.location || evt.description) && (
                              <span className="flex items-center gap-1 font-medium">
                                <MapPin size={12} className="text-red-500" />
                                <span>{evt.location || evt.description}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir este evento?')) {
                            onDeleteEvent(evt.id);
                            toast.success('Evento removido com sucesso');
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remover Evento"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}

                {events.length === 0 && (
                  <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 text-gray-400 dark:text-neutral-500 text-sm">
                    Nenhum evento agendado.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VÍDEOS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Adicionar Vídeo / Live
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-300 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 mb-4">
                Cole o link do YouTube (vídeo normal ou transmissão ao vivo). Você pode adicionar quantos vídeos desejar.
              </p>
              <form onSubmit={handleCreateVideo} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      Título do Vídeo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Feira de Ciências Ao Vivo"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                      URL do YouTube
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-semibold shadow-sm cursor-pointer"
                >
                  <Plus size={18} />
                  Adicionar Vídeo
                </button>
              </form>
            </div>

            {/* Video Grid */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 transition-colors">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase mb-4">
                Galeria de Vídeos ({videos.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((vid) => {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = vid.url.match(regExp);
                  const videoId = match && match[2].length === 11 ? match[2] : null;
                  const thumb = videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=640';

                  return (
                    <div
                      key={vid.id}
                      id={`admin-video-item-${vid.id}`}
                      className="bg-white dark:bg-neutral-800 p-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 group relative transition-colors"
                    >
                      <div className="aspect-video bg-gray-200 dark:bg-neutral-700 rounded-lg mb-2 overflow-hidden relative">
                        <img
                          src={thumb}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja apagar este vídeo?')) {
                              onDeleteVideo(vid.id);
                              toast.success('Vídeo removido');
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg z-10 cursor-pointer"
                          title="Apagar vídeo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <span className="font-medium text-sm block truncate px-1 text-gray-800 dark:text-neutral-200" title={vid.title}>
                        {vid.title}
                      </span>
                    </div>
                  );
                })}

                {videos.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-400 dark:text-neutral-500 text-sm">
                    Nenhum vídeo adicionado.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADMINS */}
        {activeTab === 'admins' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 h-fit transition-colors">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-red-600 dark:text-red-400" />
                Adicionar Administrador
              </h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase mb-1">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    placeholder="novo.admin@sesi.edu.br"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                    required
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                  Este usuário poderá criar sua própria senha no primeiro acesso à Área Administrativa.
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  Adicionar Admin
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Admins Atuais ({admins.length})
              </h3>
              <div className="space-y-3">
                {admins.map((adm) => {
                  const initial = adm.email.charAt(0).toUpperCase();

                  return (
                    <div
                      key={adm.id}
                      id={`admin-user-item-${adm.id}`}
                      className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-4 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 font-bold flex items-center justify-center text-sm border border-red-200 dark:border-red-900/50">
                          {initial}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-neutral-100 text-sm">{adm.email}</p>
                        </div>
                      </div>

                      {adm.id !== currentAdmin.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Remover acesso de ${adm.email}?`)) {
                              onDeleteAdmin(adm.id);
                              toast.success('Admin removido');
                            }
                          }}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Remover Admin"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
