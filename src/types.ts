export interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  content?: string;
}

export interface SchoolEvent {
  id: number;
  title: string;
  date: string;
  time?: string;
  description?: string;
  location?: string;
  status?: 'encerrado' | 'agendado';
}

export interface VideoItem {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  password?: string | null;
  isPending?: boolean;
}

export type AppView = 'home' | 'article' | 'calendar' | 'admin';
