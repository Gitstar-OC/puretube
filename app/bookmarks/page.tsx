"use client"

import { SidebarInset } from "@/components/ui/sidebar"

export default function BookmarksPage() {
  return (
    <SidebarInset className="bg-[#f3f9ff] dark:bg-black">
      <div className="flex w-full flex-col">
        <div className="p-6 md:p-8">
          <div className="w-full max-w-3xl mx-auto mt-4">
            <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
            <p>This is the bookmarks page.</p>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
