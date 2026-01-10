import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, CloudRain, Wind, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

const sounds = [
    {
        id: 'rain',
        name: 'Rainy Mood',
        icon: <CloudRain className="w-5 h-5" />,
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        url: 'https://assets.mixkit.co/active_storage/sfx/2492/2492-preview.mp3' // Rain sample
    },
    {
        id: 'space',
        name: 'Space Drift',
        icon: <Radio className="w-5 h-5" />,
        color: 'text-purple-400',
        bg: 'bg-purple-500/20',
        url: 'https://assets.mixkit.co/active_storage/sfx/244/244-preview.mp3' // Drone sample
    },
    {
        id: 'white',
        name: 'White Noise',
        icon: <Wind className="w-5 h-5" />,
        color: 'text-gray-400',
        bg: 'bg-gray-500/20',
        url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' // Wind sample
    }
];

const AmbientPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef(new Audio(sounds[0].url));

    const currentSound = sounds[currentSoundIndex];

    useEffect(() => {
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        // Update source when index changes
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.src = currentSound.url;
        if (wasPlaying) audioRef.current.play();

        return () => {
            audioRef.current.pause();
        };
    }, [currentSoundIndex]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const nextSound = () => {
        setCurrentSoundIndex((prev) => (prev + 1) % sounds.length);
    };

    return (
        <div className="bg-terminal-dim/30 border border-terminal-accent/10 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentSound.bg} ${currentSound.color}`}>
                        {currentSound.icon}
                    </div>
                    <div>
                        <h3 className="text-terminal-accent font-medium text-sm">{currentSound.name}</h3>
                        <p className="text-xs text-terminal-accent/60">Ambient Sound</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-terminal-accent/10 hover:bg-terminal-accent/20 flex items-center justify-center text-terminal-accent transition-colors"
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <button
                        onClick={nextSound}
                        className="w-8 h-8 rounded-full hover:bg-terminal-accent/10 flex items-center justify-center text-terminal-accent/60 hover:text-terminal-accent transition-colors"
                    >
                        <SkipForward className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-terminal-accent/50" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-terminal-accent/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-terminal-accent"
                />
            </div>
        </div>
    );
};

export default AmbientPlayer;
