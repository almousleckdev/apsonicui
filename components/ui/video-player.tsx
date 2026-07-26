"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  youtubeId: string;
  thumbnail: string;
  title: string;
  description?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  thumbnail,
  title,
  description,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative group rounded-3xl overflow-hidden bg-zinc-950 shadow-lg border border-zinc-900",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-video w-full h-full cursor-pointer flex flex-col justify-end"
            onClick={() => setIsPlaying(true)}
          >
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/35 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </div>
            </div>
            {description && (
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="text-white font-extrabold text-sm sm:text-base">{title}</h4>
                <p className="text-zinc-300 text-xs mt-1 leading-relaxed line-clamp-1 font-medium">
                  {description}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative aspect-video w-full h-full bg-black"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 border-0"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(false);
              }}
              className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80 transition-colors backdrop-blur-md cursor-pointer border border-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
