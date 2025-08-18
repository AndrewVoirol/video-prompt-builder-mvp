# Detailed Next Steps & Resources

**Context**: This document provides everything needed to continue development after computer restart without missing a beat.

## 🎯 Current State Summary

- **Working App**: Clean VEO 3 prompt builder with 17 fields across 6 categories
- **Server Running**: http://localhost:3000 (kill with `kill $(cat dev-server.pid)`)
- **Build Status**: ✅ All tests passing, zero TypeScript errors
- **Main Component**: `src/components/prompt-builder-clean.tsx` (complete implementation)

## 📋 Phase 2A: Add Preset Management System (NEXT PRIORITY)

### 2A.1: Define Preset Types (15 min)

Add these interfaces to `prompt-builder-clean.tsx`:

```typescript
// Add after existing interfaces
interface PresetValues {
  // Map all 17 VEO3Prompt fields to string values
  composition: string
  cameraMotion: string
  frameRate: string
  shotSize: string
  subjectDescription: string
  wardrobe: string
  location: string
  timeOfDay: string
  environment: string
  action: string
  props: string
  lighting: string
  colorGrade: string
  visualStyle: string
  ambientSound: string
  musicStyle: string
  mood: string
}

interface Preset {
  id: string
  name: string
  description: string
  category: 'built-in' | 'user-created'
  values: PresetValues
  createdAt: number
  updatedAt: number
}
```

### 2A.2: Create Professional Presets (20 min)

Add these built-in presets:

```typescript
const BUILT_IN_PRESETS: Preset[] = [
  {
    id: 'cinematic-drama',
    name: 'Cinematic Drama',
    description: 'Professional dramatic scene with cinematic lighting',
    category: 'built-in',
    values: {
      composition: 'rule of thirds',
      cameraMotion: 'tracking',
      frameRate: '24fps',
      shotSize: 'medium',
      subjectDescription: 'two characters in intense conversation',
      wardrobe: 'contemporary business attire',
      location: 'modern urban apartment',
      timeOfDay: 'golden-hour',
      environment: 'warm lighting through large windows',
      action: 'engaged in serious discussion',
      props: 'coffee cups on table, documents scattered',
      lighting: 'dramatic',
      colorGrade: 'warm',
      visualStyle: 'cinematic',
      ambientSound: 'subtle city traffic, muffled voices',
      musicStyle: 'orchestral',
      mood: 'tense, emotional, high stakes'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'action-sequence',
    name: 'High-Energy Action',
    description: 'Fast-paced action with dynamic camera work',
    category: 'built-in',
    values: {
      composition: 'dynamic angles',
      cameraMotion: 'handheld',
      frameRate: '60fps',
      shotSize: 'wide',
      subjectDescription: 'multiple characters in coordinated movement',
      wardrobe: 'tactical gear, athletic wear',
      location: 'industrial warehouse',
      timeOfDay: 'night',
      environment: 'dramatic overhead lighting, shadows',
      action: 'fast-paced chase sequence',
      props: 'metal crates, machinery, vehicles',
      lighting: 'harsh',
      colorGrade: 'cool',
      visualStyle: 'commercial',
      ambientSound: 'metal clanking, footsteps echoing',
      musicStyle: 'electronic',
      mood: 'intense, adrenaline-fueled, urgent'
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  // Add 2-3 more presets: documentary-interview, commercial-product, artistic-portrait
]
```

### 2A.3: Add Preset Management State (10 min)

Add to component state:

```typescript
const [userPresets, setUserPresets] = React.useState<Preset[]>([])
const [selectedPresetId, setSelectedPresetId] = React.useState<string>('')
const [isLoadingPreset, setIsLoadingPreset] = React.useState(false)
```

### 2A.4: Add localStorage Functions (15 min)

```typescript
const PRESETS_STORAGE_KEY = 'veo3-prompt-builder-presets'

const loadPresetsFromStorage = (): Preset[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const savePresetsToStorage = (presets: Preset[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error('Failed to save presets:', error)
  }
}
```

### 2A.5: Add Preset UI Components (30 min)

Add before the Generate button:

```tsx
{/* Preset Management Section */}
<Card>
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-4">Professional Presets</h3>
    
    <div className="space-y-4">
      {/* Preset Selector */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">
            Choose a Professional Starting Point
          </label>
          <Select
            value={selectedPresetId}
            onValueChange={loadPreset}
            disabled={isLoadingPreset}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a preset..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Start Fresh --</SelectItem>
              {BUILT_IN_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {preset.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {userPresets.length > 0 && (
                <>
                  <SelectItem value="divider" disabled>
                    --- Your Saved Presets ---
                  </SelectItem>
                  {userPresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          onClick={saveCurrentAsPreset}
          disabled={isLoadingPreset}
        >
          Save Current
        </Button>
      </div>
      
      {/* Loading Indicator */}
      {isLoadingPreset && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          Loading preset...
        </div>
      )}
    </div>
  </div>
</Card>
```

## 📋 Phase 2B: Implement Preset Functions (AFTER 2A)

### Core Functions Needed:

```typescript
const loadPreset = async (presetId: string) => {
  if (!presetId) {
    clearAllFields()
    return
  }
  
  setIsLoadingPreset(true)
  const preset = [...BUILT_IN_PRESETS, ...userPresets].find(p => p.id === presetId)
  
  if (preset) {
    // Convert PresetValues to VEO3Prompt with 'preset' source
    const newPrompt = convertPresetToPrompt(preset.values)
    setPrompt(newPrompt)
    setSelectedPresetId(presetId)
  }
  
  setIsLoadingPreset(false)
}

const saveCurrentAsPreset = () => {
  // TODO: Show modal to get name/description
  // For now, create with default name
  const presetValues = convertPromptToPresetValues(prompt)
  const newPreset: Preset = {
    id: `user-${Date.now()}`,
    name: `Custom Preset ${userPresets.length + 1}`,
    description: 'User-created preset',
    category: 'user-created',
    values: presetValues,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  
  const updatedPresets = [...userPresets, newPreset]
  setUserPresets(updatedPresets)
  savePresetsToStorage(updatedPresets)
}

const convertPresetToPrompt = (values: PresetValues): VEO3Prompt => ({
  composition: createPromptField(values.composition, 'shot', 'preset'),
  cameraMotion: createPromptField(values.cameraMotion, 'shot', 'preset'),
  // ... all 17 fields
})

const convertPromptToPresetValues = (prompt: VEO3Prompt): PresetValues => ({
  composition: prompt.composition.value,
  cameraMotion: prompt.cameraMotion.value,
  // ... all 17 fields
})
```

## 📋 Phase 3: Polish Features (AFTER 2B)

### 3A: Copy to Clipboard (15 min)
- Add copy buttons next to output sections
- Use `navigator.clipboard.writeText()`
- Show toast notification on copy

### 3B: Keyboard Shortcuts (20 min)
- Ctrl/Cmd+Enter: Generate output
- Ctrl/Cmd+K: Clear all fields
- Escape: Clear current focus

### 3C: Field Validation (25 min)
- Add basic validation rules
- Show validation errors inline
- Prevent generation with invalid data

## 🛠️ Technical Resources

### Available Dependencies (package.json)
```json
{
  "dependencies": {
    "next": "15.4.5",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "next-themes": "^0.4.6",
    "@radix-ui/react-*": "various",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss": "^3.4.17"
  }
}
```

### ShadCN Components Available
- Card, Input, Select, Button, Badge, Tabs (already used)
- Dialog, Toast, Popover, Tooltip (for enhancements)
- Form, Label (for better form handling)

### Development Workflow
1. **Make changes** in `src/components/prompt-builder-clean.tsx`
2. **Check browser** at http://localhost:3000 (auto-reloads)
3. **Test TypeScript** with `pnpm run build`
4. **Commit changes** when working

## 🚨 Important Notes

1. **Server Management**: Server is running in background, use `kill $(cat dev-server.pid)` to stop
2. **Type Safety**: Maintain strict TypeScript - no `any` types allowed
3. **Component Structure**: Keep all logic in `prompt-builder-clean.tsx` for now
4. **Testing**: Test each feature immediately after implementation
5. **Backup**: Current working state is solid - don't break it

## 🎯 Success Criteria

After implementing Phase 2A, the app should:
- ✅ Load professional presets from dropdown
- ✅ Apply preset values with proper provenance tracking
- ✅ Save current state as new preset
- ✅ Persist user presets in localStorage
- ✅ Show loading states and proper UX feedback

This will make the app genuinely useful for professional video prompt generation.
