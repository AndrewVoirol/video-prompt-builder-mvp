# AI Video Prompt Builder MVP

Professional-grade prompt builder for Google Veo 3 & Imagen 3/4 with **color-coded provenance tracking**.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)

## 🚀 Features

### ✨ Core Functionality
- **Color-Coded Provenance System**: Track the source of every prompt field with visual indicators
- **Dual Output Formats**: Generate both JSON and natural language prompts
- **Real-time Generation**: Live preview and instant prompt updates
- **Professional UI**: Clean, modern interface with comprehensive controls

### 🎯 Model Support
- **Google Veo 3**: Full video generation prompt support
- **Imagen 3/4**: Image generation optimized prompts
- **Future Expansion**: Architecture ready for additional AI model providers

### 🎨 Provenance Color System
- 🟢 **Green**: Manual user input
- 🔵 **Blue**: From preset templates
- 🟣 **Purple**: AI-enhanced suggestions
- 🟡 **Amber**: Default system values

### 🔧 Technical Features
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Theme Support**: Light/dark mode with smooth transitions  
- **Responsive Design**: Optimized for desktop and mobile
- **Component Architecture**: Modular design for easy expansion

## 📋 Prompt Fields

The builder supports comprehensive video/image generation parameters:

| Field | Type | Description |
|-------|------|-------------|
| Scene Type | Select | Dialogue, Action, Establishing |
| Environment | Input | Location and setting description |
| Subject | Input | Main subject or character |
| Camera Movement | Select | Static, Tracking, Dolly |
| Shot Size | Select | Close-up, Medium, Wide |
| Lighting Style | Select | Natural, Dramatic |
| Mood | Input | Emotional tone and atmosphere |
| Color Palette | Select | Warm, Cool |
| Visual Style | Select | Cinematic, Documentary |
| Ambient Sound | Input | Background audio description |
| Music Style | Select | Orchestral, Electronic |

## 🛠️ Technical Stack

- **Framework**: Next.js 15.4.5 with App Router & Turbopack
- **Frontend**: React 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **UI Components**: Radix UI primitives for accessibility
- **Theme Management**: next-themes with system preference detection
- **Package Manager**: pnpm for fast, efficient dependency management

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/AndrewVoirol/video-prompt-builder-mvp.git
cd video-prompt-builder-mvp

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 📖 Usage

1. **Fill Prompt Fields**: Use the form controls to specify your video/image requirements
2. **Monitor Provenance**: Notice the color-coded borders indicating data source
3. **Generate Prompts**: Click "Generate Prompts" to create formatted outputs
4. **Choose Format**: Switch between Natural Language and JSON tabs
5. **Copy & Use**: Copy the generated prompts for your AI model calls

### Example Output

**Natural Language (Veo 3):**
```
scene type: dialogue, environment: modern office, subject: business meeting, camera movement: static, lighting: natural, mood: professional
```

**JSON (Veo 3):**
```json
{
  "scene_type": "dialogue",
  "environment": "modern office", 
  "subject": "business meeting",
  "camera_movement": "static",
  "lighting": "natural",
  "mood": "professional"
}
```

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles and theme variables
├── components/
│   ├── prompt-builder.tsx  # Main form component
│   ├── theme-provider.tsx  # Theme context provider
│   ├── theme-toggle.tsx    # Light/dark mode toggle
│   └── ui/                 # shadcn/ui component library
└── lib/
    └── utils.ts            # Utility functions
```

## 🧪 Development

### Scripts
- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality

### Code Quality
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Next.js recommended rules with TypeScript support
- **Component Pattern**: Functional components with React hooks
- **CSS Architecture**: Tailwind utility classes with CSS custom properties

## 🔮 Roadmap

### Phase 1: Foundation ✅
- [x] Color-coded provenance system
- [x] Dual output formats (JSON + Natural Language)
- [x] Professional UI with theme support
- [x] Type-safe implementation

### Phase 2: Enhancement 🚧
- [ ] Preset management system
- [ ] Advanced prompt templates
- [ ] Export/import functionality
- [ ] Prompt history and versioning

### Phase 3: Expansion 📋
- [ ] Additional AI model support (Midjourney, DALL-E, etc.)
- [ ] API integration for direct model calls
- [ ] Collaborative features
- [ ] Advanced analytics and optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the excellent React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

---

Built with ❤️ for the AI creative community
