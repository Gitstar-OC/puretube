"use server"

import type { YouTubePlaylistInfo } from "@/types/playlist"
import type { YouTubeSearchResult } from "@/types/youtube"

/**
 * Get the API key to use (from environment or custom)
 */
function getApiKey(): string {
  // Use API key from environment variables
  return process.env.API_KEY || ""
}

/**
 * Server action to get YouTube playlist information
 */
export async function getPlaylistInfo(playlistId: string, customApiKey?: string): Promise<YouTubePlaylistInfo | null> {
  const API_KEY = customApiKey || getApiKey()

  try {
    console.log("Getting playlist info for:", playlistId)

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("YouTube API playlist error:", JSON.stringify(errorData))
      throw new Error(`YouTube API error: ${response.status}, ${errorData?.error?.message || "Unknown error"}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return getMockPlaylistInfo(playlistId)
    }

    const playlist = data.items[0]

    return {
      id: playlist.id,
      title: playlist.snippet.title,
      description: playlist.snippet.description || "",
      channelTitle: playlist.snippet.channelTitle,
      channelId: playlist.snippet.channelId,
      thumbnailUrl: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url || "",
      videoCount: playlist.contentDetails.itemCount || 0,
      publishedAt: playlist.snippet.publishedAt,
    }
  } catch (error) {
    console.error("Error getting playlist info:", error)
    return getMockPlaylistInfo(playlistId)
  }
}

/**
 * Server action to get YouTube playlist videos as search results
 */
export async function getPlaylistVideos(
  playlistId: string,
  maxResults = 50,
  customApiKey?: string,
): Promise<YouTubeSearchResult[]> {
  const API_KEY = customApiKey || getApiKey()

  try {
    console.log("Getting playlist videos for:", playlistId)

    // Get playlist items
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${API_KEY}`,
    )

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}))
      console.error("YouTube API playlist items error:", JSON.stringify(errorData))
      throw new Error(`YouTube API error: ${playlistResponse.status}, ${errorData?.error?.message || "Unknown error"}`)
    }

    const playlistData = await playlistResponse.json()

    if (!playlistData.items || !Array.isArray(playlistData.items) || playlistData.items.length === 0) {
      console.log("No playlist items found")
      return getMockPlaylistVideos(playlistId)
    }

    // Get video IDs for additional details
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .filter(Boolean)
      .join(",")

    if (!videoIds) {
      console.log("No valid video IDs found in playlist")
      return []
    }

    // Get video details (duration, view count, etc.)
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
    )

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json().catch(() => ({}))
      console.error("YouTube API video details error:", errorData)
      throw new Error(`YouTube API error: ${videoDetailsResponse.status}`)
    }

    const videoDetailsData = await videoDetailsResponse.json()

    // Map the results to our interface
    return playlistData.items.map((item: any) => {
      // Find matching video details
      const videoDetails = videoDetailsData.items?.find((detail: any) => detail.id === item.snippet.resourceId.videoId)

      const duration = videoDetails?.contentDetails?.duration || "PT0S"
      const viewCount = Number.parseInt(videoDetails?.statistics?.viewCount || "0", 10)

      // Convert ISO 8601 duration to readable format
      const formattedDuration = formatDuration(duration)

      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        channelId: item.snippet.videoOwnerChannelId || item.snippet.channelId,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: viewCount,
        duration: formattedDuration,
      }
    })
  } catch (error) {
    console.error("Error getting playlist videos:", error)
    return getMockPlaylistVideos(playlistId)
  }
}

/**
 * Helper function to format ISO 8601 duration to readable format
 */
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  const hours = match?.[1] ? Number.parseInt(match[1].replace("H", "")) : 0
  const minutes = match?.[2] ? Number.parseInt(match[2].replace("M", "")) : 0
  const seconds = match?.[3] ? Number.parseInt(match[3].replace("S", "")) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/**
 * Fallback mock playlist info
 */
function getMockPlaylistInfo(playlistId: string): YouTubePlaylistInfo {
  return {
    id: playlistId,
    title: `Sample Playlist ${playlistId}`,
    description: "This is a sample playlist description.",
    channelTitle: "Sample Channel",
    channelId: "sample-channel-id",
    thumbnailUrl: "/placeholder.svg?height=180&width=320",
    videoCount: 10,
    publishedAt: new Date().toISOString(),
  }
}

/**
 * Fallback mock playlist videos
 */
function getMockPlaylistVideos(playlistId: string): YouTubeSearchResult[] {
  return [
    {
      id: "dQw4w9WgXcQ",
      title: "Sample Video 1 from Playlist",
      channelTitle: "Sample Channel",
      channelId: "sample-channel",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date().toISOString(),
      viewCount: 1000000,
      duration: "3:45",
    },
    {
      id: "kJQP7kiw5Fk",
      title: "Sample Video 2 from Playlist",
      channelTitle: "Sample Channel",
      channelId: "sample-channel",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      viewCount: 500000,
      duration: "5:20",
    },
    {
      id: "9bZkp7q19f0",
      title: "Sample Video 3 from Playlist",
      channelTitle: "Sample Channel",
      channelId: "sample-channel",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      viewCount: 750000,
      duration: "8:15",
    },
  ]
}
