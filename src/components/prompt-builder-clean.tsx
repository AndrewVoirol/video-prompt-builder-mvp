"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { nanoid } from "nanoid"

// ============================================================================
// TYPE DEFINITIONS - VEO 3 Professional Structure
// ============================================================================

type CategoryType = 'shot' | 'subject' | 'scene' | 'visualDetails' | 'cinematography' | 'audioTrack'
type DataSource = 'manual' | 'preset' | 'ai-enhanced' | 'default'

interface PromptField {
  value: string
  category: CategoryType
  source: DataSource
  timestamp: number
}

// VEO 3 Professional Structure - Clean and organized by categories
interface VEO3Prompt {
  // Shot category - Technical camera details
  composition: PromptField
  cameraMotion: PromptField
  frameRate: PromptField
  shotSize: PromptField
  
  // Subject category - Character appearance and wardrobe
  subjectDescription: PromptField
  wardrobe: PromptField
  
  // Scene category - Setting and environment
  location: PromptField
  timeOfDay: PromptField
  environment: PromptField
  
  // Visual Details category - Actions and props
  action: PromptField
  props: PromptField
  
  // Cinematography category - Artistic visual style
  lighting: PromptField
  colorGrade: PromptField
  visualStyle: PromptField
  
  // Audio Track category - Sound elements
  ambientSound: PromptField
  musicStyle: PromptField
  mood: PromptField
}

// Output formats
interface VEO3JSON {
  shot: {
    composition: string
    camera_motion: string
    frame_rate: string
    shot_size: string
  }
  subject: {
    description: string
    wardrobe: string
  }
  scene: {
    location: string
    time_of_day: string
    environment: string
  }
  visual_details: {
    action: string
    props: string
  }
  cinematography: {
    lighting: string
    color_grade: string
    visual_style: string
  }
  audio_track: {
    ambient_sound: string
    music_style: string
    mood: string
  }
}

interface ImagenJSON {
  subject: string
  environment: string
  lighting: string
  mood: string
  visual_style: string
}

interface PromptOutput {
  json: {
    veo3: VEO3JSON
    imagen: ImagenJSON
  }
  naturalLanguage: {
    veo3: string
    imagen: string
  }
}

// Preset management types - keeps presets in perfect sync with VEO3 fields
type PresetValues = { [K in keyof VEO3Prompt]: string }
interface Preset { id: string; name: string; values: PresetValues; builtIn?: boolean }

// Professional Presets - Built-in starting points for common video scenarios
const PROFESSIONAL_PRESETS: Preset[] = [
  {
    id: 'cinematic-drama',
    name: 'Cinematic Drama',
    values: {
      composition: 'rule of thirds',
      cameraMotion: 'tracking',
      frameRate: '24fps',
      shotSize: 'medium shot',
      subjectDescription: 'two characters in intense conversation',
      wardrobe: 'contemporary business attire',
      location: 'modern urban apartment',
      timeOfDay: 'golden hour',
      environment: 'warm lighting through large windows',
      action: 'engaged in serious discussion',
      props: 'coffee cups on table, documents scattered',
      lighting: 'dramatic natural lighting',
      colorGrade: 'warm cinematic grade',
      visualStyle: 'cinematic realism',
      ambientSound: 'subtle city traffic, muffled voices',
      musicStyle: 'orchestral underscore',
      mood: 'tense, emotional, high stakes'
    },
    builtIn: true
  },
  {
    id: 'high-energy-action',
    name: 'High-Energy Action',
    values: {
      composition: 'dynamic angles',
      cameraMotion: 'handheld tracking',
      frameRate: '60fps',
      shotSize: 'wide shot',
      subjectDescription: 'multiple characters in coordinated movement',
      wardrobe: 'tactical gear, athletic wear',
      location: 'industrial warehouse',
      timeOfDay: 'night',
      environment: 'dramatic overhead lighting, shadows',
      action: 'fast-paced chase sequence',
      props: 'metal crates, machinery, vehicles',
      lighting: 'harsh industrial lighting',
      colorGrade: 'cool blue-teal grade',
      visualStyle: 'high-contrast commercial',
      ambientSound: 'metal clanking, footsteps echoing',
      musicStyle: 'electronic percussive',
      mood: 'intense, adrenaline-fueled, urgent'
    },
    builtIn: true
  },
  {
    id: 'documentary-neutral',
    name: 'Documentary Neutral',
    values: {
      composition: 'balanced center frame',
      cameraMotion: 'static tripod',
      frameRate: '30fps',
      shotSize: 'medium close-up',
      subjectDescription: 'single speaker in natural pose',
      wardrobe: 'professional casual attire',
      location: 'office or home study',
      timeOfDay: 'daytime',
      environment: 'natural daylight, clean background',
      action: 'speaking directly to camera',
      props: 'minimal - desk, bookshelf, plants',
      lighting: 'natural soft lighting',
      colorGrade: 'neutral realistic grade',
      visualStyle: 'documentary realism',
      ambientSound: 'subtle room tone',
      musicStyle: '',
      mood: 'authentic, trustworthy, informative'
    },
    builtIn: true
  },
  {
    id: 'commercial-product',
    name: 'Commercial Product',
    values: {
      composition: 'product-focused framing',
      cameraMotion: 'smooth dolly movement',
      frameRate: '24fps',
      shotSize: 'close-up to medium',
      subjectDescription: 'attractive model with product',
      wardrobe: 'stylish contemporary fashion',
      location: 'modern minimalist studio',
      timeOfDay: 'studio lighting',
      environment: 'clean white backdrop, soft shadows',
      action: 'demonstrating product features',
      props: 'featured product, elegant accessories',
      lighting: 'professional studio lighting',
      colorGrade: 'vibrant commercial grade',
      visualStyle: 'polished commercial',
      ambientSound: 'clean studio atmosphere',
      musicStyle: 'upbeat contemporary',
      mood: 'aspirational, energetic, appealing'
    },
    builtIn: true
  },
  {
    id: 'artistic-portrait',
    name: 'Artistic Portrait',
    values: {
      composition: 'artistic asymmetrical framing',
      cameraMotion: 'subtle push-in',
      frameRate: '24fps',
      shotSize: 'medium to close-up',
      subjectDescription: 'expressive portrait subject',
      wardrobe: 'artistic or period costume',
      location: 'atmospheric interior space',
      timeOfDay: 'magic hour',
      environment: 'textured walls, natural elements',
      action: 'contemplative poses, natural movement',
      props: 'vintage furniture, artistic objects',
      lighting: 'dramatic chiaroscuro lighting',
      colorGrade: 'desaturated artistic grade',
      visualStyle: 'fine art cinematography',
      ambientSound: 'subtle environmental textures',
      musicStyle: 'ambient atmospheric',
      mood: 'contemplative, artistic, emotional depth'
    },
    builtIn: true
  }
]

// ============================================================================
// LOCALSTORAGE PERSISTENCE HELPERS
// ============================================================================

// localStorage key for user presets
const USER_PRESETS_STORAGE_KEY = 'veo3-user-presets'

// Load user presets from localStorage with error handling
const loadUserPresets = (): Preset[] => {
  try {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(USER_PRESETS_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Failed to load user presets from localStorage:', error)
    return []
  }
}

// Save user presets to localStorage with error handling
const saveUserPresets = (presets: Preset[]): void => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error('Failed to save user presets to localStorage:', error)
  }
}

// ============================================================================
// HELPER FUNCTIONS - Clean and Type-Safe
// ============================================================================

// Create a new prompt field with proper category assignment
const createPromptField = (
  value: string = '', 
  category: CategoryType, 
  source: DataSource = 'default'
): PromptField => ({
  value,
  category,
  source,
  timestamp: Date.now()
})

// Category-based visual styling for VEO 3 structure
const getCategoryColorClasses = (category: CategoryType): string => {
  const categoryStyles: Record<CategoryType, string> = {
    shot: 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
    subject: 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
    scene: 'border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
    visualDetails: 'border-l-4 border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
    cinematography: 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
    audioTrack: 'border-l-4 border-l-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
  }
  return categoryStyles[category] || 'border-l-4 border-l-gray-500 bg-gray-50/50 dark:bg-gray-950/20'
}

// Data source styling (subtle overlay)
const getDataSourceClasses = (source: DataSource): string => {
  const sourceStyles: Record<DataSource, string> = {
    preset: 'ring-2 ring-blue-200 dark:ring-blue-800',
    'ai-enhanced': 'ring-2 ring-violet-200 dark:ring-violet-800',
    manual: '', // No additional styling for manual input
    default: 'opacity-60' // Reduced opacity for default/empty
  }
  return sourceStyles[source] || ''
}

// Combine category and source styling
const getFieldClasses = (field: PromptField): string => {
  const categoryClasses = getCategoryColorClasses(field.category)
  const sourceClasses = getDataSourceClasses(field.source)
  return `${categoryClasses} ${sourceClasses}`.trim()
}

// Create initial prompt state with proper category assignments
const createInitialPrompt = (): VEO3Prompt => ({
  // Shot category
  composition: createPromptField('', 'shot'),
  cameraMotion: createPromptField('', 'shot'),
  frameRate: createPromptField('', 'shot'),
  shotSize: createPromptField('', 'shot'),
  
  // Subject category
  subjectDescription: createPromptField('', 'subject'),
  wardrobe: createPromptField('', 'subject'),
  
  // Scene category
  location: createPromptField('', 'scene'),
  timeOfDay: createPromptField('', 'scene'),
  environment: createPromptField('', 'scene'),
  
  // Visual Details category
  action: createPromptField('', 'visualDetails'),
  props: createPromptField('', 'visualDetails'),
  
  // Cinematography category
  lighting: createPromptField('', 'cinematography'),
  colorGrade: createPromptField('', 'cinematography'),
  visualStyle: createPromptField('', 'cinematography'),
  
  // Audio Track category
  ambientSound: createPromptField('', 'audioTrack'),
  musicStyle: createPromptField('', 'audioTrack'),
  mood: createPromptField('', 'audioTrack')
})

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PromptBuilderClean() {
  const [prompt, setPrompt] = React.useState<VEO3Prompt>(createInitialPrompt())
  const [userPresets, setUserPresets] = React.useState<Preset[]>([])
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(null)
  
  // Save as Preset dialog state
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [presetName, setPresetName] = React.useState('')

  // Load user presets from localStorage on component mount
  React.useEffect(() => {
    const loadedPresets = loadUserPresets()
    setUserPresets(loadedPresets)
  }, [])

  // Persist user presets to localStorage whenever userPresets changes (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveUserPresets(userPresets)
    }, 0) // Use timeout 0 to avoid race conditions

    return () => {
      clearTimeout(timeoutId)
    }
  }, [userPresets])

  // Helper function to update a field with provenance tracking
  const updateField = (
    fieldName: keyof VEO3Prompt, 
    value: string, 
    source: DataSource = 'manual'
  ) => {
    setPrompt(prev => {
      const currentField = prev[fieldName]
      return {
        ...prev,
        [fieldName]: createPromptField(value, currentField.category, source)
      }
    })
  }

  // Apply a preset to all fields
  const applyPreset = (preset: Preset) => {
    // Loop through every key in preset.values and update the corresponding field
    Object.entries(preset.values).forEach(([key, value]) => {
      const fieldName = key as keyof VEO3Prompt
      updateField(fieldName, value, 'preset')
    })
  }

  // Handle preset selection
  const handlePresetSelection = (presetId: string) => {
    // Ignore divider selections
    if (presetId === 'divider' || presetId === 'my-presets-divider') {
      return
    }
    
    // Handle "Start Fresh" selection
    if (presetId === 'start-fresh') {
      setSelectedPresetId(null)
      setPrompt(createInitialPrompt())
      return
    }
    
    setSelectedPresetId(presetId)
    
    if (!presetId) {
      // Empty selection means "Start Fresh"
      return
    }

    // Find preset from either built-in or user presets
    const allPresets = [...PROFESSIONAL_PRESETS, ...userPresets]
    const selectedPreset = allPresets.find(preset => preset.id === presetId)
    
    if (selectedPreset) {
      applyPreset(selectedPreset)
    }
  }

  // Generate structured output for different models
  const generateOutput = (): PromptOutput => {
    const extractValue = (field: PromptField) => field.value.trim()
    
    // Extract all values
    const values = {
      composition: extractValue(prompt.composition),
      cameraMotion: extractValue(prompt.cameraMotion),
      frameRate: extractValue(prompt.frameRate),
      shotSize: extractValue(prompt.shotSize),
      subjectDescription: extractValue(prompt.subjectDescription),
      wardrobe: extractValue(prompt.wardrobe),
      location: extractValue(prompt.location),
      timeOfDay: extractValue(prompt.timeOfDay),
      environment: extractValue(prompt.environment),
      action: extractValue(prompt.action),
      props: extractValue(prompt.props),
      lighting: extractValue(prompt.lighting),
      colorGrade: extractValue(prompt.colorGrade),
      visualStyle: extractValue(prompt.visualStyle),
      ambientSound: extractValue(prompt.ambientSound),
      musicStyle: extractValue(prompt.musicStyle),
      mood: extractValue(prompt.mood)
    }

    // Filter out empty values for natural language
    const nonEmptyEntries = Object.entries(values).filter(([, value]) => value !== '')

    return {
      json: {
        veo3: {
          shot: {
            composition: values.composition,
            camera_motion: values.cameraMotion,
            frame_rate: values.frameRate,
            shot_size: values.shotSize
          },
          subject: {
            description: values.subjectDescription,
            wardrobe: values.wardrobe
          },
          scene: {
            location: values.location,
            time_of_day: values.timeOfDay,
            environment: values.environment
          },
          visual_details: {
            action: values.action,
            props: values.props
          },
          cinematography: {
            lighting: values.lighting,
            color_grade: values.colorGrade,
            visual_style: values.visualStyle
          },
          audio_track: {
            ambient_sound: values.ambientSound,
            music_style: values.musicStyle,
            mood: values.mood
          }
        },
        imagen: {
          subject: values.subjectDescription,
          environment: values.environment,
          lighting: values.lighting,
          mood: values.mood,
          visual_style: values.visualStyle
        }
      },
      naturalLanguage: {
        veo3: nonEmptyEntries
          .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').toLowerCase()
            return `${label}: ${value}`
          })
          .join(', '),
        imagen: [
          values.subjectDescription, 
          values.environment, 
          values.lighting, 
          values.mood, 
          values.visualStyle
        ]
          .filter(v => v !== '')
          .join(', ')
      }
    }
  }

  const [output, setOutput] = React.useState<PromptOutput | null>(null)

  const handleGenerateOutput = () => {
    const newOutput = generateOutput()
    setOutput(newOutput)
  }

  const clearAllFields = () => {
    setPrompt(createInitialPrompt())
    setSelectedPresetId(null)
    setOutput(null)
  }

  // Open the save dialog
  const openSaveDialog = () => {
    setPresetName('')
    setShowSaveDialog(true)
  }

  // Save current prompt state as a new user preset with dialog input
  const handleSavePreset = () => {
    const trimmedName = presetName.trim()
    if (!trimmedName) {
      return // Don't save if name is empty
    }

    // 1. Capture current prompt field values into a PresetValues object
    const currentValues: PresetValues = {
      composition: prompt.composition.value,
      cameraMotion: prompt.cameraMotion.value,
      frameRate: prompt.frameRate.value,
      shotSize: prompt.shotSize.value,
      subjectDescription: prompt.subjectDescription.value,
      wardrobe: prompt.wardrobe.value,
      location: prompt.location.value,
      timeOfDay: prompt.timeOfDay.value,
      environment: prompt.environment.value,
      action: prompt.action.value,
      props: prompt.props.value,
      lighting: prompt.lighting.value,
      colorGrade: prompt.colorGrade.value,
      visualStyle: prompt.visualStyle.value,
      ambientSound: prompt.ambientSound.value,
      musicStyle: prompt.musicStyle.value,
      mood: prompt.mood.value
    }

    // 2. Create new Preset { id: nanoid(), name, values }
    const newPreset: Preset = {
      id: nanoid(),
      name: trimmedName,
      values: currentValues,
      builtIn: false
    }

    // 3. setUserPresets(prev => [...prev, newPreset]) – persistence hook handles storage
    setUserPresets(prev => [...prev, newPreset])
    
    // Select the newly created preset and close dialog
    setSelectedPresetId(newPreset.id)
    setShowSaveDialog(false)
    setPresetName('')
  }

  return (
    <div className="space-y-6">
      {/* Professional Presets Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">🎨 Professional Presets</h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Choose a Professional Starting Point
                </label>
                <Select
                  value={selectedPresetId || ''}
                  onValueChange={handlePresetSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a preset or start fresh..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start-fresh">-- Start Fresh --</SelectItem>
                    {PROFESSIONAL_PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Professional {preset.name.toLowerCase()} scenario
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
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openSaveDialog}
                      variant="outline"
                      size="sm"
                    >
                      💾 Save as Preset
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Save Current Prompt as Preset</DialogTitle>
                      <DialogDescription>
                        Give your preset a descriptive name to easily identify it later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="preset-name" className="text-right">
                          Name
                        </label>
                        <Input
                          id="preset-name"
                          placeholder="My Custom Preset"
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          className="col-span-3"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSavePreset()
                            }
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowSaveDialog(false)
                          setPresetName('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSavePreset}
                        disabled={!presetName.trim()}
                      >
                        Save Preset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {selectedPresetId && (
              <div className="text-sm text-muted-foreground">
                ✨ Preset applied! All fields have been populated with professional values.
                You can now customize individual fields as needed.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Category Legend */}
      <Card>
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">VEO 3 Category-Based Color Coding</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              🎥 Shot (Technical)
            </Badge>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
              👤 Subject (Character)
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              🏞️ Scene (Environment)
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
              🎬 Visual Details (Action)
            </Badge>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300">
              🎨 Cinematography (Style)
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300">
              🔊 Audio Track (Sound)
            </Badge>
          </div>
        </div>
      </Card>

      {/* Shot Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
            🎥 Shot - Technical Camera Details
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.composition)}>
              <Input
                placeholder="Composition (e.g., rule of thirds, symmetrical)"
                value={prompt.composition.value}
                onChange={(e) => updateField('composition', e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className={getFieldClasses(prompt.cameraMotion)}>
              <Select 
                value={prompt.cameraMotion.value} 
                onValueChange={(value) => updateField('cameraMotion', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Camera Motion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="tracking">Tracking</SelectItem>
                  <SelectItem value="dolly">Dolly</SelectItem>
                  <SelectItem value="crane">Crane</SelectItem>
                  <SelectItem value="handheld">Handheld</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.frameRate)}>
              <Select 
                value={prompt.frameRate.value} 
                onValueChange={(value) => updateField('frameRate', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Frame Rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24fps">24fps (Cinematic)</SelectItem>
                  <SelectItem value="30fps">30fps (Standard)</SelectItem>
                  <SelectItem value="60fps">60fps (High Frame Rate)</SelectItem>
                  <SelectItem value="120fps">120fps (Slow Motion)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.shotSize)}>
              <Select 
                value={prompt.shotSize.value} 
                onValueChange={(value) => updateField('shotSize', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Shot Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extreme-closeup">Extreme Close-up</SelectItem>
                  <SelectItem value="closeup">Close-up</SelectItem>
                  <SelectItem value="medium">Medium Shot</SelectItem>
                  <SelectItem value="wide">Wide Shot</SelectItem>
                  <SelectItem value="extreme-wide">Extreme Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Subject Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700 dark:text-green-300">
            👤 Subject - Character & Appearance
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.subjectDescription)}>
              <Input
                placeholder="Subject Description (e.g., professional woman, 30s)"
                value={prompt.subjectDescription.value}
                onChange={(e) => updateField('subjectDescription', e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className={getFieldClasses(prompt.wardrobe)}>
              <Input
                placeholder="Wardrobe (e.g., business suit, casual wear)"
                value={prompt.wardrobe.value}
                onChange={(e) => updateField('wardrobe', e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Scene Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-700 dark:text-amber-300">
            🏞️ Scene - Environment & Setting
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.location)}>
              <Input
                placeholder="Location (e.g., modern office, urban street)"
                value={prompt.location.value}
                onChange={(e) => updateField('location', e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className={getFieldClasses(prompt.timeOfDay)}>
              <Select 
                value={prompt.timeOfDay.value} 
                onValueChange={(value) => updateField('timeOfDay', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Time of Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dawn">Dawn</SelectItem>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="midday">Midday</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="golden-hour">Golden Hour</SelectItem>
                  <SelectItem value="dusk">Dusk</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="late-night">Late Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.environment)}>
              <Input
                placeholder="Environment Details (e.g., bustling atmosphere, quiet solitude)"
                value={prompt.environment.value}
                onChange={(e) => updateField('environment', e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Details Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700 dark:text-purple-300">
            🎬 Visual Details - Action & Props
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.action)}>
              <Input
                placeholder="Action (e.g., walking confidently, typing at computer)"
                value={prompt.action.value}
                onChange={(e) => updateField('action', e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className={getFieldClasses(prompt.props)}>
              <Input
                placeholder="Props (e.g., smartphone, coffee cup, documents)"
                value={prompt.props.value}
                onChange={(e) => updateField('props', e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Cinematography Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-300">
            🎨 Cinematography - Visual Style & Lighting
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.lighting)}>
              <Select 
                value={prompt.lighting.value} 
                onValueChange={(value) => updateField('lighting', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Lighting Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="harsh">Harsh</SelectItem>
                  <SelectItem value="backlit">Backlit</SelectItem>
                  <SelectItem value="neon">Neon</SelectItem>
                  <SelectItem value="candlelit">Candlelit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.colorGrade)}>
              <Select 
                value={prompt.colorGrade.value} 
                onValueChange={(value) => updateField('colorGrade', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Color Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm Tones</SelectItem>
                  <SelectItem value="cool">Cool Tones</SelectItem>
                  <SelectItem value="desaturated">Desaturated</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="sepia">Sepia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.visualStyle)}>
              <Select 
                value={prompt.visualStyle.value} 
                onValueChange={(value) => updateField('visualStyle', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Visual Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Audio Track Category */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-700 dark:text-cyan-300">
            🔊 Audio Track - Sound & Mood
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className={getFieldClasses(prompt.ambientSound)}>
              <Input
                placeholder="Ambient Sound (e.g., city traffic, ocean waves)"
                value={prompt.ambientSound.value}
                onChange={(e) => updateField('ambientSound', e.target.value)}
                className="bg-transparent"
              />
            </div>
            <div className={getFieldClasses(prompt.musicStyle)}>
              <Select 
                value={prompt.musicStyle.value} 
                onValueChange={(value) => updateField('musicStyle', value)}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Music Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orchestral">Orchestral</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="acoustic">Acoustic</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="none">No Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={getFieldClasses(prompt.mood)}>
              <Input
                placeholder="Mood (e.g., tense and urgent, calm and peaceful)"
                value={prompt.mood.value}
                onChange={(e) => updateField('mood', e.target.value)}
                className="bg-transparent"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Preset Selection - Above Generate/Clear buttons */}
      <Card>
        <div className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Choose a Professional Starting Point
              </label>
              <Select
                value={selectedPresetId || ''}
                onValueChange={handlePresetSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a preset or start fresh..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start-fresh">-- Start Fresh --</SelectItem>
                  {PROFESSIONAL_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{preset.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Professional {preset.name.toLowerCase()} scenario
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                  {userPresets.length > 0 && (
                    <>
                      <SelectItem value="my-presets-divider" disabled className="font-medium text-muted-foreground">
                        — My Presets —
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
          </div>
          {selectedPresetId && (
            <div className="text-sm text-muted-foreground mt-2">
              ✨ Preset applied! All fields have been populated with professional values.
              You can now customize individual fields as needed.
            </div>
          )}
        </div>
      </Card>

      {/* Generate Button */}
      <div className="flex gap-4">
        <Button onClick={handleGenerateOutput} className="flex-1" size="lg">
          Generate VEO 3 Prompts
        </Button>
        <Button onClick={clearAllFields} variant="outline" size="lg">
          Clear All
        </Button>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={openSaveDialog}
              variant="outline"
              size="lg"
            >
              💾 Save as Preset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Current Prompt as Preset</DialogTitle>
              <DialogDescription>
                Give your preset a descriptive name to easily identify it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="preset-name" className="text-right">
                  Name
                </label>
                <Input
                  id="preset-name"
                  placeholder="My Custom Preset"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="col-span-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSavePreset()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSaveDialog(false)
                  setPresetName('')
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
              >
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Output Display */}
      {output && (
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Generated Prompts</h3>
            <Tabs defaultValue="natural" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="natural">Natural Language</TabsTrigger>
                <TabsTrigger value="json">JSON Format</TabsTrigger>
              </TabsList>
              
              <TabsContent value="natural" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">VEO 3 Prompt</h4>
                  <div className="p-4 bg-muted rounded-md font-mono text-sm">
                    {output.naturalLanguage.veo3 || 'No content generated'}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">Imagen 3/4 Prompt</h4>
                  <div className="p-4 bg-muted rounded-md font-mono text-sm">
                    {output.naturalLanguage.imagen || 'No content generated'}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="json" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">VEO 3 JSON</h4>
                  <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(output.json.veo3, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">Imagen 3/4 JSON</h4>
                  <pre className="p-4 bg-muted rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(output.json.imagen, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      )}
    </div>
  )
}
