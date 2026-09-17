import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { VideoItem } from '../types';

interface VideosSectionProps {
  videos: VideoItem[];
}

export const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
  };

  return (
    <section id="videos" className="py-12 sm:py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-2 bg-red-600 rounded-lg">
            <Play className="text-white fill-current" size={20} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Vídeos & Transmissões
          </h2>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => {
            const embedUrl = getYoutubeEmbedUrl(video.url);

            return (
              <div
                key={video.id}
                id={`video-card-${video.id}`}
                onClick={() => {
                  if (embedUrl) {
                    setSelectedVideo(video);
                  } else {
                    window.open(video.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl group cursor-pointer block border border-gray-700/50"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={24} className="fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-2 group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            );
          })}

          {videos.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              Nenhum vídeo disponível no momento.
            </div>
          )}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div
          id="video-player-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
              <h3 className="font-bold text-white text-lg truncate pr-4">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            <div className="relative aspect-video w-full">
              {getYoutubeEmbedUrl(selectedVideo.url) && (
                <iframe
                  src={getYoutubeEmbedUrl(selectedVideo.url)!}
                  title={selectedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
