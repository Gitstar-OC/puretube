"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SidebarInset } from "@/components/ui/sidebar"
import { YouTubeVideoPlayer } from "@/components/youtube-video-player"
import { YouTubeSearchResults } from "@/components/youtube-search-results"
import { SearchBar } from "@/components/search-bar"
import { Search, X } from "lucide-react"
import type { YouTubeSearchResult } from "@/types/youtube"
import { extractYoutubeVideoId } from "@/utils/youtube"
import { searchYouTube } from "@/app/actions/youtube-actions"
import { trackSearch, trackVideoWatch } from "@/utils/tracking"
import { getVideoPreferences } from "@/utils/tracking"
import { filterVideosByPreferences } from "@/utils/video-classification"
import { getPlaylistInfo, getPlaylistVideos } from "@/app/actions/playlist-actions"
import type { YouTubePlaylistInfo } from "@/types/playlist"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get video ID and search query from URL
  const videoIdFromUrl = searchParams.get("v")
  const queryFromUrl = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(queryFromUrl)
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(videoIdFromUrl)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [keepVideoOnSearch, setKeepVideoOnSearch] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [videoPreferences, setVideoPreferences] = useState(getVideoPreferences())
  const [playlistInfo, setPlaylistInfo] = useState<YouTubePlaylistInfo | null>(null)
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false)

  // Get custom API key if available
  const getCustomApiKey = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("custom_youtube_api_key") || undefined
    }
    return undefined
  }

  // Load settings from localStorage
  useEffect(() => {
    const savedKeepVideoOnSearch = localStorage.getItem("keepVideoOnSearch")
    if (savedKeepVideoOnSearch !== null) {
      setKeepVideoOnSearch(savedKeepVideoOnSearch === "true")
    }
  }, [])

  // Add keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key pressed is "/" and not in an input or textarea
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Handle URL changes
  useEffect(() => {
    const videoId = searchParams.get("v")
    const query = searchParams.get("q") || ""
    const playlistId = searchParams.get("list")

    setSelectedVideoId(videoId)
    setSearchQuery(query)

    // If there's a query but no results yet, perform search
    if (query && searchResults.length === 0 && !isSearching && !extractYoutubeVideoId(query)) {
      performSearch(query)
    }

    if (playlistId && searchResults.length === 0 && !isLoadingPlaylist) {
      handlePlaylistLink(playlistId)
    }
  }, [searchParams])

  // Perform search function
  const performSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    setError(null)

    // Track the search
    trackSearch(query)

    // If keepVideoOnSearch is false, clear the video
    if (!keepVideoOnSearch && selectedVideoId) {
      setSelectedVideoId(null)
    }

    try {
      console.log("Performing search for:", query)
      const customApiKey = getCustomApiKey()
      const results = await searchYouTube(query, customApiKey)

      // Check if we got results
      if (results && results.length > 0) {
        // Filter results based on user preferences
        const filteredResults = filterVideosByPreferences(
          results,
          videoPreferences.showShortForm,
          videoPreferences.showLongForm,
        )

        setSearchResults(filteredResults)
        setError(null)

        if (filteredResults.length === 0) {
          setError(
            `No ${!videoPreferences.showShortForm ? "long-form" : !videoPreferences.showLongForm ? "short-form" : ""} videos found for "${query}". Try adjusting your video preferences in Settings.`,
          )
        }
      } else {
        console.log("No results found for query:", query)
        setSearchResults([])
        setError(`No results found for "${query}". Try a different search term.`)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
      setError("There was an issue with the YouTube search. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    performSearch(query)

    // Update URL
    const params = new URLSearchParams()
    params.set("q", query)

    // Only include video ID if keepVideoOnSearch is true and we have a selected video
    if (keepVideoOnSearch && selectedVideoId) {
      params.set("v", selectedVideoId)
    }

    const newUrl = `/home?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }

  // Handle YouTube link
  const handleYoutubeLink = (videoId: string) => {
    setSelectedVideoId(videoId)

    // Update URL
    const params = new URLSearchParams()
    params.set("v", videoId)
    params.set("q", searchQuery)
    const newUrl = `/home?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }

  // Handle playlist link
  const handlePlaylistLink = async (playlistId: string) => {
    setIsLoadingPlaylist(true)
    setError(null)

    try {
      console.log("Loading playlist:", playlistId)
      const customApiKey = getCustomApiKey()

      // Get playlist info
      const info = await getPlaylistInfo(playlistId, customApiKey)
      setPlaylistInfo(info)

      // Get playlist videos
      const videos = await getPlaylistVideos(playlistId, 50, customApiKey)

      if (videos && videos.length > 0) {
        // Filter results based on user preferences
        const filteredResults = filterVideosByPreferences(
          videos,
          videoPreferences.showShortForm,
          videoPreferences.showLongForm,
        )

        setSearchResults(filteredResults)
        setError(null)

        if (filteredResults.length === 0) {
          setError(
            `No ${!videoPreferences.showShortForm ? "long-form" : !videoPreferences.showLongForm ? "short-form" : ""} videos found in this playlist. Try adjusting your video preferences in Settings.`,
          )
        }
      } else {
        setSearchResults([])
        setError("No videos found in this playlist.")
      }

      // Update URL
      const params = new URLSearchParams()
      params.set("list", playlistId)
      const newUrl = `/home?${params.toString()}`
      router.replace(newUrl, { scroll: false })
    } catch (error) {
      console.error("Playlist error:", error)
      setSearchResults([])
      setError("There was an issue loading the playlist. Please try again later.")
    } finally {
      setIsLoadingPlaylist(false)
    }
  }

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedVideoId(null)
    setPlaylistInfo(null)

    // Clear URL parameters
    router.replace("/home", { scroll: false })
  }

  // Handle video selection
  const handleVideoSelect = (videoId: string) => {
    if (videoId && typeof videoId === "string") {
      setSelectedVideoId(videoId)

      // Track video watch (assuming 1 minute of watch time for now)
      // In a real app, you'd track actual watch time
      trackVideoWatch(videoId, 1)

      // Update URL when a video is selected
      const params = new URLSearchParams(searchParams.toString())
      params.set("v", videoId)
      const newUrl = `/home?${params.toString()}`
      router.replace(newUrl, { scroll: false })
    }
  }

  // Clear the video player
  const handleClearVideo = () => {
    setSelectedVideoId(null)

    // Update URL to remove video parameter
    const params = new URLSearchParams(searchParams.toString())
    params.delete("v")
    const newUrl = params.toString() ? `/home?${params.toString()}` : "/home"
    router.replace(newUrl, { scroll: false })
  }

  // Load video preferences
  useEffect(() => {
    setVideoPreferences(getVideoPreferences())
  }, [])

  return (
    <SidebarInset className="bg-[#f3f9ff] dark:bg-black">
      <div className="flex w-full flex-col">
        <div className="p-6 md:p-8">
          <div className="w-full max-w-3xl mx-auto mt-4">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">YouTube Search</h1>

            <SearchBar
              initialQuery={searchQuery}
              onSearch={handleSearch}
              onYoutubeLink={handleYoutubeLink}
              onPlaylistLink={handlePlaylistLink}
              onClear={handleClearSearch}
              isSearching={isSearching || isLoadingPlaylist}
              inputRef={searchInputRef}
            />

            <div className="mt-12">
              {selectedVideoId && (
                <div className="mb-8 relative">
                  <button
                    onClick={handleClearVideo}
                    className="absolute -top-8 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 text-sm"
                  >
                    <X className="h-4 w-4" />
                    Close video
                  </button>
                  <YouTubeVideoPlayer videoId={selectedVideoId} />
                </div>
              )}

              {playlistInfo && (
                <div className="mb-6 p-4 bg-white dark:bg-[#111111] rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={playlistInfo.thumbnailUrl || "/placeholder.svg?height=120&width=160"}
                      alt={playlistInfo.title}
                      width={160}
                      height={120}
                      className="w-40 h-30 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold dark:text-white mb-2">{playlistInfo.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{playlistInfo.channelTitle}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{playlistInfo.videoCount} videos</p>
                      {playlistInfo.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {playlistInfo.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setPlaylistInfo(null)
                        setSearchResults([])
                        router.replace("/home", { scroll: false })
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {error && !isSearching && (
                <div className="text-center my-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
                </div>
              )}

              {(isSearching || isLoadingPlaylist) && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium mb-4 dark:text-white">
                    {isLoadingPlaylist ? "Loading Playlist..." : "Search Results"}
                  </h2>
                  <YouTubeSearchResults results={[]} onVideoSelect={handleVideoSelect} isLoading={true} />
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium dark:text-white">
                      {playlistInfo ? "Playlist Videos" : "Search Results"}
                    </h2>
                  </div>
                  <YouTubeSearchResults results={searchResults} onVideoSelect={handleVideoSelect} />
                </div>
              )}

              {!isSearching &&
                searchQuery &&
                searchResults.length === 0 &&
                !selectedVideoId &&
                !error &&
                !extractYoutubeVideoId(searchQuery) && (
                  <div className="text-center my-8 text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                )}

              {!searchQuery && !selectedVideoId && !playlistInfo && (
                <div className="text-center my-12 text-gray-500 dark:text-gray-400">
                  <div className="mb-4">
                    <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-lg">Search for YouTube videos or paste a YouTube URL</p>
                  <p className="text-sm mt-2">
                    Press{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 font-mono">
                      /
                    </kbd>{" "}
                    to focus the search box
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
