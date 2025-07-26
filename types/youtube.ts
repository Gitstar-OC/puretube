export interface YouTubeSearchResult {
  id: string
  title: string
  channelTitle: string
  channelId: string
  thumbnailUrl: string
  publishedAt: string
  viewCount: number
  duration: string
}

export interface YouTubeVideoDetails {
  id: string
  title: string
  channelTitle: string
  channelId: string
  description: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}
