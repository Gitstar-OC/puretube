export interface UserActivity {
  searchCount: number
  videosWatched: number
  totalWatchTime: number // in minutes
  lastUpdated: string
  recentSearches: string[]
  sessionStartTime: number
}

export interface VideoPreferences {
  showShortForm: boolean
  showLongForm: boolean
  autoPlay: boolean
  safeSearch: boolean
}

export interface SessionData {
  startTime: number
  searchesThisSession: number
  videosWatchedThisSession: number
  watchTimeThisSession: number
}
