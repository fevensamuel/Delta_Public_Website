// src/components/VideoThumbnail.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Video as VideoIcon } from 'lucide-react';
import { getFullImageUrl } from '../api/client';

const getYouTubeId = (url: string): string => {
  if (!url) return '';
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : '';
};

interface VideoThumbnailProps {
  thumbnailUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  alt?: string;
  className?: string;
  /** Second of the video to show as the preview picture. */
  previewSecond?: number;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  imageUrl,
  videoUrl,
  alt = '',
  className = 'w-full h-full object-cover',
  previewSecond = 1,
}) => {
  const savedImage = thumbnailUrl || imageUrl || '';
  const youTubeId = getYouTubeId(videoUrl || '');

  const [savedImageFailed, setSavedImageFailed] = useState(false);
  const [youTubeFailed, setYouTubeFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  // Only start loading a video file once its card is close to the screen, so a page
  // with many videos does not start downloading all of them at the same time.
  useEffect(() => {
    const node = holderRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const placeholder = (
    <div className="w-full h-full bg-[#17130F] flex items-center justify-center">
      <VideoIcon className="w-7 h-7 text-[#A6853A] opacity-60" />
    </div>
  );

  // 1. Saved thumbnail
  if (savedImage && !savedImageFailed) {
    return (
      <img
        src={getFullImageUrl(savedImage)}
        alt={alt}
        loading="lazy"
        className={className}
        onError={() => setSavedImageFailed(true)}
      />
    );
  }

  // 2. YouTube thumbnail
  if (youTubeId && !youTubeFailed) {
    return (
      <img
        src={`https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`}
        alt={alt}
        loading="lazy"
        className={className}
        onError={() => setYouTubeFailed(true)}
      />
    );
  }

  // 3. First frame of the video file
  if (videoUrl && !youTubeId && !videoFailed) {
    return (
      <div ref={holderRef} className="w-full h-full bg-[#0E0C0A]">
        {nearViewport && (
          <video
            src={`${getFullImageUrl(videoUrl)}#t=${previewSecond}`}
            preload="metadata"
            muted
            playsInline
            tabIndex={-1}
            aria-hidden="true"
            draggable={false}
            className={`${className} pointer-events-none`}
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>
    );
  }

  // 4. Nothing usable
  return placeholder;
};

export default VideoThumbnail;
