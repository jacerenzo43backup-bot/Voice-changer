import { useState, useRef, useEffect, useCallback } from "react";
import { getReverbBuffer, makeDistortionCurve, audioBufferToWav } from "@/lib/audio-utils";

export type EffectParams = {
  pitch: number;      // 0.5 to 2.0
  delay: number;      // 0 to 1.0 (seconds)
  reverb: number;     // 0 to 1.0 (wet mix)
  distortion: number; // 0 to 100
  robot: boolean;     // Ring modulation toggle
};

export const PRESETS: Record<string, EffectParams> = {
  "Normal":     { pitch: 1.0, delay: 0.0,  reverb: 0.0, distortion: 0,  robot: false },
  "Chipmunk":   { pitch: 1.6, delay: 0.0,  reverb: 0.0, distortion: 0,  robot: false },
  "Deep":       { pitch: 0.6, delay: 0.0,  reverb: 0.1, distortion: 0,  robot: false },
  "Robot":      { pitch: 1.0, delay: 0.1,  reverb: 0.0, distortion: 30, robot: true  },
  "Echo":       { pitch: 1.0, delay: 0.4,  reverb: 0.2, distortion: 0,  robot: false },
  "Helium":     { pitch: 2.0, delay: 0.0,  reverb: 0.0, distortion: 0,  robot: false },
  "Cave":       { pitch: 0.8, delay: 0.1,  reverb: 1.0, distortion: 0,  robot: false },
  "Monster":    { pitch: 0.5, delay: 0.05, reverb: 0.3, distortion: 60, robot: false },
  "Alien":      { pitch: 1.8, delay: 0.05, reverb: 0.1, distortion: 10, robot: true  },
  "Ghost":      { pitch: 0.85,delay: 0.35, reverb: 0.9, distortion: 0,  robot: false },
  "Telephone":  { pitch: 1.1, delay: 0.0,  reverb: 0.0, distortion: 50, robot: false },
  "Underwater": { pitch: 0.75,delay: 0.15, reverb: 0.8, distortion: 5,  robot: false },
  "Demon":      { pitch: 0.55,delay: 0.08, reverb: 0.4, distortion: 80, robot: true  },
  "Choir":      { pitch: 1.05,delay: 0.25, reverb: 0.75,distortion: 0,  robot: false },
  "Whisper":    { pitch: 1.15,delay: 0.0,  reverb: 0.15,distortion: 8,  robot: false },

  // --- Language Accents ---
  "🇫🇷 French":   { pitch: 1.05,delay: 0.05, reverb: 0.2, distortion: 0,  robot: false },
  "🇷🇺 Russian":  { pitch: 0.72,delay: 0.0,  reverb: 0.3, distortion: 5,  robot: false },
  "🇬🇧 British":  { pitch: 1.08,delay: 0.0,  reverb: 0.1, distortion: 0,  robot: false },
  "🇯🇵 Japanese": { pitch: 1.18,delay: 0.0,  reverb: 0.05,distortion: 0,  robot: false },
  "🇪🇸 Spanish":  { pitch: 0.95,delay: 0.08, reverb: 0.25,distortion: 0,  robot: false },
  "🇮🇹 Italian":  { pitch: 1.02,delay: 0.12, reverb: 0.35,distortion: 0,  robot: false },
  "🇩🇪 German":   { pitch: 0.88,delay: 0.0,  reverb: 0.15,distortion: 10, robot: false },
  "🇧🇷 Brazilian":{ pitch: 1.0, delay: 0.1,  reverb: 0.3, distortion: 0,  robot: false },
  "🇮🇳 Indian":   { pitch: 0.92,delay: 0.05, reverb: 0.2, distortion: 3,  robot: false },
  "🇰🇷 Korean":   { pitch: 1.12,delay: 0.0,  reverb: 0.1, distortion: 0,  robot: false },

  // --- SpongeBob Characters ---
  "🧽 SpongeBob": { pitch: 1.45,delay: 0.0,  reverb: 0.05,distortion: 12, robot: false },
  "⭐ Patrick":   { pitch: 0.68,delay: 0.0,  reverb: 0.1, distortion: 4,  robot: false },
  "🦑 Squidward": { pitch: 0.92,delay: 0.0,  reverb: 0.2, distortion: 22, robot: false },
  "🦀 Mr. Krabs": { pitch: 0.76,delay: 0.0,  reverb: 0.1, distortion: 28, robot: false },
  "🐿️ Sandy":     { pitch: 1.12,delay: 0.0,  reverb: 0.1, distortion: 0,  robot: false },
  "👾 Plankton":  { pitch: 1.88,delay: 0.0,  reverb: 0.05,distortion: 8,  robot: false },
  "🐌 Gary":      { pitch: 0.85,delay: 0.15, reverb: 0.35,distortion: 15, robot: true  },
  "💪 Larry":     { pitch: 0.74,delay: 0.0,  reverb: 0.1, distortion: 6,  robot: false },

  // --- Funny & Famous ---
  "Darth":      { pitch: 0.52,delay: 0.05, reverb: 0.5, distortion: 20, robot: true  },
  "Mickey":     { pitch: 1.9, delay: 0.0,  reverb: 0.0, distortion: 5,  robot: false },
  "Gollum":     { pitch: 0.72,delay: 0.0,  reverb: 0.15,distortion: 35, robot: false },
  "Minion":     { pitch: 1.7, delay: 0.0,  reverb: 0.05,distortion: 12, robot: false },
  "Pirate":     { pitch: 0.78,delay: 0.12, reverb: 0.35,distortion: 25, robot: false },
  "Gangster":   { pitch: 0.82,delay: 0.08, reverb: 0.2, distortion: 15, robot: false },
  "Opera":      { pitch: 1.12,delay: 0.3,  reverb: 0.85,distortion: 0,  robot: false },
  "Announcer":  { pitch: 0.7, delay: 0.0,  reverb: 0.4, distortion: 0,  robot: false },
  "Baby":       { pitch: 1.95,delay: 0.0,  reverb: 0.05,distortion: 0,  robot: false },
  "Cartoon":    { pitch: 1.75,delay: 0.05, reverb: 0.0, distortion: 18, robot: false },
};

export function useVoiceChanger() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [params, setParams] = useState<EffectParams>(PRESETS["Normal"]);
  const [activePreset, setActivePreset] = useState<string>("Normal");
  const [error, setError] = useState<string | null>(null);

  // Audio Graph Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const liveAnalyserRef = useRef<AnalyserNode | null>(null);
  const playbackAnalyserRef = useRef<AnalyserNode | null>(null);
  
  // Reusable buffers
  const reverbBufferRef = useRef<AudioBuffer | null>(null);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      reverbBufferRef.current = getReverbBuffer(audioCtxRef.current);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const cleanupPlayback = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Update params and track active preset
  const handleSetParams = (newParams: Partial<EffectParams>, presetName?: string) => {
    setParams(prev => ({ ...prev, ...newParams }));
    if (presetName) {
      setActivePreset(presetName);
    } else {
      setActivePreset("Custom");
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      cleanupPlayback();
      setHasAudio(false);
      audioBufferRef.current = null;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const ctx = getAudioCtx();
      const liveSource = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      liveSource.connect(analyser);
      liveAnalyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const arrayBuffer = await blob.arrayBuffer();
          const decodedData = await ctx.decodeAudioData(arrayBuffer);
          audioBufferRef.current = decodedData;
          setHasAudio(true);
        } catch (err) {
          setError("Failed to decode recorded audio.");
          console.error(err);
        } finally {
          setIsProcessing(false);
          liveAnalyserRef.current = null;
          stream.getTracks().forEach(t => t.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied or not available.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Build the audio graph for both playback and offline rendering
  const buildAudioGraph = (ctx: BaseAudioContext, buffer: AudioBuffer, currentParams: EffectParams) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = currentParams.pitch;

    // Output node before destination/analyser
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.8; // Headroom

    let currentNode: AudioNode = source;

    // 1. Distortion
    if (currentParams.distortion > 0) {
      const distortion = ctx.createWaveShaper();
      distortion.curve = makeDistortionCurve(currentParams.distortion);
      distortion.oversample = '4x';
      currentNode.connect(distortion);
      currentNode = distortion;
    }

    // 2. Robot (Ring Modulation)
    if (currentParams.robot) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = 50;
      
      const ringGain = ctx.createGain();
      ringGain.gain.value = 0; // The signal passes through the gain parameter modulation
      
      currentNode.connect(ringGain);
      osc.connect(ringGain.gain);
      osc.start();
      
      // Keep reference to osc if we were doing live playback so we could stop it, 
      // but source stop usually suffices, or offline context stops automatically.
      currentNode = ringGain;
    }

    // Routing dry signal to master
    currentNode.connect(masterGain);

    // 3. Delay Path (Parallel)
    if (currentParams.delay > 0) {
      const delayNode = ctx.createDelay(2.0); // max 2s
      delayNode.delayTime.value = currentParams.delay;
      
      const feedback = ctx.createGain();
      feedback.gain.value = 0.5; // Fixed feedback for simplicity
      
      currentNode.connect(delayNode);
      delayNode.connect(feedback);
      feedback.connect(delayNode);
      
      delayNode.connect(masterGain);
    }

    // 4. Reverb Path (Parallel)
    if (currentParams.reverb > 0 && reverbBufferRef.current) {
      const convolver = ctx.createConvolver();
      convolver.buffer = reverbBufferRef.current;
      
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = currentParams.reverb;
      
      currentNode.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(masterGain);
    }

    return { source, masterGain };
  };

  const play = () => {
    if (!audioBufferRef.current || isRecording) return;
    
    cleanupPlayback();
    const ctx = getAudioCtx();
    
    const { source, masterGain } = buildAudioGraph(ctx, audioBufferRef.current, params);
    
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);
    
    playbackAnalyserRef.current = analyser;
    sourceNodeRef.current = source;
    
    source.onended = () => {
      setIsPlaying(false);
      playbackAnalyserRef.current = null;
    };
    
    source.start(0);
    setIsPlaying(true);
  };

  const stop = () => {
    cleanupPlayback();
  };

  const download = async () => {
    if (!audioBufferRef.current) return;
    setIsProcessing(true);
    try {
      const buffer = audioBufferRef.current;
      const offlineCtx = new OfflineAudioContext(
        buffer.numberOfChannels,
        buffer.length * (params.pitch < 1 ? 1/params.pitch + 1 : 1.5), // pad length for delay/reverb tails
        buffer.sampleRate
      );
      
      if (!reverbBufferRef.current) {
        reverbBufferRef.current = getReverbBuffer(offlineCtx);
      }

      const { source, masterGain } = buildAudioGraph(offlineCtx, buffer, params);
      masterGain.connect(offlineCtx.destination);
      
      source.start(0);
      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(renderedBuffer);
      
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-voice-${activePreset.toLowerCase()}-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to render audio for download.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanupPlayback();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [cleanupPlayback]);

  // Return the active analyser for visualization
  const getActiveAnalyser = () => {
    return isRecording ? liveAnalyserRef.current : playbackAnalyserRef.current;
  };

  return {
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
    setParams: handleSetParams,
    getActiveAnalyser,
  };
}
