import { useState } from 'react';
import type { ImageItem } from '../types';
import { useImageGallery } from '../hooks/useImageGallery';

export const ImageGallery = () => {
  const { images, isLoading, error, refresh } = useImageGallery(true);

  if (isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>
          <div className="absolute inset-1 rounded-full bg-[#0f0f23]"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading your gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-6 py-2.5 rounded-xl bg-red-500/20 text-red-300 font-medium hover:bg-red-500/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
        <p className="text-gray-400">Upload your first image to see AI magic in action!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm">
              {images.length}
            </span>
            Your Gallery
          </h2>
          <p className="text-gray-400 mt-1">AI-analyzed images with auto-generated metadata</p>
        </div>
        <button
          onClick={refresh}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-gray-300 group-hover:text-white transition-colors font-medium">Refresh</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <ImageCard 
            key={`${image.userId}-${image.timestamp}`} 
            image={image} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const ImageCard = ({ image, index }: { image: ImageItem; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Container */}
      <div className="aspect-[4/3] bg-gray-900/50 relative overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-spin"></div>
              <div className="absolute inset-1 rounded-full bg-gray-900"></div>
            </div>
          </div>
        )}
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/80">
            <svg className="w-12 h-12 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">Image unavailable</p>
          </div>
        ) : (
          <img
            src={image.s3Url}
            alt={image.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Date badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-white/80">
          {new Date(image.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {image.title}
        </h3>
        
        {/* Caption */}
        <p 
          className={`text-sm text-gray-400 mb-4 cursor-pointer transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {image.caption}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {image.tags.slice(0, isExpanded ? image.tags.length : 4).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2.5 py-1 text-xs font-medium rounded-lg tag-gradient text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-default"
            >
              #{tag}
            </span>
          ))}
          {!isExpanded && image.tags.length > 4 && (
            <span 
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-800 text-gray-400 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => setIsExpanded(true)}
            >
              +{image.tags.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
