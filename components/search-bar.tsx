"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, X, Youtube, ArrowRight, List } from "lucide-react"
import { extractYoutubeVideoId } from "@/utils/youtube"
import { isYoutubePlaylistUrl, extractYoutubePlaylistId } from "@/utils/playlist"

interface SearchBarProps {
  initialQuery: string
  onSearch: (query: string) => void
  onYoutubeLink: (videoId: string) => void
  onPlaylistLink: (playlistId: string) => void
  onClear: () => void
  isSearching: boolean
  inputRef?: React.RefObject<HTMLInputElement>
}

export function SearchBar({
  initialQuery,
  onSearch,
  onYoutubeLink,
  onPlaylistLink,
  onClear,
  isSearching,
  inputRef,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)
  const defaultInputRef = useRef<HTMLInputElement>(null)
  const [isYoutubeLink, setIsYoutubeLink] = useState(false)
  const [isPlaylistLink, setIsPlaylistLink] = useState(false)

  // Use the provided ref or fall back to the default one
  const actualInputRef = inputRef || defaultInputRef

  // Update local state when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery)
    setIsYoutubeLink(isYoutubeUrl(initialQuery))
    setIsPlaylistLink(isYoutubePlaylistUrl(initialQuery))
  }, [initialQuery])

  // Function to check if a string is a YouTube URL
  const isYoutubeUrl = (url: string): boolean => {
    if (!url || typeof url !== "string") return false
    return extractYoutubeVideoId(url) !== null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    setIsYoutubeLink(isYoutubeUrl(newQuery))
    setIsPlaylistLink(isYoutubePlaylistUrl(newQuery))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      onClear()
      return
    }

    // Check for playlist first
    if (isPlaylistLink) {
      const playlistId = extractYoutubePlaylistId(query)
      if (playlistId) {
        onPlaylistLink(playlistId)
        return
      }
    }

    // Then check for video
    if (isYoutubeLink) {
      const videoId = extractYoutubeVideoId(query)
      if (videoId) {
        onYoutubeLink(videoId)
        return
      }
    }

    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    setIsYoutubeLink(false)
    setIsPlaylistLink(false)
    onClear()
    if (actualInputRef.current) {
      actualInputRef.current.focus()
    }
  }

  const getIcon = () => {
    if (isPlaylistLink) {
      return <List className="text-green-500 h-5 w-5" />
    }
    if (isYoutubeLink) {
      return <Youtube className="text-red-500 h-5 w-5" />
    }
    return <Search className="text-gray-400 h-5 w-5" />
  }

  const getStatusMessage = () => {
    if (isPlaylistLink) {
      return "YouTube playlist detected! Press Enter or Search to load videos."
    }
    if (isYoutubeLink) {
      return "YouTube video detected! Press Enter or Search to play."
    }
    return null
  }

  return (
    <div className={`relative w-full transition-all duration-200 ${isFocused ? "scale-[1.01]" : ""}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
          relative flex items-center w-full h-14 px-4 
          bg-white dark:bg-[#111111] 
          border-2 ${isFocused ? "border-[#007fff]" : "border-transparent"} 
          shadow-lg rounded-xl 
          transition-all duration-200
        `}
        >
          <div className="flex items-center justify-center w-10 h-10">{getIcon()}</div>

          <input
            ref={actualInputRef}
            type="text"
            placeholder="Search YouTube, paste a video URL, or paste a playlist URL..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="
              flex-1 h-full px-2 
              bg-transparent 
              text-gray-800 dark:text-white 
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none
            "
          />

          <div className="flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="
                  flex items-center justify-center 
                  w-8 h-8 
                  bg-gray-100 dark:bg-gray-800 
                  text-gray-500 dark:text-gray-400 
                  rounded-full 
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  transition-colors
                "
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              className="
                flex items-center justify-center 
                h-10 px-4 
                bg-[#007fff] 
                text-white 
                rounded-lg 
                hover:bg-[#0066cc] 
                transition-colors
              "
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Loading</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-1">{isPlaylistLink ? "Load" : isYoutubeLink ? "Play" : "Search"}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </button>
          </div>
        </div>
      </form>

      {getStatusMessage() && (
        <div className="absolute -bottom-6 left-0 text-xs text-green-600 dark:text-green-400 font-medium pl-14">
          {getStatusMessage()}
        </div>
      )}
    </div>
  )
}
