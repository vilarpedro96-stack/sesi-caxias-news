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

  // States
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('sesi_news_articles');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    try {
      const saved = localStorage.getItem('sesi_news_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          return parsed;
        }
      }
      localStorage.setItem('sesi_news_events_v2', JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('sesi_news_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('sesi_news_admins');
      return saved ? JSON.parse(saved) : INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  });

  // Fetch initial data from Backend API
  const refreshAllData = async () => {
    try {
      const [fetchedArticles, fetchedEvents, fetchedVideos, fetchedAdmins] = await Promise.allSettled([
        apiService.getArticles(),
        apiService.getEvents(),
        apiService.getVideos(),
        apiService.getAdmins()
      ]);

      if (fetchedArticles.status === 'fulfilled' && fetchedArticles.value.length > 0) {
        setArticles(fetchedArticles.value);
      }
      if (fetchedEvents.status === 'fulfilled' && fetchedEvents.value.length > 0) {
        setEvents(fetchedEvents.value);
      }
      if (fetchedVideos.status === 'fulfilled' && fetchedVideos.value.length > 0) {
        setVideos(fetchedVideos.value);
      }
      if (fetchedAdmins.status === 'fulfilled' && fetchedAdmins.value.length > 0) {
        setAdmins(fetchedAdmins.value);
      }
    } catch (e) {
      console.warn('Could not sync with backend on startup:', e);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Sync state changes with localStorage as offline cache
  useEffect(() => {
    localStorage.setItem('sesi_news_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('sesi_news_events_v2', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('sesi_news_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('sesi_news_admins', JSON.stringify(admins));
  }, [admins]);

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
    try {
      await apiService.setupPassword(adminId, newPassword);
    } catch (e) {
      console.warn('Backend password setup error, saving locally:', e);
    }
    setAdmins((prev) =>
      prev.map((a) => (a.id === adminId ? { ...a, password: newPassword, isPending: false } : a))
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
