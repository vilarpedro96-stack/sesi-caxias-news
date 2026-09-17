import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Share2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Article } from '../types';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  return (
    <motion.div
      id="article-detail-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20 transition-colors duration-200"
    >
      {/* Article Cover Hero */}
      <div className="relative h-[380px] sm:h-[460px] w-full bg-black">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <button
          id="article-top-back-btn"
          onClick={onBack}
          className="absolute top-6 left-4 md:left-8 bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-semibold text-sm z-10 cursor-pointer shadow-lg"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
      </div>

      {/* Article Content Body */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 sm:p-10 md:p-12 max-w-4xl mx-auto border border-gray-200 dark:border-neutral-800 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-xs">
                {article.category || 'Geral'}
              </span>
              <span className="flex items-center gap-1.5 text-gray-700 dark:text-neutral-300 font-semibold text-xs">
                <Calendar size={14} className="text-red-500" />
                <span>{article.date}</span>
              </span>
            </div>

            <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-neutral-400 font-medium">
              <Clock size={13} />
              <span>3 min de leitura</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="text-gray-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line text-base sm:text-lg font-normal space-y-4">
            {article.content || article.excerpt}
          </div>

          <hr className="my-10 border-gray-200 dark:border-neutral-800" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              id="article-bottom-back-btn"
              onClick={onBack}
              className="text-gray-800 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Voltar para notícias</span>
            </button>

            <button
              id="article-share-btn"
              onClick={handleShare}
              className="text-white bg-red-600 hover:bg-red-700 flex items-center gap-2 font-bold text-xs py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20 active:scale-95"
            >
              <Share2 size={16} />
              <span>Compartilhar Notícia</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
