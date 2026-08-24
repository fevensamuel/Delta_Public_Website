import React, { useState, useEffect, useRef } from 'react';
import { GalleryItem, Language } from '../types';
import { fetchGalleryItems, getFullImageUrl } from '../api/client';
import { translations } from '../translations';
import { 
  X, 
  MapPin, 
  Download, 
  Share2, 
  Check,
  Play,
  Film,
  Image as ImageIcon,
  Clock,
  Loader2
} from 'lucide-react';

interface GalleryProps {
  lang: Language;
}

// Helper to check if URL is YouTube
const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper to get YouTube embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/watch?v= format
  if (url.includes('watch?v=')) {
    const videoId = url.split('watch?v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Handle youtube.com/embed/ format (already an embed URL)
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  // Handle youtu.be with playlist
  if (url.includes('youtu.be/') && url.includes('&list=')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Not a YouTube URL, return as-is (for direct video files)
  return url;
};

export const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const t = translations[lang] || translations.EN;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadGallery();
  }, [typeFilter]);

  const loadGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGalleryItems(typeFilter);
      setItems(data);
      console.log('📸 Gallery items loaded:', data);
      // Log each item's thumbnail info for debugging
      data.forEach(item => {
        console.log(`🖼️ Item ${item.id}:`, {
          type: item.type,
          imageUrl: item.imageUrl,
          thumbnailUrl: item.thumbnailUrl,
          videoUrl: item.videoUrl,
          fullImageUrl: item.imageUrl ? getFullImageUrl(item.imageUrl) : 'none',
          fullThumbnailUrl: item.thumbnailUrl ? getFullImageUrl(item.thumbnailUrl) : 'none'
        });
      });
    } catch (e) {
      setError('Failed to load gallery. Please refresh.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    // Reset video when opening
    if (videoRef.current) {
      videoRef.current.load();
      setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
        <p className="text-xs font-semibold">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">{error}</p>
        <button onClick={loadGallery} className="mt-4 text-[#C8102E] underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16 bg-[#F9F9F9] text-slate-800">
      
      {/* Header Banner */}
      <section className="bg-[#0b0f19] text-white py-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-red-900/50 text-red-400 font-bold text-xs uppercase tracking-wider border border-red-800/60">
            Media Library
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-sans text-white">
            Photo & Video Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Explore holy sites and sacred moments from Makkah, Madinah, and Umrah journeys.
          </p>
        </div>
      </section>

      {/* TYPE FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              typeFilter === 'all'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>All Media</span>
          </button>

          <button
            onClick={() => setTypeFilter('photo')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              typeFilter === 'photo'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos</span>
          </button>

          <button
            onClick={() => setTypeFilter('video')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              typeFilter === 'video'
                ? 'bg-[#C8102E] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Videos</span>
          </button>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-500 text-sm font-semibold">No gallery items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              // Determine which image to display
              // For videos: use thumbnailUrl first, then fallback to imageUrl
              // For photos: use imageUrl
              let displayImage = '';
              
              if (item.type === 'video') {
                // For videos, use thumbnailUrl, fallback to imageUrl
                displayImage = item.thumbnailUrl || item.imageUrl || '';
              } else {
                // For photos, use imageUrl
                displayImage = item.imageUrl || '';
              }
              
              const imageUrl = displayImage ? getFullImageUrl(displayImage) : '';
              const videoUrl = item.videoUrl ? getFullImageUrl(item.videoUrl) : '';
              
              // Debug logging
              console.log(`🖼️ Rendering item ${item.id}:`, { 
                type: item.type, 
                displayImage, 
                imageUrl,
                thumbnailUrl: item.thumbnailUrl,
                originalImageUrl: item.imageUrl
              });

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenLightbox(item)}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col aspect-[16/10]"
                >
                  <div className="w-full h-full relative overflow-hidden bg-slate-900">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={lang === 'AR' ? (item.titleAr || item.titleEn) : item.titleEn}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl);
                          (e.target as HTMLImageElement).style.display = 'none';
                          // Show fallback
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs';
                            fallback.textContent = item.type === 'video' ? '🎬 Video' : '📷 No Image';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                        {item.type === 'video' ? '🎬 Video' : '📷 No Image'}
                      </div>
                    )}

                    {item.type === 'video' && (
                      <>
                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-slate-700/80 z-10 shadow">
                          <span>▶</span>
                          {item.duration && <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded">{item.duration}</span>}
                        </div>

                        <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center transition-all group-hover:bg-slate-950/20 z-10">
                          <div className="w-14 h-14 rounded-full bg-white/95 text-[#1A5B4B] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-7 h-7 fill-[#1A5B4B] ml-1" />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                      <h3 className="font-bold text-sm text-white drop-shadow-sm mb-0.5">
                        {lang === 'AR' ? (item.titleAr || item.titleEn) : item.titleEn}
                      </h3>
                      {item.location && (
                        <p className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" /> {item.location}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-[10px] text-slate-300 line-clamp-1 mt-1 font-normal opacity-90">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setSelectedItem(null);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative flex flex-col md:flex-row max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSelectedItem(null);
                if (videoRef.current) {
                  videoRef.current.pause();
                }
              }}
              className="absolute top-4 right-4 z-30 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full border border-slate-700 shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[280px] md:min-h-[460px]">
              {selectedItem.type === 'video' ? (
                // Check if it's a YouTube URL
                isYouTubeUrl(selectedItem.videoUrl || '') ? (
                  // YouTube embed
                  <iframe
                    src={getYouTubeEmbedUrl(selectedItem.videoUrl || '')}
                    className="w-full h-full max-h-[70vh] aspect-video"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title={selectedItem.titleEn}
                    frameBorder="0"
                  />
                ) : (
                  // Direct video file
                  <video
                    ref={videoRef}
                    src={selectedItem.videoUrl ? getFullImageUrl(selectedItem.videoUrl) : ''}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[70vh] object-contain"
                    controlsList="nodownload"
                    poster={
                      // Use thumbnailUrl as poster, fallback to imageUrl
                      selectedItem.thumbnailUrl 
                        ? getFullImageUrl(selectedItem.thumbnailUrl) 
                        : (selectedItem.imageUrl ? getFullImageUrl(selectedItem.imageUrl) : undefined)
                    }
                    onError={(e) => {
                      console.error('Video playback error:', e);
                      console.log('Video URL:', selectedItem.videoUrl);
                    }}
                  />
                )
              ) : (
                <img
                  src={selectedItem.imageUrl ? getFullImageUrl(selectedItem.imageUrl) : ''}
                  alt={selectedItem.titleEn}
                  className="w-full h-full max-h-[70vh] object-contain"
                  onError={(e) => {
                    console.error('Image load error:', e);
                  }}
                />
              )}
            </div>

            <div className="md:w-2/5 p-6 space-y-4 flex flex-col justify-between bg-slate-900 text-slate-100 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-red-900/60 text-red-300 text-[10px] font-extrabold rounded-full uppercase tracking-wider inline-block border border-red-800/80">
                    {selectedItem.type === 'video' ? '🎥 VIDEO' : '🖼️ PHOTO'}
                  </span>
                  {selectedItem.type === 'video' && selectedItem.duration && (
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-red-400" /> {selectedItem.duration}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-black text-white leading-snug">
                  {lang === 'AR' ? (selectedItem.titleAr || selectedItem.titleEn) : selectedItem.titleEn}
                </h2>

                {selectedItem.titleAr && lang !== 'AR' && (
                  <p className="text-xs text-amber-400 font-arabic font-bold" dir="rtl">
                    {selectedItem.titleAr}
                  </p>
                )}

                {selectedItem.location && (
                  <p className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" /> {selectedItem.location}
                  </p>
                )}

                {selectedItem.description && (
                  <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
                    {selectedItem.description}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-slate-300" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Media'}</span>
                </button>

                {selectedItem.type === 'photo' && (
                  <a
                    href={selectedItem.imageUrl ? getFullImageUrl(selectedItem.imageUrl) : '#'}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="bg-[#C8102E] hover:bg-[#a60d25] text-white font-bold text-xs p-2.5 rounded-xl shadow transition-colors"
                    title="Download / View full resolution photo"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};