"use client"

import { useState, useEffect } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { Key, Settings, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { ApiKeyModal } from "@/components/api-key-modal"

export default function KeyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUsingCustomKey, setIsUsingCustomKey] = useState(false)
  const [customKeyPreview, setCustomKeyPreview] = useState("")

  useEffect(() => {
    const customKey = localStorage.getItem("custom_youtube_api_key")
    if (customKey) {
      setIsUsingCustomKey(true)
      // Show only first 8 and last 4 characters for security
      const preview = `${customKey.slice(0, 8)}...${customKey.slice(-4)}`
      setCustomKeyPreview(preview)
    } else {
      setIsUsingCustomKey(false)
      setCustomKeyPreview("")
    }
  }, [isModalOpen]) // Refresh when modal closes

  const handleRemoveCustomKey = () => {
    if (confirm("Are you sure you want to remove your custom API key and use the default one?")) {
      localStorage.removeItem("custom_youtube_api_key")
      setIsUsingCustomKey(false)
      setCustomKeyPreview("")
    }
  }

  return (
    <SidebarInset className="bg-[#f3f9ff] dark:bg-black">
      <div className="flex w-full flex-col">
        <div className="p-6 md:p-8">
          <div className="w-full max-w-3xl mx-auto mt-4">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-6 w-6 text-[#007fff]" />
              <h1 className="text-2xl font-bold dark:text-white">API Key Management</h1>
            </div>

            {/* Current Status Card */}
            <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Current API Key Status</h2>

              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 ${isUsingCustomKey ? "bg-green-500" : "bg-blue-500"}`}></div>
                <div className="flex-1">
                  <h3 className="font-medium dark:text-white mb-2">
                    {isUsingCustomKey ? "Using Your Custom API Key" : "Using Default API Key"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {isUsingCustomKey
                      ? `Your personal YouTube Data API key is active: ${customKeyPreview}`
                      : "You're currently using the default API key provided by the application."}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#007fff] text-white rounded-lg hover:bg-[#0066cc] transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      {isUsingCustomKey ? "Update API Key" : "Set Custom API Key"}
                    </button>

                    {isUsingCustomKey && (
                      <button
                        onClick={handleRemoveCustomKey}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Use Default Key
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Why Use Your Own API Key?</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-medium text-green-700 dark:text-green-400">Higher Limits</h3>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Get your own 10,000 daily quota instead of sharing the default key with other users.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-400">Better Performance</h3>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    Avoid rate limiting and ensure consistent access to YouTube data.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <h3 className="font-medium text-purple-700 dark:text-purple-400">Full Control</h3>
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-300">
                    Monitor your own usage and set restrictions as needed in Google Cloud Console.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <h3 className="font-medium text-orange-700 dark:text-orange-400">Privacy</h3>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-300">
                    Your searches and data requests go directly to Google, not through shared resources.
                  </p>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="bg-white dark:bg-[#111111] rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">How to Get Your API Key</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#007fff] text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white mb-1">Go to Google Cloud Console</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Visit the Google Cloud Console to create or select a project.
                    </p>
                    <a
                      href="https://console.developers.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#007fff] hover:text-[#0066cc]"
                    >
                      Open Google Cloud Console
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#007fff] text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white mb-1">Enable YouTube Data API v3</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      In the API Library, search for "YouTube Data API v3" and enable it for your project.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#007fff] text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white mb-1">Create API Key</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Go to Credentials, click "Create Credentials", and select "API key".
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#007fff] text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white mb-1">Configure & Copy</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Optionally restrict the key for security, then copy it and paste it in the modal above.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Security & Privacy</h3>
                  <ul className="text-sm text-yellow-600 dark:text-yellow-300 space-y-1">
                    <li>• Your API key is stored locally in your browser only</li>
                    <li>• We never send your API key to our servers</li>
                    <li>• Consider restricting your API key to specific domains in Google Cloud Console</li>
                    <li>• You can remove your custom key at any time to use the default one</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </SidebarInset>
  )
}
