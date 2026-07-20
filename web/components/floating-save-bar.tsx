"use client"

import { Button } from "@/components/ui/button"
import { Save, Undo2 } from "lucide-react"

interface FloatingSaveBarProps {
  hasChanges: boolean
  onSave: () => void
  onUndo: () => void
  saveLabel?: string
  undoLabel?: string
}

export function FloatingSaveBar({
  hasChanges,
  onSave,
  onUndo,
  saveLabel = "Save",
  undoLabel = "Discard",
}: FloatingSaveBarProps) {
  if (!hasChanges) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-2xl rounded-lg px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-yellow-500 animate-pulse" />
          <p className="text-sm text-foreground font-medium">Unsaved changes</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onUndo} className="h-8">
            <Undo2 className="size-4 mr-1.5" />
            {undoLabel}
          </Button>
          <Button type="button" size="sm" onClick={onSave} className="h-8">
            <Save className="size-4 mr-1.5" />
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

