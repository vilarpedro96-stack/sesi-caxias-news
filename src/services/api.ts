import { Article, SchoolEvent, VideoItem, AdminUser } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Status
  async getStatus(): Promise<{
    status: string;
    database: {
      type: string;
      configured: boolean;
      connected: boolean;
      url?: string | null;
      error?: string | null;
    };
  }> {
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend status check error:', e);
    }
    return {
      status: 'offline',
      database: {
        type: 'local',
        configured: false,
        connected: false
      }
    };
  },

  // Seed
  async seedDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
    return await res.json();
  },

  // Articles
  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${API_BASE}/articles`);
    if (!res.ok) throw new Error('Falha ao buscar notícias');
    return await res.json();
  },

  async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    if (!res.ok) throw new Error('Falha ao adicionar notícia');
    return await res.json();
  },

  async deleteArticle(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Falha ao excluir notícia');
  },

  // Events
  async getEvents(): Promise<SchoolEvent[]> {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Falha ao buscar eventos');
    return await res.json();
  },

  async addEvent(event: Omit<SchoolEvent, 'id'>): Promise<SchoolEvent> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Falha ao adicionar evento');
    return await res.json();
  },

  async deleteEvent(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Falha ao excluir evento');
  },

  // Videos
  async getVideos(): Promise<VideoItem[]> {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error('Falha ao buscar vídeos');
    return await res.json();
  },

  async addVideo(video: Omit<VideoItem, 'id'>): Promise<VideoItem> {
    const res = await fetch(`${API_BASE}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video)
    });
    if (!res.ok) throw new Error('Falha ao adicionar vídeo');
    return await res.json();
  },

  async deleteVideo(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Falha ao excluir vídeo');
  },

  // Admins
  async getAdmins(): Promise<AdminUser[]> {
    const res = await fetch(`${API_BASE}/admins`);
    if (!res.ok) throw new Error('Falha ao buscar administradores');
    return await res.json();
  },

  async login(email: string, password?: string): Promise<{ isPending: boolean; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/admins/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro ao fazer login' }));
      throw new Error(err.error || 'Erro no login');
    }
    return await res.json();
  },

  async setupPassword(adminId: number, password: string): Promise<{ success: boolean; admin: AdminUser }> {
    const res = await fetch(`${API_BASE}/admins/setup-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro ao cadastrar senha' }));
      throw new Error(err.error || 'Erro ao cadastrar senha');
    }
    return await res.json();
  },

  async addAdmin(email: string): Promise<AdminUser> {
    const res = await fetch(`${API_BASE}/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro ao adicionar admin' }));
      throw new Error(err.error || 'Erro ao adicionar admin');
    }
    return await res.json();
  },

  async deleteAdmin(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admins/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Falha ao excluir administrador');
  }
};
