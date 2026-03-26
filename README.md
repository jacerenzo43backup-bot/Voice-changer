# 🎤 Nexus Voice Changer

A fully client-side voice changer app built with React + Vite and the Web Audio API. Record your voice and apply 40+ audio effects including SpongeBob characters, language accents, famous voices, and more — all running in your browser with no backend required.

## Features

- **Record** your voice with live waveform visualizer
- **40+ voice presets** across categories:
  - Classic effects (Chipmunk, Deep, Robot, Echo, Helium, Cave...)
  - SpongeBob characters (SpongeBob, Patrick, Squidward, Mr. Krabs, Sandy, Plankton, Gary, Larry)
  - Language accents (French 🇫🇷, Russian 🇷🇺, British 🇬🇧, Japanese 🇯🇵, Spanish 🇪🇸, Italian 🇮🇹, German 🇩🇪, Brazilian 🇧🇷, Indian 🇮🇳, Korean 🇰🇷)
  - Funny & Famous (Darth Vader, Mickey Mouse, Gollum, Minion, Pirate, Gangster, Opera, Baby...)
- **Manual controls** — fine-tune pitch, reverb, delay, and distortion yourself
- **Download** your processed audio as a WAV file
- **Animated oscilloscope** waveform using Canvas + Web Audio AnalyserNode

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Web Audio API (no backend, no AI — pure browser audio processing)

## Getting Started

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## How It Works

Voice effects are applied using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API):

- **Pitch** — `AudioBufferSourceNode.playbackRate`
- **Echo** — `DelayNode` with feedback loop
- **Reverb** — `ConvolverNode` with a synthetic impulse response
- **Distortion** — `WaveShaperNode` with a custom distortion curve
- **Robot** — Ring modulation via `OscillatorNode` → `GainNode.gain`

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. You can host it on any static file server (GitHub Pages, Netlify, Vercel, etc.).

## Deploy to GitHub Pages

```bash
npm run build
# then push the dist/ folder to your gh-pages branch
```

Or use [Vite's GitHub Pages guide](https://vitejs.dev/guide/static-deploy.html#github-pages).

## License

MIT
