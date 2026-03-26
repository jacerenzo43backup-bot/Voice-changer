import React from 'react';
import { useVoiceChanger, PRESETS } from '@/hooks/use-voice-changer';
import { Visualizer } from '@/components/Visualizer';
import { ControlSlider } from '@/components/ControlSlider';
import { PresetButton } from '@/components/PresetButton';
import { 
  Mic, Square, Play, Download, Settings2, Activity, 
  Sparkles, AudioWaveform, Bot, Repeat, ArrowUpCircle, 
  Mountain, AlertCircle, Loader2, Skull, Phone, Waves,
  Flame, Music2, Wind, Ghost, Swords, Star, Eye,
  Smile, Anchor, Crown, Mic2, Megaphone, Heart, Laugh
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_ICONS: Record<string, React.ReactNode> = {
  "Normal":     <Activity size={24} />,
  "Chipmunk":   <Sparkles size={24} />,
  "Deep":       <AudioWaveform size={24} />,
  "Robot":      <Bot size={24} />,
  "Echo":       <Repeat size={24} />,
  "Helium":     <ArrowUpCircle size={24} />,
  "Cave":       <Mountain size={24} />,
  "Monster":    <Skull size={24} />,
  "Alien":      <Waves size={24} />,
  "Ghost":      <Ghost size={24} />,
  "Telephone":  <Phone size={24} />,
  "Underwater": <Waves size={24} />,
  "Demon":      <Flame size={24} />,
  "Choir":      <Music2 size={24} />,
  "Whisper":    <Wind size={24} />,

  "🧽 SpongeBob": <span className="text-2xl leading-none">🧽</span>,
  "⭐ Patrick":   <span className="text-2xl leading-none">⭐</span>,
  "🦑 Squidward": <span className="text-2xl leading-none">🦑</span>,
  "🦀 Mr. Krabs": <span className="text-2xl leading-none">🦀</span>,
  "🐿️ Sandy":     <span className="text-2xl leading-none">🐿️</span>,
  "👾 Plankton":  <span className="text-2xl leading-none">👾</span>,
  "🐌 Gary":      <span className="text-2xl leading-none">🐌</span>,
  "💪 Larry":     <span className="text-2xl leading-none">💪</span>,

  "🇫🇷 French":   <span className="text-2xl leading-none">🇫🇷</span>,
  "🇷🇺 Russian":  <span className="text-2xl leading-none">🇷🇺</span>,
  "🇬🇧 British":  <span className="text-2xl leading-none">🇬🇧</span>,
  "🇯🇵 Japanese": <span className="text-2xl leading-none">🇯🇵</span>,
  "🇪🇸 Spanish":  <span className="text-2xl leading-none">🇪🇸</span>,
  "🇮🇹 Italian":  <span className="text-2xl leading-none">🇮🇹</span>,
  "🇩🇪 German":   <span className="text-2xl leading-none">🇩🇪</span>,
  "🇧🇷 Brazilian":<span className="text-2xl leading-none">🇧🇷</span>,
  "🇮🇳 Indian":   <span className="text-2xl leading-none">🇮🇳</span>,
  "🇰🇷 Korean":   <span className="text-2xl leading-none">🇰🇷</span>,

  "Darth":      <Swords size={24} />,
  "Mickey":     <Star size={24} />,
  "Gollum":     <Eye size={24} />,
  "Minion":     <Smile size={24} />,
  "Pirate":     <Anchor size={24} />,
  "Gangster":   <Crown size={24} />,
  "Opera":      <Mic2 size={24} />,
  "Announcer":  <Megaphone size={24} />,
  "Baby":       <Heart size={24} />,
  "Cartoon":    <Laugh size={24} />,
};

export default function Home() {
  const {
    isRecording,
    isPlaying,
    isProcessing,
    hasAudio,
    params,
    activePreset,
    error,
    startRecording,
    stopRecording,
    play,
    stop,
    download,
    setParams,
    getActiveAnalyser
  } = useVoiceChanger();

  return (
    <div className="min-h-screen relative selection:bg-primary/30">
      {/* Background Image injected via CSS in requirement, but we can also place it here */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/cyber-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white text-glow mb-2">
              NEXUS <span className="text-primary">VOICE</span>
            </h1>
            <p className="text-muted-foreground font-display tracking-widest text-sm">
              NEURAL AUDIO PROCESSING SYSTEM v1.0
            </p>
          </div>
          
          <div className="flex items-center gap-3 glass-panel px-6 py-3 rounded-full">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]' : isPlaying ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]' : 'bg-muted'}`} />
            <span className="font-display text-sm tracking-widest text-muted-foreground">
              {isRecording ? "RECORDING..." : isPlaying ? "PLAYING..." : hasAudio ? "READY" : "STANDBY"}
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/50 text-destructive flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Visualizer & Core Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-1 rounded-2xl">
              <Visualizer 
                getAnalyser={getActiveAnalyser} 
                isActive={isRecording || isPlaying} 
                className="h-64 sm:h-80"
                color={isRecording ? '#ff3366' : '#00f3ff'}
              />
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-6">
              
              {/* Record Button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isPlaying || isProcessing}
                className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording 
                    ? 'bg-destructive text-white shadow-[0_0_30px_rgba(255,51,102,0.6)]' 
                    : 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] hover:scale-105'
                }`}
              >
                {/* Ping rings for recording */}
                {isRecording && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-destructive opacity-40"></span>
                )}
                
                {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={40} />}
              </button>
              
              <p className="font-display text-sm tracking-widest text-muted-foreground uppercase text-center max-w-[200px]">
                {isRecording ? "Tap to Stop" : "Press to Record Voice"}
              </p>

              {/* Playback Controls */}
              <AnimatePresence>
                {hasAudio && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="w-full flex gap-4 pt-4 border-t border-white/5"
                  >
                    <button
                      onClick={isPlaying ? stop : play}
                      disabled={isRecording || isProcessing}
                      className="flex-1 flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-white py-4 rounded-xl font-display tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {isPlaying ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                      {isPlaying ? "STOP" : "PLAY"}
                    </button>
                    
                    <button
                      onClick={download}
                      disabled={isRecording || isPlaying || isProcessing}
                      className="flex items-center justify-center gap-2 bg-card border border-white/10 hover:bg-primary/20 hover:border-primary/50 hover:text-primary text-white px-6 rounded-xl font-display tracking-widest transition-all disabled:opacity-50 group"
                    >
                      {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} className="group-hover:-translate-y-1 transition-transform" />}
                      SAVE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Effects & Tweaks */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Presets */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <Settings2 className="text-primary" />
                NEURAL PRESETS
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(PRESETS).map(([name, presetParams]) => (
                  <PresetButton
                    key={name}
                    name={name}
                    icon={PRESET_ICONS[name] || <Activity size={24} />}
                    isActive={activePreset === name}
                    onClick={() => setParams(presetParams, name)}
                  />
                ))}
              </div>
            </div>

            {/* Manual Controls */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <Activity className="text-accent" />
                  MANUAL OVERRIDE
                </h2>
                {activePreset === 'Custom' && (
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-display tracking-widest border border-accent/50">
                    CUSTOM
                  </span>
                )}
              </div>
              
              <div className="space-y-8">
                <ControlSlider
                  label="Frequency Pitch"
                  value={params.pitch}
                  min={0.5}
                  max={2.0}
                  step={0.05}
                  onChange={(v) => setParams({ pitch: v })}
                  formatValue={(v) => `${v.toFixed(2)}x`}
                />
                
                <ControlSlider
                  label="Space Reverb"
                  value={params.reverb}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => setParams({ reverb: v })}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
                
                <ControlSlider
                  label="Temporal Delay"
                  value={params.delay}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(v) => setParams({ delay: v })}
                  formatValue={(v) => `${v.toFixed(2)}s`}
                />
                
                <ControlSlider
                  label="Wave Distortion"
                  value={params.distortion}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(v) => setParams({ distortion: v })}
                  formatValue={(v) => `${Math.round(v)}%`}
                />

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-medium text-sm text-muted-foreground tracking-widest uppercase">
                    Ring Modulation (Robot)
                  </span>
                  <button
                    onClick={() => setParams({ robot: !params.robot })}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none ${params.robot ? 'bg-primary' : 'bg-secondary'}`}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-white rounded-full shadow-md"
                      animate={{ x: params.robot ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
