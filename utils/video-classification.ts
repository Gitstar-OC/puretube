import type { YouTubeSearchResult } from "@/types/youtube"

/**
 * Classifies a video as short-form or long-form based on duration
 */
export function isShortFormVideo(duration: string): boolean {
  // Parse duration string (e.g., "3:45" or "15:08")
  const parts = duration.split(":")

  if (parts.length === 2) {
    // Format: MM:SS
    const minutes = Number.parseInt(parts[0], 10)
    return minutes < 1 // Less than 1 minute is considered short-form
  } else if (parts.length === 3) {
    // Format: HH:MM:SS
    const hours = Number.parseInt(parts[0], 10)
    return hours === 0 // Any video with hours is definitely long-form
  }

  return false // Default to long-form if we can't parse
}

/**
 * Filters search results based on user preferences
 */
export function filterVideosByPreferences(
  results: YouTubeSearchResult[],
  showShortForm: boolean,
  showLongForm: boolean,
): YouTubeSearchResult[] {
  if (showShortForm && showLongForm) {
    return results // Show all videos
  }

  return results.filter((video) => {
    const isShort = isShortFormVideo(video.duration)

    if (isShort && showShortForm) return true
    if (!isShort && showLongForm) return true

    return false
  })
}

/**
 * Gets video type label for display
 */
export function getVideoTypeLabel(duration: string): "Short" | "Long" {
  return isShortFormVideo(duration) ? "Short" : "Long"
}
