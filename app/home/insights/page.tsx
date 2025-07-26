"use client"

import type React from "react"

import { SidebarInset } from "@/components/ui/sidebar"
import { Clock, Link, Search, Video } from "lucide-react"
import { useState, useEffect } from "react"
import { getUserActivity, getSessionData, formatWatchTime, getWeeklyStats, getWeeklyVideoData } from "@/utils/tracking"

export default function InsightsPage() {
  const [userActivity, setUserActivity] = useState(getUserActivity())
  const [sessionData, setSessionData] = useState(getSessionData())
  const [weeklyVideoData, setWeeklyVideoData] = useState<number[]>([])

  useEffect(() => {
    const refreshData = () => {
      setUserActivity(getUserActivity())
      setSessionData(getSessionData())
      setWeeklyVideoData(getWeeklyVideoData())
    }

    refreshData()

    // Refresh data every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <SidebarInset className="bg-[#f3f9ff] dark:bg-black">
      <div className="flex w-full flex-col">
        <div className="p-6 md:p-8">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Insights</h1>

            {/* Bento grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Usage summary - large card */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm md:col-span-2 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Usage Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    icon={<Clock className="h-5 w-5 text-[#007fff]" />}
                    title="Hours Watched"
                    value={formatWatchTime(getWeeklyStats().watchTime)}
                    change="+2.4%"
                    isPositive={false}
                  />
                  <MetricCard
                    icon={<Video className="h-5 w-5 text-[#007fff]" />}
                    title="Videos Watched"
                    value={getWeeklyStats().videosWatched.toString()}
                    change="-5.2%"
                    isPositive={true}
                  />
                  <MetricCard
                    icon={<Search className="h-5 w-5 text-[#007fff]" />}
                    title="Searches"
                    value={getWeeklyStats().searchCount.toString()}
                    change="+12.1%"
                    isPositive={true}
                  />
                  <MetricCard
                    icon={<Link className="h-5 w-5 text-[#007fff]" />}
                    title="Session Time"
                    value={formatWatchTime(sessionData.watchTimeThisSession)}
                    change="-8.3%"
                    isPositive={true}
                  />
                </div>
              </div>

              {/* Videos per day */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold dark:text-white">Videos per Day (This Week)</h2>
                  <Video className="h-5 w-5 text-[#007fff]" />
                </div>
                <div className="h-[180px] flex items-end space-x-2">
                  {weeklyVideoData.map((value, index) => {
                    // Calculate height based on the maximum value in the data
                    const maxValue = Math.max(...weeklyVideoData, 1) // Ensure at least 1 to avoid division by zero
                    const heightPercentage = (value / maxValue) * 100
                    const minHeight = value > 0 ? 10 : 5 // Minimum height for visibility
                    const height = Math.max(heightPercentage, minHeight)

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="relative">
                          <div
                            className="w-full bg-[#e1f0ff] dark:bg-[#1e3a8a] rounded-t-sm"
                            style={{ height: `${height}px` }}
                          ></div>
                          {value > 0 && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                              {value}
                            </div>
                          )}
                        </div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                          {["M", "T", "W", "T", "F", "S", "S"][index]}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {weeklyVideoData.every((value) => value === 0) && (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                    No videos watched this week
                  </div>
                )}
              </div>

              {/* Recent searches */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold dark:text-white">Recent Searches</h2>
                  <Search className="h-5 w-5 text-[#007fff]" />
                </div>
                <div className="space-y-3">
                  {userActivity.recentSearches.slice(0, 3).map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#f8fafc] dark:bg-[#1a1a1a] rounded-lg"
                    >
                      <span className="text-sm font-medium dark:text-white">{search}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {index === 0 ? "Latest" : `${index + 1} searches ago`}
                      </span>
                    </div>
                  ))}
                  {userActivity.recentSearches.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No searches yet</p>
                      <p className="text-xs">Your recent searches will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed recent searches */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Search History</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userActivity.recentSearches.slice(0, 6).map((search, index) => (
                    <SearchItem
                      key={index}
                      query={search}
                      time={index === 0 ? "Just now" : `${index} searches ago`}
                      category="Search"
                    />
                  ))}
                  {userActivity.recentSearches.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No search history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

// Helper components
function MetricCard({
  icon,
  title,
  value,
  change,
  isPositive,
}: {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  isPositive: boolean
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold dark:text-white">{value}</span>
        <span className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</span>
      </div>
    </div>
  )
}

function SearchItem({
  query,
  time,
  category,
}: {
  query: string
  time: string
  category: string
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#1a1a1a] rounded-lg p-4">
      <p className="font-medium mb-1 dark:text-white">{query}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">{time}</span>
        <span className="bg-[#e1f0ff] dark:bg-[#1e3a8a] text-[#007fff] dark:text-[#60a5fa] px-2 py-0.5 rounded-full">
          {category}
        </span>
      </div>
    </div>
  )
}
