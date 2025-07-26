"use client"

import type { YouTubeSearchResult } from "@/types/youtube"
import { formatRelativeTime, formatViewCount } from "@/utils/youtube"
import { getVideoTypeLabel } from "@/utils/video-classification"

interface YouTubeSearchResultsProps {
  results: YouTubeSearchResult[]
  onVideoSelect: (videoId: string) => void
  className?: string
  isLoading?: boolean
}

export function YouTubeSearchResults({
  results,
  onVideoSelect,
  className = "",
  isLoading = false,
}: YouTubeSearchResultsProps) {
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-3 rounded-lg">
            <div className="w-40 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {results.map((result) => (
        <div
          key={result.id}
          className="flex gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-3 rounded-lg transition-colors"
          onClick={() => onVideoSelect(result.id)}
        >
          <div className="relative flex-shrink-0">
            <img
              src={result.thumbnailUrl || "/placeholder.svg?height=180&width=320"}
              alt={result.title}
              width={160}
              height={90}
              className="w-40 h-24 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
              {result.duration}
            </div>
            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
              {getVideoTypeLabel(result.duration)}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 dark:text-white">{result.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.channelTitle}</p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
              <span>{formatViewCount(result.viewCount)}</span>
              <span className="mx-1">•</span>
              <span>{formatRelativeTime(result.publishedAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
