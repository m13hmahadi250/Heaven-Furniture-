/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, Music2, Sliders, ChevronDown } from 'lucide-react';
import { luxuryAudio, AudioMode } from '../utils/audioEngine';

interface SpatialAudioControlProps {
  variant?: 'floating' | 'navbar';
}

export function SpatialAudioControl({ variant = 'floating' }: SpatialAudioControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<AudioMode>('lofi-jazz');
  const [volume, setVolume] = useState(0.35);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = luxuryAudio.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setMode(state.mode);
      setVolume(state.volume);
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await luxuryAudio.toggle();
  };

  const handleModeChange = (newMode: AudioMode) => {
    luxuryAudio.setMode(newMode);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    luxuryAudio.setVolume(val);
  };

  if (variant === 'navbar') {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
            isPlaying
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20'
              : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/25'
          }`}
          title={isPlaying ? 'Pause Spatial Showroom Audio' : 'Play Spatial Showroom Audio'}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 pb-0.5">
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-[bounce_1.2s_infinite_ease-in-out]" style={{ height: '70%' }} />
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-[bounce_0.8s_infinite_ease-in-out_0.2s]" style={{ height: '100%' }} />
              <span className="w-[2.5px] bg-amber-400 rounded-full animate-[bounce_1.1s_infinite_ease-in-out_0.4s]" style={{ height: '50%' }} />
            </div>
          ) : (
            <Music2 className="w-3.5 h-3.5 text-zinc-400" />
          )}

          <span className="text-[11px] uppercase tracking-wider font-semibold">
            {isPlaying ? (mode === 'lofi-jazz' ? 'Lo-Fi Jazz' : 'Ambient') : 'Spatial Sound'}
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="text-zinc-400 hover:text-white p-0.5"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </span>
        </button>

        {/* Dropdown controls menu */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl z-50 text-left space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Spatial Showroom Audio</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                3D Reverb
              </span>
            </div>

            {/* Soundscape presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                Soundscape Preset
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleModeChange('lofi-jazz')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                    mode === 'lofi-jazz'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[11px] font-bold">Lo-Fi Jazz</div>
                  <div className={`text-[9px] ${mode === 'lofi-jazz' ? 'text-black/80' : 'text-zinc-500'}`}>
                    Warm Rhodes & Vinyl
                  </div>
                </button>

                <button
                  onClick={() => handleModeChange('showroom-ambient')}
                  className={`px-2.5 py-2 rounded-xl text-xs font-medium text-left transition-all border ${
                    mode === 'showroom-ambient'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <div className="text-[11px] font-bold">Salon Ambient</div>
                  <div className={`text-[9px] ${mode === 'showroom-ambient' ? 'text-black/80' : 'text-zinc-500'}`}>
                    Acoustic Reverberation
                  </div>
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Volume</span>
                <span className="text-[10px] font-mono text-zinc-300">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => luxuryAudio.setVolume(volume > 0 ? 0 : 0.35)}
                  className="text-zinc-400 hover:text-white"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Floating variant (Lower left corner: unobtrusive, luxury aesthetic)
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="relative">
        {/* Expanded Floating Modal / Popover */}
        {isExpanded && (
          <div className="mb-3 w-80 p-5 rounded-3xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl text-left space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Showroom Spatial Sound</h4>
                  <p className="text-[10px] text-zinc-400">Bespoke 3D Architectural Acoustic Room</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-white/5"
              >
                Close
              </button>
            </div>

            {/* Presets Selection */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                Select Atmosphere
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleModeChange('lofi-jazz')}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    mode === 'lofi-jazz'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Music2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Lo-Fi Jazz</span>
                  </div>
                  <span className={`text-[10px] block leading-tight ${mode === 'lofi-jazz' ? 'text-black/80' : 'text-zinc-400'}`}>
                    Vintage Rhodes piano, soft bass & vinyl warmth
                  </span>
                </button>

                <button
                  onClick={() => handleModeChange('showroom-ambient')}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    mode === 'showroom-ambient'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Radio className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Salon Ambient</span>
                  </div>
                  <span className={`text-[10px] block leading-tight ${mode === 'showroom-ambient' ? 'text-black/80' : 'text-zinc-400'}`}>
                    Airy spatial resonance & teak room acoustics
                  </span>
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Master Volume</span>
                <span className="text-xs font-mono font-medium text-amber-400">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => luxuryAudio.setVolume(volume > 0 ? 0 : 0.35)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Status Footer */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
                {isPlaying ? 'Live Audio Stream Active' : 'Sound Paused'}
              </span>
              <span>Agrabad Acoustic Studio</span>
            </div>
          </div>
        )}

        {/* Floating Pill Toggle Button */}
        <div className="flex items-center bg-zinc-950/85 backdrop-blur-xl border border-white/15 rounded-full p-1.5 shadow-2xl hover:border-amber-500/50 transition-all">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
            title={isPlaying ? 'Pause Showroom Music' : 'Start Showroom Spatial Audio'}
          >
            {isPlaying ? (
              <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 pb-0.5">
                <span className="w-[2.5px] bg-black rounded-full animate-[bounce_1.2s_infinite_ease-in-out]" style={{ height: '70%' }} />
                <span className="w-[2.5px] bg-black rounded-full animate-[bounce_0.8s_infinite_ease-in-out_0.2s]" style={{ height: '100%' }} />
                <span className="w-[2.5px] bg-black rounded-full animate-[bounce_1.1s_infinite_ease-in-out_0.4s]" style={{ height: '50%' }} />
              </div>
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span className="tracking-wide">
              {isPlaying ? (mode === 'lofi-jazz' ? 'Lo-Fi Jazz Playing' : 'Salon Ambience') : 'Showroom Sound'}
            </span>
          </button>

          {/* Quick Sound Settings / Presets Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Audio Atmosphere Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
