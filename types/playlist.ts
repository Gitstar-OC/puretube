export interface YouTubePlaylistInfo {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  thumbnailUrl: string
  videoCount: number
  publishedAt: string
}

export interface YouTubePlaylistItem {
  videoId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
  publishedAt: string
  position: number
}
