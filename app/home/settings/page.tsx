"use client"

import { useState, useEffect } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { Settings, Clock, Bell, Shield, Video } from "lucide-react"
import { getUserActivity } from "@/utils/tracking"
import { getVideoPreferences, saveVideoPreferences } from "@/utils/tracking"
import type { VideoPreferences } from "@/types/tracking"

export default function SettingsPage() {
  const [autoPlay, setAutoPlay] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [safeSearch, setSafeSearch] = useState(true)
  const [sessionLimit, setSessionLimit] = useState(60)
  const [keepVideoOnSearch, setKeepVideoOnSearch] = useState(true)
  const [videoPreferences, setVideoPreferences] = useState<VideoPreferences>(getVideoPreferences())

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem("autoPlay")
    if (savedAutoPlay !== null) {
      setAutoPlay(savedAutoPlay === "true")
    }

    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true")
    }

    const savedSafeSearch = localStorage.getItem("safeSearch")
    if (savedSafeSearch !== null) {
      setSafeSearch(savedSafeSearch === "true")
    }

    const savedSessionLimit = localStorage.getItem("sessionLimit")
    if (savedSessionLimit) {
      setSessionLimit(Number.parseInt(savedSessionLimit))
    }

    const savedKeepVideoOnSearch = localStorage.getItem("keepVideoOnSearch")
    if (savedKeepVideoOnSearch !== null) {
      setKeepVideoOnSearch(savedKeepVideoOnSearch === "true")
    } else {
      // Default to true if not set
      localStorage.setItem("keepVideoOnSearch", "true")
    }
  }, [])

  useEffect(() => {
    setVideoPreferences(getVideoPreferences())
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("autoPlay", autoPlay.toString())
  }, [autoPlay])

  useEffect(() => {
    localStorage.setItem("notifications", notifications.toString())
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("safeSearch", safeSearch.toString())
  }, [safeSearch])

  useEffect(() => {
    localStorage.setItem("sessionLimit", sessionLimit.toString())
  }, [sessionLimit])

  useEffect(() => {
    localStorage.setItem("keepVideoOnSearch", keepVideoOnSearch.toString())
  }, [keepVideoOnSearch])

  useEffect(() => {
    saveVideoPreferences(videoPreferences)
  }, [videoPreferences])

  const handleExportData = () => {
    try {
      // Gather all user data
      const activityData = getUserActivity()
      const settingsData = {
        autoPlay,
        notifications,
        safeSearch,
        sessionLimit,
        keepVideoOnSearch,
        videoPreferences,
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        userActivity: activityData,
        settings: settingsData,
        version: "1.0",
      }

      // Create and download the file
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `quityoutube-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data. Please try again.")
    }
  }

  return (
    <SidebarInset className="bg-[#f3f9ff] dark:bg-black">
      <div className="flex w-full flex-col">
        <div className="p-6 md:p-8">
          <div className="w-full max-w-3xl mx-auto mt-4">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-6 w-6 text-[#007fff]" />
              <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
            </div>

            <div className="space-y-6">
              {/* Playback */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Playback</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Autoplay videos</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={() => setAutoPlay(!autoPlay)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Keep video playing during search
                      </span>
                      <div className="relative group">
                        <div className="cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                          When enabled, videos will continue playing when you perform a new search. When disabled,
                          videos will close automatically when you search.
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepVideoOnSearch}
                        onChange={() => setKeepVideoOnSearch(!keepVideoOnSearch)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Video Content */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Video Content</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show short-form videos
                      </span>
                      <div className="relative group">
                        <div className="cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                          Videos under 1 minute in duration (like YouTube Shorts)
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoPreferences.showShortForm}
                        onChange={() =>
                          setVideoPreferences((prev) => ({ ...prev, showShortForm: !prev.showShortForm }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show long-form videos
                      </span>
                      <div className="relative group">
                        <div className="cursor-help text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                          Videos 1 minute or longer in duration
                        </div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoPreferences.showLongForm}
                        onChange={() => setVideoPreferences((prev) => ({ ...prev, showLongForm: !prev.showLongForm }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {!videoPreferences.showShortForm && !videoPreferences.showLongForm && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        ⚠️ You have disabled both short-form and long-form videos. You won't see any search results.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Digital Wellbeing */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Digital Wellbeing</h2>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Session time limit (minutes)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={sessionLimit}
                      onChange={(e) => setSessionLimit(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>15m</span>
                      <span>{sessionLimit}m</span>
                      <span>180m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Break time notifications
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={() => setNotifications(!notifications)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#007fff]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Safe search</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeSearch}
                        onChange={() => setSafeSearch(!safeSearch)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Data Export</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Export Your Data</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-4">
                      Download all your activity data, preferences, and settings as a JSON file. This includes your
                      search history, watch statistics, and all configuration settings.
                    </p>
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Export Data
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What's included in the export:
                    </h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Search history and statistics</li>
                      <li>• Video watch count and total watch time</li>
                      <li>• All preference settings</li>
                      <li>• Session data and activity metrics</li>
                      <li>• Export timestamp and version info</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-[#007fff] text-white rounded-lg hover:bg-[#0066cc] transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
