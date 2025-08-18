"use client"

import { PromptBuilderClean } from "@/components/prompt-builder-clean"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Video Prompt Builder</h1>
          <p className="text-muted-foreground mt-1">
            Professional-grade prompts for Google Veo 3 & Imagen 3/4 with color-coded provenance
          </p>
        </div>
        <ThemeToggle />
      </div>
      
      <PromptBuilderClean />
    </div>
  )
}
