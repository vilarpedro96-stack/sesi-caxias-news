import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { NewsAndEvents } from './components/NewsAndEvents';
import { VideosSection } from './components/VideosSection';
import { ArticleView } from './components/ArticleView';
import { CalendarView } from './components/CalendarView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { apiService } from './services/api';
import {
  INITIAL_ARTICLES,
  INITIAL_EVENTS,
  INITIAL_VIDEOS,
  INITIAL_ADMINS
} from './data/defaultData';
import { Article, SchoolEvent, VideoItem, AdminUser, AppView } from './types';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const [usingNeon, setUsingNeon] = useState(false);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);

  const readCache = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const refreshAllData = async () => {
    try {
      const status = await apiService.getStatus();
      const neonOk = Boolean(status.database?.connected);
      setUsingNeon(neonOk);

      const [fetchedArticles, fetchedEvents, fetchedVideos, fetchedAdmins] = await Promise.allSettled([
        apiService.getArticles(),
        apiService.getEvents(),
        apiService.getVideos(),
        apiService.getAdmins()
      ]);

      if (fetchedArticles.status === 'fulfilled') {
        setArticles(fetchedArticles.value);
      } else if (!neonOk) {
        setArticles(readCache('sesi_news_articles', INITIAL_ARTICLES));
      }
      if (fetchedEvents.status === 'fulfilled') {
        setEvents(fetchedEvents.value);
      } else if (!neonOk) {
        setEvents(readCache('sesi_news_events_v2', INITIAL_EVENTS));
      }
      if (fetchedVideos.status === 'fulfilled') {
        setVideos(fetchedVideos.value);
      } else if (!neonOk) {
        setVideos(readCache('sesi_news_videos', INITIAL_VIDEOS));
      }
      if (fetchedAdmins.status === 'fulfilled') {
        setAdmins(fetchedAdmins.value);
      } else if (!neonOk) {
        setAdmins(readCache('sesi_news_admins', INITIAL_ADMINS));
      }
    } catch (e) {
      console.warn('Could not sync with backend on startup:', e);
      setUsingNeon(false);
      setArticles(readCache('sesi_news_articles', INITIAL_ARTICLES));
      setEvents(readCache('sesi_news_events_v2', INITIAL_EVENTS));
      setVideos(readCache('sesi_news_videos', INITIAL_VIDEOS));
      setAdmins(readCache('sesi_news_admins', INITIAL_ADMINS));
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  useEffect(() => {
    if (usingNeon) return;
    localStorage.setItem('sesi_news_articles', JSON.stringify(articles));
  }, [articles, usingNeon]);

  useEffect(() => {
    if (usingNeon) return;
    localStorage.setItem('sesi_news_events_v2', JSON.stringify(events));
  }, [events, usingNeon]);

  useEffect(() => {
    if (usingNeon) return;
    localStorage.setItem('sesi_news_videos', JSON.stringify(videos));
  }, [videos, usingNeon]);

  useEffect(() => {
    if (usingNeon) return;
    localStorage.setItem('sesi_news_admins', JSON.stringify(admins));
  }, [admins, usingNeon]);

  // Navigation handlers
  const handleHomeClick = () => {
    setCurrentView('home');
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideosClick = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setSelectedArticle(null);
      setTimeout(() => {
        const el = document.getElementById('videos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('videos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalendarClick = () => {
    setCurrentView('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CRUD for Articles
  const handleAddArticle = async (newArticle: Omit<Article, 'id'>) => {
    try {
      const created = await apiService.addArticle(newArticle);
      setArticles((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
    } catch (e) {
      toast.error('Nao foi possivel salvar a noticia no banco. Tente de novo.');
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await apiService.deleteArticle(id);
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD for Events
  const handleAddEvent = async (newEvent: Omit<SchoolEvent, 'id'>) => {
    try {
      const created = await apiService.addEvent(newEvent);
      setEvents((prev) => [...prev, created]);
    } catch (e) {
      toast.error('Nao foi possivel salvar o evento no banco. Tente de novo.');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await apiService.deleteEvent(id);
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // CRUD for Videos
  const handleAddVideo = async (newVideo: Omit<VideoItem, 'id'>) => {
    try {
      const created = await apiService.addVideo(newVideo);
      setVideos((prev) => [created, ...prev.filter((v) => v.id !== created.id)]);
    } catch (e) {
      toast.error('Nao foi possivel salvar o video no banco. Tente de novo.');
    }
  };

  const handleDeleteVideo = async (id: number) => {
    try {
      await apiService.deleteVideo(id);
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // CRUD for Admins
  const handleAddAdmin = async (email: string) => {
    try {
      const created = await apiService.addAdmin(email);
      setAdmins((prev) => [...prev, created]);
    } catch (e) {
      toast.error('Nao foi possivel salvar o admin no banco. Tente de novo.');
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    try {
      await apiService.deleteAdmin(id);
    } catch (e) {
      console.warn('Backend delete failed, removing locally:', e);
    }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateAdminPassword = async (adminId: number, newPassword: string) => {
    await apiService.setupPassword(adminId, newPassword);
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, password: null, isPending: false } : a))
    );
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setCurrentView('home');
    toast.info('Sessão encerrada.');
  };

  return (
    <div id="sesi-news-app" className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 selection:bg-red-600 selection:text-white transition-colors duration-200">
      <Toaster richColors position="top-right" />

      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Header (shown on public views) */}
      {currentView !== 'admin' && (
        <Header
          onHomeClick={handleHomeClick}
          onVideosClick={handleVideosClick}
          onAdminClick={handleAdminClick}
          onCalendarClick={handleCalendarClick}
        />
      )}

      {/* Dynamic View Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              articles={articles}
              onClick={handleArticleClick}
            />
            <NewsAndEvents
              articles={articles}
              events={events}
              onArticleClick={handleArticleClick}
              onCalendarClick={handleCalendarClick}
            />
            <VideosSection videos={videos} />
          </>
        )}

        {currentView === 'article' && selectedArticle && (
          <ArticleView
            article={selectedArticle}
            onBack={handleHomeClick}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            events={events}
            onBack={handleHomeClick}
          />
        )}

        {currentView === 'admin' && (
          <>
            {!currentAdmin ? (
              <AdminLogin
                admins={admins}
                onLoginSuccess={(adm) => setCurrentAdmin(adm)}
                onUpdateAdminPassword={handleUpdateAdminPassword}
                onBack={handleHomeClick}
              />
            ) : (
              <AdminDashboard
                currentAdmin={currentAdmin}
                articles={articles}
                events={events}
                videos={videos}
                admins={admins}
                onAddArticle={handleAddArticle}
                onDeleteArticle={handleDeleteArticle}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onAddVideo={handleAddVideo}
                onDeleteVideo={handleDeleteVideo}
                onAddAdmin={handleAddAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onLogout={handleAdminLogout}
                onRefreshData={refreshAllData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {currentView !== 'admin' && <Footer />}
    </div>
  );
}
