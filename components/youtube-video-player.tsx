"use client"

import { useState, useEffect } from "react"

interface YouTubeVideoPlayerProps {
  videoId: string
  className?: string
}

export function YouTubeVideoPlayer({ videoId, className = "" }: YouTubeVideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Reset states when videoId changes
    setIsLoading(true)
    setHasError(false)
  }, [videoId])

  // Ensure videoId is a string and not undefined or null
  if (!videoId) {
    return (
      <div
        className={`aspect-video w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500 dark:text-gray-400">No video selected</p>
      </div>
    )
  }

  // Format the embed URL - add autoplay and related parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`

  return (
    <div className={`aspect-video w-full rounded-xl overflow-hidden relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading video...</div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-red-500">Error loading video. Please try again.</div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      ></iframe>
    </div>
  )
}
