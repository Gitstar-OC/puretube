import type { UserActivity, VideoPreferences, SessionData } from "@/types/tracking"

const STORAGE_KEYS = {
  USER_ACTIVITY: "user_activity",
  VIDEO_PREFERENCES: "video_preferences",
  SESSION_DATA: "session_data",
  DAILY_ACTIVITY: "daily_activity",
}

// Daily activity tracking
export interface DailyActivity {
  date: string // YYYY-MM-DD format
  videosWatched: number
  searchCount: number
  watchTime: number // in minutes
}

// User Activity Tracking
export function getUserActivity(): UserActivity {
  if (typeof window === "undefined") {
    return getDefaultActivity()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_ACTIVITY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading user activity:", error)
  }

  return getDefaultActivity()
}

export function saveUserActivity(activity: UserActivity): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.USER_ACTIVITY, JSON.stringify(activity))
  } catch (error) {
    console.error("Error saving user activity:", error)
  }
}

// Daily Activity Tracking
export function getDailyActivity(): DailyActivity[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_ACTIVITY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading daily activity:", error)
  }

  return []
}

export function saveDailyActivity(dailyActivity: DailyActivity[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_ACTIVITY, JSON.stringify(dailyActivity))
  } catch (error) {
    console.error("Error saving daily activity:", error)
  }
}

export function updateDailyActivity(videosWatched = 0, searchCount = 0, watchTime = 0): void {
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
  const dailyActivity = getDailyActivity()

  // Find today's entry or create a new one
  let todayEntry = dailyActivity.find((entry) => entry.date === today)

  if (todayEntry) {
    todayEntry.videosWatched += videosWatched
    todayEntry.searchCount += searchCount
    todayEntry.watchTime += watchTime
  } else {
    todayEntry = {
      date: today,
      videosWatched,
      searchCount,
      watchTime,
    }
    dailyActivity.push(todayEntry)
  }

  // Keep only last 30 days of data
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0]

  const filteredActivity = dailyActivity.filter((entry) => entry.date >= cutoffDate)

  saveDailyActivity(filteredActivity)
}

export function getWeeklyVideoData(): number[] {
  const dailyActivity = getDailyActivity()
  const weekData: number[] = []

  // Get the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]

    const dayActivity = dailyActivity.find((entry) => entry.date === dateString)
    weekData.push(dayActivity ? dayActivity.videosWatched : 0)
  }

  return weekData
}

export function trackSearch(query: string): void {
  const activity = getUserActivity()

  // Update search count
  activity.searchCount += 1

  // Add to recent searches (keep only last 10)
  activity.recentSearches = [query, ...activity.recentSearches.filter((s) => s !== query)].slice(0, 10)

  activity.lastUpdated = new Date().toISOString()

  saveUserActivity(activity)

  // Update session data
  updateSessionData({ searchesThisSession: 1 })

  // Update daily activity
  updateDailyActivity(0, 1, 0)
}

export function trackVideoWatch(videoId: string, watchTime: number): void {
  const activity = getUserActivity()

  activity.videosWatched += 1
  activity.totalWatchTime += watchTime
  activity.lastUpdated = new Date().toISOString()

  saveUserActivity(activity)

  // Update session data
  updateSessionData({
    videosWatchedThisSession: 1,
    watchTimeThisSession: watchTime,
  })

  // Update daily activity
  updateDailyActivity(1, 0, watchTime)
}

// Video Preferences
export function getVideoPreferences(): VideoPreferences {
  if (typeof window === "undefined") {
    return getDefaultPreferences()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VIDEO_PREFERENCES)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading video preferences:", error)
  }

  return getDefaultPreferences()
}

export function saveVideoPreferences(preferences: VideoPreferences): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.VIDEO_PREFERENCES, JSON.stringify(preferences))
  } catch (error) {
    console.error("Error saving video preferences:", error)
  }
}

// Session Management
export function getSessionData(): SessionData {
  if (typeof window === "undefined") {
    return getDefaultSession()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION_DATA)
    if (stored) {
      const session = JSON.parse(stored)
      // Check if it's a new day, reset session if so
      const today = new Date().toDateString()
      const sessionDate = new Date(session.startTime).toDateString()

      if (today !== sessionDate) {
        return getDefaultSession()
      }

      return session
    }
  } catch (error) {
    console.error("Error loading session data:", error)
  }

  return getDefaultSession()
}

export function updateSessionData(updates: Partial<SessionData>): void {
  if (typeof window === "undefined") return

  const session = getSessionData()
  const updatedSession = {
    ...session,
    searchesThisSession: session.searchesThisSession + (updates.searchesThisSession || 0),
    videosWatchedThisSession: session.videosWatchedThisSession + (updates.videosWatchedThisSession || 0),
    watchTimeThisSession: session.watchTimeThisSession + (updates.watchTimeThisSession || 0),
  }

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(updatedSession))
  } catch (error) {
    console.error("Error saving session data:", error)
  }
}

// Default values
function getDefaultActivity(): UserActivity {
  return {
    searchCount: 0,
    videosWatched: 0,
    totalWatchTime: 0,
    lastUpdated: new Date().toISOString(),
    recentSearches: [],
    sessionStartTime: Date.now(),
  }
}

function getDefaultPreferences(): VideoPreferences {
  return {
    showShortForm: true,
    showLongForm: true,
    autoPlay: false,
    safeSearch: true,
  }
}

function getDefaultSession(): SessionData {
  const session = {
    startTime: Date.now(),
    searchesThisSession: 0,
    videosWatchedThisSession: 0,
    watchTimeThisSession: 0,
  }

  // Save the new session
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(session))
    } catch (error) {
      console.error("Error saving new session:", error)
    }
  }

  return session
}

// Utility functions
export function formatWatchTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}m`
}

export function getWeeklyStats(): { searchCount: number; videosWatched: number; watchTime: number } {
  const dailyActivity = getDailyActivity()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const cutoffDate = sevenDaysAgo.toISOString().split("T")[0]

  const weeklyData = dailyActivity.filter((entry) => entry.date >= cutoffDate)

  return {
    searchCount: weeklyData.reduce((sum, entry) => sum + entry.searchCount, 0),
    videosWatched: weeklyData.reduce((sum, entry) => sum + entry.videosWatched, 0),
    watchTime: weeklyData.reduce((sum, entry) => sum + entry.watchTime, 0),
  }
}

export function getMonthlyStats(): { searchCount: number; videosWatched: number; watchTime: number } {
  const dailyActivity = getDailyActivity()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0]

  const monthlyData = dailyActivity.filter((entry) => entry.date >= cutoffDate)

  return {
    searchCount: monthlyData.reduce((sum, entry) => sum + entry.searchCount, 0),
    videosWatched: monthlyData.reduce((sum, entry) => sum + entry.videosWatched, 0),
    watchTime: monthlyData.reduce((sum, entry) => sum + entry.watchTime, 0),
  }
}
