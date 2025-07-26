/**
 * Extracts YouTube playlist ID from a URL
 */
export function extractYoutubePlaylistId(url: string): string | null {
  // Match patterns like:
  // - https://www.youtube.com/playlist?list=PLAYLIST_ID
  // - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
  const patterns = [/[?&]list=([^&?/]+)/, /youtube\.com\/playlist\?list=([^&?/]+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Checks if a URL is a YouTube playlist URL
 */
export function isYoutubePlaylistUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  return extractYoutubePlaylistId(url) !== null
}

/**
 * Formats playlist title for display
 */
export function formatPlaylistTitle(title: string, videoCount: number): string {
  return `${title} (${videoCount} videos)`
}
