'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { vkPlaylists, VKPlaylist, VKVideo } from '@/app/data/vk-playlists';
import { CyberText } from './cyber-text';
import { VideoModal } from './video-modal';

interface VideoCollectionBlockProps {
  className?: string;
}

interface PlaylistCardProps {
  playlist: VKPlaylist;
  onVideoClick: (video: VKVideo) => void;
}

interface VideoCardProps {
  video: VKVideo;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <motion.div
      className="group relative cursor-pointer"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video">
        {/* VK iframe без автоматического воспроизведения при hover */}
        <iframe
          src={video.videoUrl}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onVideoClick }) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Playlist Header - только название */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">
          {playlist.title}
        </h3>
      </div>
      
      {/* Video Grid - увеличенные превью */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {playlist.videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => onVideoClick(video)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export const VideoCollectionBlock: React.FC<VideoCollectionBlockProps> = ({ className = '' }) => {
  const [selectedVideo, setSelectedVideo] = useState<VKVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVideoClick = (video: VKVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <section className={`py-32 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center font-heading uppercase tracking-wide">
          НАПРАВЛЕНИЯ
        </h2>

        {/* Playlists Grid */}
        <div className="space-y-6">
          {vkPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <PlaylistCard 
                playlist={playlist} 
                onVideoClick={handleVideoClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          videoSrc={selectedVideo.videoUrl}
        />
      )}
    </section>
  );
}; 