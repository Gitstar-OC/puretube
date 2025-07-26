"use server"

import type { YouTubeSearchResult, YouTubeVideoDetails } from "@/types/youtube"

/**
 * Get the API key to use (from environment or custom)
 */
function getApiKey(): string {
  // Use API key from environment variables
  return process.env.API_KEY || ""
}

/**
 * Server action to search YouTube using the YouTube Data API
 */
export async function searchYouTube(query: string, customApiKey?: string): Promise<YouTubeSearchResult[]> {
  const API_KEY = customApiKey || getApiKey()

  try {
    console.log("Searching YouTube with query:", query)

    // First, search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
      query,
    )}&type=video&key=${API_KEY}`

    console.log("Making request to YouTube API...")

    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}))
      console.error("YouTube API search error:", JSON.stringify(errorData))
      throw new Error(`YouTube API error: ${searchResponse.status}, ${errorData?.error?.message || "Unknown error"}`)
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || !Array.isArray(searchData.items) || searchData.items.length === 0) {
      console.log("No search results found")
      return []
    }

    // Get video IDs for additional details
    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .filter(Boolean)
      .join(",")

    if (!videoIds) {
      console.log("No valid video IDs found")
      return []
    }

    // Get video details (duration, view count, etc.)
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`,
    )

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json().catch(() => ({}))
      console.error("YouTube API video details error:", JSON.stringify(errorData))
      throw new Error(`YouTube API error: ${videoDetailsResponse.status}`)
    }

    const videoDetailsData = await videoDetailsResponse.json()

    // Map the results to our interface
    const results = searchData.items.map((item: any) => {
      // Find matching video details
      const videoDetails = videoDetailsData.items?.find((detail: any) => detail.id === item.id.videoId)

      const duration = videoDetails?.contentDetails?.duration || "PT0S"
      const viewCount = Number.parseInt(videoDetails?.statistics?.viewCount || "0", 10)

      // Convert ISO 8601 duration to readable format
      const formattedDuration = formatDuration(duration)

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: viewCount,
        duration: formattedDuration,
      }
    })

    return results
  } catch (error) {
    console.error("Error searching YouTube:", error)
    return useMockData(query) // Fallback to mock data on error
  }
}

/**
 * Server action to get details for a specific YouTube video
 */
export async function getVideoDetails(videoId: string, customApiKey?: string): Promise<YouTubeVideoDetails | null> {
  const API_KEY = customApiKey || getApiKey()

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`,
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("YouTube API video details error:", JSON.stringify(errorData))
      throw new Error(`YouTube API error: ${response.status}, ${errorData?.error?.message || "Unknown error"}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return getMockVideoDetails(videoId)
    }

    const video = data.items[0]

    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      viewCount: Number.parseInt(video.statistics.viewCount || "0", 10),
      likeCount: Number.parseInt(video.statistics.likeCount || "0", 10),
      commentCount: Number.parseInt(video.statistics.commentCount || "0", 10),
    }
  } catch (error) {
    console.error("Error getting video details:", error)
    return getMockVideoDetails(videoId)
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
 * Fallback mock data for when API key is not available
 */
function useMockData(query: string): YouTubeSearchResult[] {
  const mockData = [
    {
      id: "dQw4w9WgXcQ", // Real YouTube video ID
      title: `${query} - Top Result`,
      channelTitle: "Popular Channel",
      channelId: "channel-1",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date().toISOString(),
      viewCount: 1234567,
      duration: "3:45",
    },
    {
      id: "kJQP7kiw5Fk", // Real YouTube video ID
      title: `How to ${query} - Tutorial`,
      channelTitle: "Tutorial Channel",
      channelId: "channel-2",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      viewCount: 987654,
      duration: "10:21",
    },
    {
      id: "9bZkp7q19f0", // Real YouTube video ID
      title: `${query} Explained`,
      channelTitle: "Educational Channel",
      channelId: "channel-3",
      thumbnailUrl: "/placeholder.svg?height=180&width=320",
      publishedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
      viewCount: 567890,
      duration: "15:08",
    },
  ]
  return mockData
}

/**
 * Fallback mock video details for when API key is not available
 */
function getMockVideoDetails(videoId: string): YouTubeVideoDetails {
  return {
    id: videoId,
    title: `Video ${videoId}`,
    channelTitle: "Channel Name",
    channelId: "channel-id",
    description: "This is a video description. In a real implementation, this would be fetched from the YouTube API.",
    publishedAt: new Date().toISOString(),
    viewCount: 1234567,
    likeCount: 12345,
    commentCount: 1234,
  }
}
