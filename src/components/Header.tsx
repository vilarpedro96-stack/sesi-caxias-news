import React, { useState } from 'react';
import { Lock, Video, Calendar, Menu, X, Sun, Moon } from 'lucide-react';
import { SesiLogo } from './SesiLogo';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onAdminClick: () => void;
  onHomeClick: () => void;
  onVideosClick: () => void;
  onCalendarClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAdminClick,
  onHomeClick,
  onVideosClick,
  onCalendarClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      id="main-header"
      className="bg-white dark:bg-neutral-900 shadow-xs border-b border-gray-200/80 dark:border-neutral-800 sticky top-0 z-40 transition-colors duration-200"
    >
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex justify-between items-center">
          {/* Logo & Brand - Perfectly visible and sharp on mobile and desktop */}
          <div
            id="header-brand-logo"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group min-w-0"
            onClick={onHomeClick}
          >
            <div className="relative shrink-0">
              <SesiLogo className="h-10 w-10 sm:h-14 sm:w-14 transition-transform group-hover:scale-105" size={48} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-base sm:text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none transition-colors truncate">
                SESI CAXIAS NEWS
              </h1>
              <p className="text-[9px] sm:text-[11px] text-red-600 dark:text-red-400 font-bold tracking-wider uppercase mt-0.5 truncate">
                Escola que informa
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            <button
              id="nav-home-btn"
              onClick={onHomeClick}
              className="text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition-colors cursor-pointer"
            >
              Início
            </button>
            {onCalendarClick && (
              <button
                id="nav-calendar-btn"
                onClick={onCalendarClick}
                className="text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar size={16} className="text-red-500" />
                <span>Agenda</span>
              </button>
            )}
            <button
              id="nav-videos-btn"
              onClick={onVideosClick}
              className="text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Video size={16} />
              <span>Vídeos</span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              id="theme-toggle-desktop"
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/60 flex items-center gap-2 text-xs font-semibold shadow-xs active:scale-95"
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              aria-label="Alternar tema claro e escuro"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} className="text-amber-400 fill-amber-400/20" />
                  <span className="text-neutral-200">Claro</span>
                </>
              ) : (
                <>
                  <Moon size={16} className="text-indigo-600 fill-indigo-600/20" />
                  <span className="text-gray-800">Escuro</span>
                </>
              )}
            </button>

            {/* Admin Portal Button */}
            <button
              id="nav-admin-btn"
              onClick={onAdminClick}
              className="bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-900 dark:text-gray-100 px-3.5 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 text-xs cursor-pointer border border-gray-300 dark:border-neutral-700 shadow-xs active:scale-95"
            >
              <Lock size={14} className="text-red-600 dark:text-red-400" />
              <span>Área Admin</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Large, easy touch buttons */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              id="theme-toggle-mobile"
              type="button"
              onClick={toggleTheme}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 cursor-pointer shadow-xs active:scale-90 transition-transform"
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-indigo-600" />
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-gray-900 dark:text-white border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 cursor-pointer shadow-xs active:scale-90 transition-transform"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 p-4 shadow-lg transition-colors"
        >
          <div className="flex flex-col gap-2">
            <button
              id="mobile-nav-home"
              onClick={() => {
                onHomeClick();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 font-bold cursor-pointer text-sm transition-colors"
            >
              Início
            </button>

            {onCalendarClick && (
              <button
                id="mobile-nav-calendar"
                onClick={() => {
                  onCalendarClick();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 font-bold cursor-pointer text-sm flex items-center gap-2.5 transition-colors"
              >
                <Calendar size={18} className="text-red-500" />
                <span>Agenda Escolar</span>
              </button>
            )}

            <button
              id="mobile-nav-videos"
              onClick={() => {
                onVideosClick();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 font-bold cursor-pointer text-sm flex items-center gap-2.5 transition-colors"
            >
              <Video size={18} className="text-red-500" />
              <span>Vídeos & Transmissões</span>
            </button>

            {/* Dedicated Theme Toggle Item inside Mobile Menu */}
            <button
              id="mobile-menu-theme-btn"
              type="button"
              onClick={() => {
                toggleTheme();
              }}
              className="text-left py-2.5 px-3 rounded-lg bg-gray-50 dark:bg-neutral-800/80 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white font-bold cursor-pointer text-sm flex items-center justify-between transition-colors my-1"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-indigo-600" />
                )}
                <span>Tema: {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
              </div>
              <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 bg-white dark:bg-neutral-700 px-2 py-0.5 rounded-md border border-gray-200 dark:border-neutral-600">
                Alternar
              </span>
            </button>

            <button
              id="mobile-nav-admin"
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold flex items-center gap-2.5 cursor-pointer text-sm transition-colors border-t border-gray-100 dark:border-neutral-800 mt-1 pt-3"
            >
              <Lock size={18} />
              <span>Área Administrativa</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
