"use client"

import { useState, useEffect } from "react"
import { X, Key, Eye, EyeOff, Save, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false)

  // Load existing API key on mount
  useEffect(() => {
    if (isOpen) {
      const customKey = localStorage.getItem("custom_youtube_api_key")
      if (customKey) {
        setApiKey(customKey)
        setIsUsingCustomKey(true)
      } else {
        setApiKey("")
        setIsUsingCustomKey(false)
      }
      setSaveSuccess(false)
      setSaveError(null)
    }
  }, [isOpen])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setSaveError("Please enter a valid API key")
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      // Test the API key by making a simple request
      const testResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&type=video&key=${apiKey.trim()}`,
      )

      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || "Invalid API key")
      }

      // Save the key if test is successful
      localStorage.setItem("custom_youtube_api_key", apiKey.trim())
      setIsUsingCustomKey(true)
      setSaveSuccess(true)

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("API key validation error:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to validate API key")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveCustomKey = () => {
    localStorage.removeItem("custom_youtube_api_key")
    setApiKey("")
    setIsUsingCustomKey(false)
    setSaveSuccess(false)
    setSaveError(null)
  }

  const handleClose = () => {
    setShowKey(false)
    setSaveSuccess(false)
    setSaveError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#111111] rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-[#007fff]" />
            <h2 className="text-lg font-semibold dark:text-white">YouTube API Key</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Current Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isUsingCustomKey ? "bg-green-500" : "bg-blue-500"}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isUsingCustomKey ? "Using your custom API key" : "Using default API key"}
              </span>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your YouTube Data API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your YouTube Data API key"
                className="w-full h-12 px-4 pr-12 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007fff] transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">
                API key saved successfully! Closing in a moment...
              </span>
            </div>
          )}

          {/* Error Message */}
          {saveError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-400">{saveError}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">How to get your API key:</h3>
            <ol className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Go to the Google Cloud Console</li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the YouTube Data API v3</li>
              <li>Create credentials (API key)</li>
              <li>Copy and paste the key above</li>
            </ol>
            <a
              href="https://console.developers.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Open Google Cloud Console
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Security Note */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Security Note:</h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-300">
              Your API key is stored locally in your browser and never sent to our servers. For security, consider
              restricting your API key to specific domains in the Google Cloud Console.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !apiKey.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#007fff] text-white rounded-lg hover:bg-[#0066cc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save & Test Key
                </>
              )}
            </button>

            {isUsingCustomKey && (
              <button
                onClick={handleRemoveCustomKey}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Use Default
              </button>
            )}
          </div>

          {/* API Limits Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">API Usage Limits:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Default quota: 10,000 units per day</li>
              <li>• Search request: 100 units</li>
              <li>• Video details: 1 unit per video</li>
              <li>• Playlist items: 1 unit per item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
