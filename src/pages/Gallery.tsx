import React, { useState, useEffect } from 'react';
import { GalleryItem, Language } from '../types';
import { INITIAL_GALLERY } from '../data/initialData';
import { fetchGalleryItems } from '../api/client';
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

export const Gallery: React.FC<GalleryProps> = ({ lang }) => {
  const t = translations[lang] || translations.EN;

  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [loading, setLoading] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    loadGalleryData();
  }, [typeFilter]);

  const loadGalleryData = async () => {
    setLoading(true);
    try {
      const fetched = await fetchGalleryItems(typeFilter);
      if (fetched && fetched.length > 0) {
        setItems(fetched);
      } else {
        // Fallback to local data filtering
        const local = INITIAL_GALLERY.filter((item) => {
          if (typeFilter === 'all') return true;
          return item.type === typeFilter;
        });
        setItems(local);
      }
    } catch (e) {
      const local = INITIAL_GALLERY.filter((item) => {
        if (typeFilter === 'all') return true;
        return item.type === typeFilter;
      });
      setItems(local);
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
    setIsPlayingVideo(false);
  };

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
            Explore holy sites and sacred moments from Makkah al-Mukarramah, Madinah al-Munawwarah, group departures, and video recordings of spiritual rituals.
          </p>
        </div>
      </section>

      {/* TYPE FILTER (No Category) */}
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
            <p className="text-xs font-semibold">Loading media library...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-slate-500 text-sm font-semibold">No gallery items found.</p>
            <button
              onClick={() => setTypeFilter('all')}
              className="text-xs font-bold text-[#C8102E] underline"
            >
              Reset Type Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(item)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col aspect-[16/10]"
              >
                {/* Image / Thumbnail */}
                <div className="w-full h-full relative overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={lang === 'AR' ? (item.titleAr || item.title) : item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Video Duration Badge */}
                  {item.type === 'video' && (
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-slate-700/80 z-10 shadow">
                      <span>▶</span>
                      {item.duration && <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded">{item.duration}</span>}
                    </div>
                  )}

                  {/* Video Play Overlay */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center transition-all group-hover:bg-slate-950/20 z-10">
                      <div className="w-14 h-14 rounded-full bg-white/95 text-[#1A5B4B] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-7 h-7 fill-[#1A5B4B] ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Info Hover Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent text-white transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                    <h3 className="font-bold text-sm text-white drop-shadow-sm mb-0.5">
                      {lang === 'AR' ? (item.titleAr || item.title) : item.title}
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
            ))}
          </div>
        )}
      </section>

      {/* GALLERY LIGHTBOX MODAL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative flex flex-col md:flex-row max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-30 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-full border border-slate-700 shadow-md transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Display Container (Video or Image) */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[280px] md:min-h-[460px]">
              {selectedItem.type === 'video' ? (
                isPlayingVideo || !selectedItem.imageUrl ? (
                  <video 
                    src={selectedItem.videoUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={selectedItem.imageUrl} 
                      alt={selectedItem.title} 
                      className="w-full h-full max-h-[70vh] object-contain opacity-90" 
                    />
                    <button 
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute w-16 h-16 rounded-full bg-white/90 text-[#1A5B4B] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Play className="w-8 h-8 fill-[#1A5B4B] ml-1" />
                    </button>
                  </div>
                )
              ) : (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              )}
            </div>

            {/* Info Panel */}
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
                  {lang === 'AR' ? (selectedItem.titleAr || selectedItem.title) : selectedItem.title}
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

              {/* Controls */}
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
                    href={selectedItem.imageUrl}
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

