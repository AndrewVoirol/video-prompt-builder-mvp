"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Provenance tracking for color-coded UI
type ProvenanceSource = 'manual' | 'preset' | 'ai-enhanced' | 'default'

interface PromptField {
  value: string
  source: ProvenanceSource
  timestamp: number
}

interface Prompt {
  sceneType: PromptField
  environment: PromptField
  subject: PromptField
  cameraMovement: PromptField
  shotSize: PromptField
  lightingStyle: PromptField
  mood: PromptField
  colorPalette: PromptField
  visualStyle: PromptField
  ambientSound: PromptField
  musicStyle: PromptField
}

// Output formats for different use cases
interface PromptOutput {
  json: {
    veo3: object
    imagen: object
  }
  naturalLanguage: {
    veo3: string
    imagen: string
  }
}

// TODO: Implement preset functionality
// interface Preset {
//   sceneType: string
//   environment: string
//   subject: string
//   cameraMovement: string
//   shotSize: string
//   lightingStyle: string
//   mood: string
//   colorPalette: string
//   visualStyle: string
//   ambientSound: string
//   musicStyle: string
// }

// Helper function to create a new prompt field
const createPromptField = (value: string = '', source: ProvenanceSource = 'default'): PromptField => ({
  value,
  source,
  timestamp: Date.now()
})

// Helper function to get provenance color classes
const getProvenanceClasses = (source: ProvenanceSource) => {
  switch (source) {
    case 'manual':
      return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20'
    case 'preset':
      return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
    case 'ai-enhanced':
      return 'border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-950/20'
    case 'default':
      return 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
    default:
      return ''
  }
}

export function PromptBuilder() {
  const [prompt, setPrompt] = React.useState<Prompt>({
    sceneType: createPromptField(),
    environment: createPromptField(),
    subject: createPromptField(),
    cameraMovement: createPromptField(),
    shotSize: createPromptField(),
    lightingStyle: createPromptField(),
    mood: createPromptField(),
    colorPalette: createPromptField(),
    visualStyle: createPromptField(),
    ambientSound: createPromptField(),
    musicStyle: createPromptField(),
  })

  // Helper function to update a field with provenance tracking
  const updateField = (fieldName: keyof Prompt, value: string, source: ProvenanceSource = 'manual') => {
    setPrompt(prev => ({
      ...prev,
      [fieldName]: createPromptField(value, source)
    }))
  }

  // Generate structured output for different models
  const generateOutput = (): PromptOutput => {
    const fields = prompt
    
    // Extract values for processing
    const values = {
      sceneType: fields.sceneType.value,
      environment: fields.environment.value,
      subject: fields.subject.value,
      cameraMovement: fields.cameraMovement.value,
      shotSize: fields.shotSize.value,
      lightingStyle: fields.lightingStyle.value,
      mood: fields.mood.value,
      colorPalette: fields.colorPalette.value,
      visualStyle: fields.visualStyle.value,
      ambientSound: fields.ambientSound.value,
      musicStyle: fields.musicStyle.value,
    }

    // Filter out empty values
    const nonEmptyValues = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value.trim() !== '')
    )

    return {
      json: {
        veo3: {
          scene_type: values.sceneType,
          environment: values.environment,
          subject: values.subject,
          camera_movement: values.cameraMovement,
          shot_size: values.shotSize,
          lighting: values.lightingStyle,
          mood: values.mood,
          color_palette: values.colorPalette,
          visual_style: values.visualStyle,
          audio: {
            ambient_sound: values.ambientSound,
            music_style: values.musicStyle
          }
        },
        imagen: {
          subject: values.subject,
          environment: values.environment,
          lighting: values.lightingStyle,
          mood: values.mood,
          color_palette: values.colorPalette,
          visual_style: values.visualStyle
        }
      },
      naturalLanguage: {
        veo3: Object.entries(nonEmptyValues)
          .map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').toLowerCase()
            return `${label}: ${value}`
          })
          .join(', '),
        imagen: [values.subject, values.environment, values.lightingStyle, values.mood, values.colorPalette, values.visualStyle]
          .filter(v => v.trim() !== '')
          .join(', ')
      }
    }
  }

  // State for storing generated output
  const [output, setOutput] = React.useState<PromptOutput | null>(null)

  const updateOutput = () => {
    const newOutput = generateOutput()
    setOutput(newOutput)
    console.log('Generated Output:', newOutput)
  }

  return (
    <React.Fragment>
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Prompt Controls</h3>
          <div className="grid gap-4">
            <div className={`relative ${getProvenanceClasses(prompt.sceneType.source)}`}>
              <Select onValueChange={(value) => updateField('sceneType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Scene Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dialogue">Dialogue</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="establishing">Establishing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.environment.source)}`}>
              <Input 
                placeholder="Environment" 
                value={prompt.environment.value} 
                onChange={(e) => updateField('environment', e.target.value)} 
              />
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.subject.source)}`}>
              <Input 
                placeholder="Subject" 
                value={prompt.subject.value} 
                onChange={(e) => updateField('subject', e.target.value)} 
              />
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.cameraMovement.source)}`}>
              <Select onValueChange={(value) => updateField('cameraMovement', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Camera Movement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="tracking">Tracking</SelectItem>
                  <SelectItem value="dolly">Dolly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.shotSize.source)}`}>
              <Select onValueChange={(value) => updateField('shotSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Shot Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="closeup">Close-up</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="wide">Wide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.lightingStyle.source)}`}>
              <Select onValueChange={(value) => updateField('lightingStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Lighting Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Natural</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.mood.source)}`}>
              <Input 
                placeholder="Mood" 
                value={prompt.mood.value} 
                onChange={(e) => updateField('mood', e.target.value)} 
              />
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.colorPalette.source)}`}>
              <Select onValueChange={(value) => updateField('colorPalette', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Color Palette" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cool">Cool</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.visualStyle.source)}`}>
              <Select onValueChange={(value) => updateField('visualStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Visual Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.ambientSound.source)}`}>
              <Input 
                placeholder="Ambient Sound" 
                value={prompt.ambientSound.value} 
                onChange={(e) => updateField('ambientSound', e.target.value)} 
              />
            </div>
            <div className={`relative ${getProvenanceClasses(prompt.musicStyle.source)}`}>
              <Select onValueChange={(value) => updateField('musicStyle', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Music Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orchestral">Orchestral</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Provenance Legend */}
      <Card className="mb-4">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">Color-Coded Provenance Legend</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300">
              🟢 Manual Input
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
              🔵 From Preset
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
              🟣 AI Enhanced
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              🟡 Default Value
            </Badge>
          </div>
        </div>
      </Card>

      <div className="flex gap-4 mb-6">
        <Button onClick={updateOutput} className="flex-1">Generate Prompts</Button>
      </div>

      {/* Output Display */}
      {output && (
        <Card className="mb-8">
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
    </React.Fragment>
  )
}
