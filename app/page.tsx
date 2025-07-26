"use client"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Spotlight } from "@/components/ui/spotlight-new"
import { SearchIcon } from "@/components/animated-icons/search-icon"
import { ChartPieIcon } from "@/components/animated-icons/chart-pie-icon"
import { PlayIcon } from "@/components/animated-icons/play-icon"
import { LockIcon } from "@/components/animated-icons/lock-icon"
import { SettingsGearIcon } from "@/components/animated-icons/settings-gear-icon"
import { DownloadIcon } from "@/components/animated-icons/download-icon"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LogoIcon from "@/components/logo-icon"
import { useRef } from "react"

export default function LandingPage() {
  const searchIconRef = useRef<any>(null)
  const playIconRef = useRef<any>(null)
  const chartIconRef = useRef<any>(null)
  const lockIconRef = useRef<any>(null)
  const settingsIconRef = useRef<any>(null)
  const downloadIconRef = useRef<any>(null)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section with Spotlight */}
      <section className="relative h-[40rem] w-full flex md:items-center md:justify-center bg-gradient-to-b from-gray-50 to-white antialiased bg-grid-gray-100/[0.02] overflow-hidden">
        <Spotlight className="opacity-30 right-0" fill="#3b82f6" />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 px-12 md:px-20 lg:px-32">
          <h1 className="text-3xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
            Streamline YouTube.
          </h1>
          <p className="mt-4 text-3xl md:text-5xl font-bold text-center text-gray-500">
            See only what matters. Be productive.
          </p>
          <div className="flex justify-center items-center gap-3 mt-12">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
              size="sm"
              onClick={() => (window.location.href = "/home")}
            >
              Get Started
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <a href="#features" className="flex items-center gap-1">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-12 md:px-20 lg:px-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Built for Digital Wellness</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A distraction-free YouTube experience that helps you focus on intentional video consumption.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => searchIconRef.current?.startAnimation()}
              onMouseLeave={() => searchIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <SearchIcon ref={searchIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Search for specific content without algorithmic distractions. Find what you need, watch intentionally.
              </p>
            </div>
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => playIconRef.current?.startAnimation()}
              onMouseLeave={() => playIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <PlayIcon ref={playIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Clean Player</h3>
              <p className="text-gray-600">
                Watch videos in a distraction-free environment without recommendations or endless scrolling.
              </p>
            </div>
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => chartIconRef.current?.startAnimation()}
              onMouseLeave={() => chartIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ChartPieIcon ref={chartIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Insights</h3>
              <p className="text-gray-600">
                Track your viewing habits and maintain digital wellness with detailed analytics and insights.
              </p>
            </div>
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => lockIconRef.current?.startAnimation()}
              onMouseLeave={() => lockIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <LockIcon ref={lockIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Privacy First</h3>
              <p className="text-gray-600">All data stored locally. No tracking, no external data collection.</p>
            </div>
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => settingsIconRef.current?.startAnimation()}
              onMouseLeave={() => settingsIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <SettingsGearIcon ref={settingsIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customizable</h3>
              <p className="text-gray-600">Filter content, set time limits, and configure your perfect experience.</p>
            </div>
            <div
              className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onMouseEnter={() => downloadIconRef.current?.startAnimation()}
              onMouseLeave={() => downloadIconRef.current?.stopAnimation()}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <DownloadIcon ref={downloadIconRef} size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Export</h3>
              <p className="text-gray-600">Export your usage data and preferences. Your data, your control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Improved Pricing Section */}
      <section id="pricing" className="relative py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 md:px-20 lg:px-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center min-h-[400px]">
            {/* Left side - Content */}
            <div className="flex flex-col justify-center h-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">No Catch. Just Free.</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                While others charge for focus, we believe it should be accessible to everyone. No subscriptions, no
                hidden fees, no premium tiers. Just pure, distraction-free YouTube.
              </p>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm w-fit"
                size="sm"
                onClick={() => (window.location.href = "/home")}
              >
                Start Using PureTube
              </Button>
            </div>
            {/* Right side - Price */}
            <div className="flex flex-col justify-center items-center h-full">
              <div className="flex items-baseline justify-center mb-8">
                <span className="text-8xl md:text-9xl font-bold text-blue-500">$0</span>
                <span className="text-3xl text-gray-400 ml-4">/forever</span>
              </div>
            </div>
          </div>
          {/* Features below */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Unlimited searches & videos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Complete privacy protection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Advanced usage analytics</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">Open source & transparent</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">No ads, no tracking, no BS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-gradient-to-b from-white via-blue-300/10 to-white">
        <div className="max-w-4xl mx-auto px-12 md:px-20 lg:px-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about PureTube</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does PureTube work?</AccordionTrigger>
              <AccordionContent>
                PureTube uses the YouTube API to search and display videos in a clean interface without distractions
                like recommendations, comments, or related videos. You get the content you want without the algorithmic
                noise.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my data safe and private?</AccordionTrigger>
              <AccordionContent>
                Yes, all your data is stored locally in your browser. We don't collect, track, or store any personal
                information on external servers. Your viewing habits, search history, and preferences stay completely
                private.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do I need a YouTube account?</AccordionTrigger>
              <AccordionContent>
                No, you don't need a YouTube account to use PureTube. You can search and watch videos without signing
                in. However, some features like playlists work better with your own API key.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I use my own API key?</AccordionTrigger>
              <AccordionContent>
                Yes, you can add your own YouTube Data API key for better performance and higher usage limits through
                the settings page. This gives you more control and removes any potential rate limiting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Will PureTube always be free?</AccordionTrigger>
              <AccordionContent>
                Yes, PureTube will always be free. We believe digital wellness tools shouldn't be behind a paywall. The
                project is open source and community-driven, ensuring it remains accessible to everyone.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Own Your Attention Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-50/30 via-transparent to-transparent rounded-[3rem] mx-8"></div>
        <div className="max-w-5xl mx-auto text-center px-12 md:px-20 lg:px-32 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Own Your Attention</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Break free from algorithmic rabbit holes and endless recommendations. PureTube puts you back in control of
            your YouTube experience.
          </p>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
            size="sm"
            onClick={() => (window.location.href = "/home")}
          >
            Start for Free
          </Button>
        </div>
      </section>

      {/* Simple Footer */}
      <div className="max-w-7xl mx-auto px-12 md:px-20 lg:px-32">
        <div className="border-t border-gray-100 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LogoIcon />
              <span className="text-sm text-black font-medium">Reach your peak with PureTube</span>
            </div>
            <p className="text-sm text-gray-600">© 2025 Open source and privacy-focused.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
