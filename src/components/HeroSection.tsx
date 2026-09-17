import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Article } from '../types';

interface HeroSectionProps {
  articles: Article[];
  onClick: (article: Article) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ articles, onClick }) => {
  if (!articles || articles.length === 0) return null;

  // Display top 4 featured stories in rotation
  const featured = articles.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentArticle = featured[currentIndex] || featured[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  }, [featured.length]);

  // Automatic rotation every 5.5 seconds
  useEffect(() => {
    if (isPaused || featured.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, featured.length, handleNext]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
    setIsPaused(false);
  };

  return (
    <section
      id="hero-featured-cover"
      className="relative w-full bg-black text-white overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Capa de Notícias em Destaque"
    >
      {/* Background Hero Image with Fade/Zoom Transition */}
      <div className="relative min-h-[380px] h-[440px] sm:h-[500px] md:h-[560px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentArticle.image}
              alt={currentArticle.title}
              className="w-full h-full object-cover object-center"
            />
            {/* High-contrast gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Box */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end pb-10 sm:pb-14">
          <div className="container mx-auto px-4 sm:px-8 md:px-12 max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentArticle.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Category & Date */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="bg-red-600 text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                    {currentArticle.category || 'Destaque'}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-200 font-medium">
                    <Calendar size={13} className="text-red-400" />
                    {currentArticle.date}
                  </span>
                </div>

                {/* Headline */}
                <h2
                  onClick={() => onClick(currentArticle)}
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-2 sm:mb-3 cursor-pointer hover:text-red-400 transition-colors line-clamp-2 sm:line-clamp-3 max-w-4xl"
                >
                  {currentArticle.title}
                </h2>

                {/* Summary / Excerpt */}
                {(currentArticle.excerpt || currentArticle.content) && (
                  <p className="text-xs sm:text-base text-neutral-200 line-clamp-2 max-w-3xl mb-4 sm:mb-6 font-normal leading-relaxed">
                    {currentArticle.excerpt || currentArticle.content}
                  </p>
                )}

                {/* CTA Action */}
                <button
                  id="hero-open-article-btn"
                  type="button"
                  onClick={() => onClick(currentArticle)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Ler notícia completa</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        {featured.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-6 pointer-events-none">
            <button
              id="hero-carousel-prev"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Notícia anterior"
              className="pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              id="hero-carousel-next"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Próxima notícia"
              className="pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-red-600 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Clean Indicator Dots */}
        {featured.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-20 flex justify-center items-center gap-1.5 sm:gap-2">
            {featured.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  id={`hero-dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ver notícia ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 sm:w-8 bg-red-600'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
