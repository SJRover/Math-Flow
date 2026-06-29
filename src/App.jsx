import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, ChevronLeft, RotateCcw, Volume2, VolumeX, SkipForward, Star, Lock, LayoutGrid, Award, CheckSquare, Activity, FastForward, Infinity, X, Zap, Check, ArrowRight, Lightbulb, Settings as SettingsIcon, Smartphone, RotateCcw as ResetIcon, ShoppingCart } from 'lucide-react';
import Confetti from 'react-confetti';
import { generateLevel } from './LevelGenerator';
import { MathFactDB, rollGacha } from './MathFactDB';
import './index.css';

const COLORS = {
  1: 'var(--c1)', 2: 'var(--c2)', 3: 'var(--c3)', 4: 'var(--c4)', 5: 'var(--c5)',
  6: 'var(--c6)', 7: 'var(--c7)', 8: 'var(--c8)', 9: 'var(--c9)', 10: 'var(--c10)'
};

const RARITY_COLORS = {
  'Common': '#86868b',
  'Rare': '#007aff',
  'Epic': '#af52de',
  'Legendary': '#ffcc00'
};

const getXPTitle = (score) => {
    if (score < 1000) return "Lvl 1: Math Apprentice";
    if (score < 3000) return "Lvl 2: Number Ninja";
    if (score < 6000) return "Lvl 3: Algebra Adept";
    if (score < 10000) return "Lvl 4: Geometry Wizard";
    if (score < 20000) return "Lvl 5: Calculus Master";
    return "Lvl MAX: Quantum Deity";
};

// --- AUDIO & HAPTICS SYSTEM ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

// Global settings flags for outside-React functions
window.appSettings = {
    sfxVolume: 0.5,
    hapticsEnabled: true
};

const triggerHaptic = (pattern) => {
    if (window.appSettings.hapticsEnabled && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

const playTone = (freq, type = 'sine', duration = 0.1) => {
    if (!audioCtx) {
        try { audioCtx = new AudioContext(); } catch(e) { return; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(window.appSettings.sfxVolume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

const playPop = () => { playTone(440, 'sine', 0.1); triggerHaptic(10); };
const playSnap = () => { playTone(880, 'sine', 0.15); triggerHaptic(30); };
const playError = () => { playTone(200, 'sine', 0.2); triggerHaptic([50, 50, 50]); };
const playGlitch = () => { playTone(150, 'sawtooth', 0.2); setTimeout(() => playTone(100, 'sawtooth', 0.3), 50); triggerHaptic([50, 50, 50]); };
const playPowerup = () => { playTone(600, 'triangle', 0.1); setTimeout(() => playTone(800, 'triangle', 0.15), 100); triggerHaptic([30, 50]); };
const playWin = () => {
    playTone(440, 'sine', 0.1);
    setTimeout(() => playTone(554, 'sine', 0.1), 100);
    setTimeout(() => playTone(659, 'sine', 0.3), 200);
    triggerHaptic([30, 50, 100]);
};
const playPerfect = () => {
    playTone(523.25, 'sine', 0.1);
    setTimeout(() => playTone(659.25, 'sine', 0.1), 100);
    setTimeout(() => playTone(783.99, 'sine', 0.1), 200);
    setTimeout(() => playTone(1046.50, 'sine', 0.4), 300);
    triggerHaptic([30, 30, 30, 100]);
};
const playGacha = () => {
    playTone(600, 'triangle', 0.1);
    setTimeout(() => playTone(800, 'triangle', 0.1), 100);
    setTimeout(() => playTone(1200, 'triangle', 0.4), 200);
    triggerHaptic([50, 50, 100]);
}

// --- BGM PLAYLIST SYSTEM ---
const PLAYLIST = [
    '/music/MathFLowMusic1.mp3',
    '/music/MathFLowMusic2.mp3',
    '/music/MathFLowMusic3.mp3',
    '/music/MathFLowMusic4.mp3'
];

// --- COMPONENTS ---

const MainMenu = ({ setScreen, setDifficulty, isMuted, toggleMute, skipTrack, arcadeHighScore, globalScore }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="screen-container" style={{justifyContent: 'center', alignItems: 'center', padding: '2rem'}}>
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn-secondary" onClick={() => setScreen('SETTINGS')} style={{padding: '0.5rem', borderRadius: '50%'}}>
            <SettingsIcon size={24} />
        </button>
    </div>
    <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="btn-secondary" onClick={toggleMute} style={{padding: '0.5rem', borderRadius: '50%'}}>
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        <button className="btn-secondary" onClick={skipTrack} style={{padding: '0.5rem', borderRadius: '50%'}}>
            <SkipForward size={24} />
        </button>
    </div>
    
    <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} style={{ fontSize: '3rem', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--primary)' }}>
      MATH FLOW
    </motion.h1>
    
    <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--c4)'}}>{getXPTitle(globalScore)}</div>
        <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Total XP: {globalScore}</div>
    </div>

    <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <button className="btn-primary" onClick={() => { setScreen('ARCADE'); }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--c5)', border: 'none'}}>
        <Zap size={20} /> Arcade Mode 
      </button>
      {arcadeHighScore > 0 && <div style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--c5)', marginTop: '-0.5rem', fontWeight: 'bold'}}>High Score: {arcadeHighScore}</div>}

      <div style={{height: '1rem'}}></div>

      <button className="btn-secondary" onClick={() => { setDifficulty('EASY'); setScreen('LEVEL_SELECT'); }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--c3)', color: 'white'}}>
        <CheckSquare size={20} /> Easy
      </button>
      <button className="btn-secondary" onClick={() => { setDifficulty('MEDIUM'); setScreen('LEVEL_SELECT'); }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--c4)', color: 'black'}}>
        <Activity size={20} /> Medium
      </button>
      <button className="btn-secondary" onClick={() => { setDifficulty('HARD'); setScreen('LEVEL_SELECT'); }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--c1)', color: 'white'}}>
        <FastForward size={20} /> Hard+
      </button>
      
      <button className="btn-secondary" onClick={() => setScreen('COLLECTION')} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem'}}>
        <Award size={20} /> Math Facts Gallery
      </button>

      <button className="btn-secondary" onClick={() => setScreen('TUTORIAL')} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
        <BookOpen size={20} /> How to Play
      </button>
    </div>
  </motion.div>
);

const SettingsScreen = ({ setScreen, sfxVolume, setSfxVolume, bgmVolume, setBgmVolume, hapticsEnabled, setHapticsEnabled, hardReset }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="screen-container">
            <div className="header">
                <button className="btn-secondary" onClick={() => setScreen('MENU')} style={{padding: '0.5rem'}}><ChevronLeft size={24} /></button>
                <h2>Settings</h2>
                <div style={{width: 40}}></div>
            </div>
            
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, overflowY: 'auto' }}>
                <div style={{background: '#f5f5f7', padding: '1.5rem', borderRadius: '16px'}}>
                    <h3 style={{marginBottom: '1rem', color: 'var(--primary)'}}>Audio & Haptics</h3>
                    
                    <div style={{marginBottom: '1.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                            <strong>SFX Volume</strong>
                            <span>{Math.round(sfxVolume * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" value={sfxVolume} onChange={e => setSfxVolume(parseFloat(e.target.value))} style={{width: '100%'}} />
                    </div>

                    <div style={{marginBottom: '1.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                            <strong>Music Volume</strong>
                            <span>{Math.round(bgmVolume * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="1" step="0.1" value={bgmVolume} onChange={e => setBgmVolume(parseFloat(e.target.value))} style={{width: '100%'}} />
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0e0e0', paddingTop: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <Smartphone size={20} />
                            <strong>Haptic Feedback</strong>
                        </div>
                        <button 
                            onClick={() => { setHapticsEnabled(!hapticsEnabled); triggerHaptic(30); }}
                            style={{
                                background: hapticsEnabled ? 'var(--c3)' : '#ccc',
                                border: 'none', padding: '0.5rem 1.5rem', borderRadius: '20px', color: 'white', fontWeight: 'bold'
                            }}
                        >
                            {hapticsEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                <div style={{background: '#ffebee', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--c1)'}}>
                    <h3 style={{marginBottom: '1rem', color: 'var(--c1)'}}>Danger Zone</h3>
                    <p style={{fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                        This will delete all your stars, high scores, unlocked facts, and level progress. This action cannot be undone.
                    </p>
                    <button 
                        className="btn-primary" 
                        style={{background: 'var(--c1)', margin: 0}}
                        onClick={() => {
                            if (window.confirm("Are you absolutely sure you want to wipe all your data?")) {
                                hardReset();
                                setScreen('MENU');
                            }
                        }}
                    >
                        <ResetIcon size={18} style={{marginRight: '0.5rem', display: 'inline'}} /> Erase All Progress
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const LevelSelect = ({ setScreen, difficulty, setLevel, maxUnlockedLevel, levelStars }) => {
    const maxLvl = maxUnlockedLevel[difficulty] || 1;
    const stars = levelStars[difficulty] || [];

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="screen-container">
            <div className="header">
                <button className="btn-secondary" onClick={() => setScreen('MENU')} style={{padding: '0.5rem'}}><ChevronLeft size={24} /></button>
                <h2>{difficulty} Levels</h2>
                <div style={{width: 40}}></div>
            </div>
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', overflowY: 'auto' }}>
                {Array.from({length: Math.max(20, maxLvl + 4)}).map((_, i) => {
                    const lvl = i + 1;
                    const isUnlocked = lvl <= maxLvl;
                    const isCompleted = lvl < maxLvl || stars.includes(lvl);
                    const hasStar = stars.includes(lvl);
                    return (
                        <button 
                            key={lvl}
                            onClick={() => { if(isUnlocked){ setLevel(lvl); setScreen('GAME'); } }}
                            className={isUnlocked ? "btn-secondary" : ""}
                            style={{ 
                                padding: '1rem 0', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                background: isUnlocked ? undefined : '#f5f5f7',
                                border: isUnlocked ? undefined : '1px solid #e0e0e0',
                                color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)'
                            }}
                        >
                            {isUnlocked ? (
                                <span style={{fontWeight: 'bold'}}>{lvl}</span>
                            ) : <Lock size={20} />}
                            
                            {hasStar ? (
                                <Star size={16} fill="var(--c4)" color="var(--c4)" />
                            ) : isCompleted ? (
                                <Check size={16} color="var(--c3)" strokeWidth={3} />
                            ) : (
                                isUnlocked && <div style={{width: 16, height: 16}}></div>
                            )}
                        </button>
                    )
                })}
            </div>
        </motion.div>
    );
};

const CollectionScreen = ({ setScreen, stars, setStars, globalScore, setGlobalScore, collection, setCollection }) => {
    const [rolling, setRolling] = useState(false);
    const [newDrop, setNewDrop] = useState(null);
    const [activeFact, setActiveFact] = useState(null);
    
    // Quiz state
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const executeRoll = () => {
        setRolling(true);
        setNewDrop(null);
        
        playGacha();
        setTimeout(() => {
            const drop = rollGacha(collection);
            if (drop) {
                setNewDrop(drop);
                if (!collection.includes(drop.id)) {
                    setCollection(prev => [...prev, drop.id]);
                }
            } else {
                setNewDrop({ title: 'Collection Complete!', rarity: 'Legendary' });
            }
            setRolling(false);
        }, 800);
    };

    const handleRollStar = () => {
        if (stars < 1 || rolling) return;
        setStars(s => s - 1);
        executeRoll();
    };

    const handleRollXP = () => {
        if (globalScore < 1000 || rolling) return;
        setGlobalScore(s => s - 1000);
        executeRoll();
    };

    const handleFactClick = (fact) => {
        setActiveFact(fact);
        setCurrentQuizIndex(Math.floor(Math.random() * fact.quizzes.length));
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const nextQuiz = () => {
        if (!activeFact) return;
        setCurrentQuizIndex(prev => (prev + 1) % activeFact.quizzes.length);
        setSelectedAnswer(null);
        setShowExplanation(false);
    };

    const handleQuizAnswer = (index) => {
        if (showExplanation) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        const activeQuiz = activeFact.quizzes[currentQuizIndex];
        if (index === activeQuiz.correctAnswerIndex) {
            playPerfect();
        } else {
            playError();
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="screen-container">
            <div className="header">
                <button className="btn-secondary" onClick={() => setScreen('MENU')} style={{padding: '0.5rem'}}><ChevronLeft size={24} /></button>
                <h2>Collection</h2>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold'}}>
                    <span style={{color: 'var(--c4)'}}>XP: {globalScore}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
                        {stars} <Star size={18} fill="var(--c4)" color="var(--c4)" />
                    </span>
                </div>
            </div>
            
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', position: 'relative' }}>
                <div style={{ background: '#f5f5f7', padding: '1.5rem', borderRadius: '16px', textAlign: 'center', position: 'relative' }}>
                    <p style={{marginBottom: '1rem'}}>Decrypt a random Math Fact!</p>
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                        <button className="btn-primary" onClick={handleRollXP} disabled={globalScore < 1000 || rolling} style={{margin: 0, opacity: globalScore < 1000 ? 0.5 : 1, background: 'var(--c5)', border: 'none'}}>
                            {rolling ? '...' : '1,000 XP'}
                        </button>
                        <button className="btn-primary" onClick={handleRollStar} disabled={stars < 1 || rolling} style={{margin: 0, opacity: stars < 1 ? 0.5 : 1}}>
                            {rolling ? '...' : '1 Star ⭐'}
                        </button>
                    </div>
                    
                    {newDrop && (
                        <motion.div initial={{scale: 0.8, opacity: 0}} animate={{scale: 1, opacity: 1}} style={{marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '12px', border: `2px solid ${RARITY_COLORS[newDrop.rarity]}`}}>
                            <h3 style={{color: RARITY_COLORS[newDrop.rarity]}}>{newDrop.rarity} Drop!</h3>
                            <p style={{fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0'}}>{newDrop.title}</p>
                        </motion.div>
                    )}
                </div>

                <h3>Your Database ({collection.length}/{MathFactDB.length})</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {MathFactDB.map(fact => {
                        const unlocked = collection.includes(fact.id);
                        return (
                            <div key={fact.id} 
                                onClick={() => unlocked && handleFactClick(fact)}
                                style={{ 
                                padding: '1rem', 
                                border: `1px solid ${unlocked ? RARITY_COLORS[fact.rarity] : '#e0e0e0'}`, 
                                borderRadius: '12px',
                                background: unlocked ? 'white' : '#fafafa',
                                opacity: unlocked ? 1 : 0.6,
                                cursor: unlocked ? 'pointer' : 'default',
                                position: 'relative'
                            }}>
                                {unlocked ? (
                                    <>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                            <span style={{fontWeight: 'bold'}}>{fact.title}</span>
                                            <span style={{fontSize: '0.8rem', color: RARITY_COLORS[fact.rarity], fontWeight: 'bold'}}>{fact.rarity}</span>
                                        </div>
                                        <div style={{background: '#f5f5f7', padding: '0.5rem', borderRadius: '8px', fontFamily: 'monospace', textAlign: 'center'}}>
                                            {fact.equation}
                                        </div>
                                        <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic', textAlign: 'center'}}>
                                            Tap to view & take quizzes!
                                        </div>
                                    </>
                                ) : (
                                    <div style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                                        <Lock size={20} style={{margin: '0 auto 0.5rem auto'}} />
                                        <span>Unknown Fact</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* FACT MODAL WITH MULTIPLE QUIZZES */}
            <AnimatePresence>
                {activeFact && (
                    <motion.div 
                        initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'}}
                        onClick={() => setActiveFact(null)}
                    >
                        <motion.div 
                            initial={{scale: 0.9, y: 20}} animate={{scale: 1, y: 0}} exit={{scale: 0.9, y: 20}}
                            onClick={e => e.stopPropagation()}
                            style={{background: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px', maxHeight: '90%', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}
                        >
                            <div style={{padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa'}}>
                                <div>
                                    <h3 style={{margin: 0}}>{activeFact.title}</h3>
                                    <span style={{fontSize: '0.8rem', color: RARITY_COLORS[activeFact.rarity], fontWeight: 'bold'}}>{activeFact.rarity} | {activeFact.author}</span>
                                </div>
                                <button onClick={() => setActiveFact(null)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X size={24} /></button>
                            </div>
                            <div style={{padding: '1.5rem', overflowY: 'auto'}}>
                                <div style={{background: '#f5f5f7', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem'}}>
                                    {activeFact.equation}
                                </div>
                                <p style={{lineHeight: 1.6, marginBottom: '1.5rem'}}>{activeFact.text}</p>
                                
                                <h4 style={{marginBottom: '0.5rem', color: 'var(--primary)'}}>Symbol Key</h4>
                                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    {activeFact.key.map((k, i) => (
                                        <li key={i} style={{background: '#f9f9f9', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem'}}>
                                            <strong style={{fontFamily: 'monospace', color: 'var(--c1)'}}>{k.symbol}</strong> : {k.meaning}
                                        </li>
                                    ))}
                                </ul>

                                {/* Interactive Quiz Section */}
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                    <h4 style={{color: 'var(--c5)', margin: 0}}>Knowledge Check 🎓</h4>
                                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                                        Quiz {currentQuizIndex + 1}/{activeFact.quizzes.length}
                                    </span>
                                </div>
                                
                                <div style={{background: '#f5f5f7', padding: '1rem', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
                                    <p style={{fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.95rem'}}>
                                        {activeFact.quizzes[currentQuizIndex].question}
                                    </p>
                                    
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                        {activeFact.quizzes[currentQuizIndex].options.map((opt, i) => {
                                            let bg = 'white';
                                            let border = '1px solid #ccc';
                                            let color = 'var(--text-main)';
                                            
                                            if (showExplanation) {
                                                if (i === activeFact.quizzes[currentQuizIndex].correctAnswerIndex) {
                                                    bg = 'var(--c3)'; // Green for correct
                                                    color = 'white';
                                                    border = '1px solid var(--c3)';
                                                } else if (i === selectedAnswer) {
                                                    bg = 'var(--c1)'; // Red for wrong
                                                    color = 'white';
                                                    border = '1px solid var(--c1)';
                                                }
                                            }

                                            return (
                                                <button 
                                                    key={i} 
                                                    onClick={() => handleQuizAnswer(i)}
                                                    disabled={showExplanation}
                                                    style={{
                                                        padding: '0.75rem', 
                                                        borderRadius: '8px', 
                                                        border, 
                                                        background: bg, 
                                                        color,
                                                        textAlign: 'left',
                                                        cursor: showExplanation ? 'default' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    
                                    {showExplanation && (
                                        <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} style={{marginTop: '1rem'}}>
                                            <div style={{padding: '0.75rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem'}}>
                                                <strong style={{color: selectedAnswer === activeFact.quizzes[currentQuizIndex].correctAnswerIndex ? 'var(--c3)' : 'var(--c1)'}}>
                                                    {selectedAnswer === activeFact.quizzes[currentQuizIndex].correctAnswerIndex ? 'Correct! ' : 'Incorrect. '}
                                                </strong>
                                                {activeFact.quizzes[currentQuizIndex].explanation}
                                            </div>
                                            
                                            {activeFact.quizzes.length > 1 && (
                                                <button className="btn-secondary" onClick={nextQuiz} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', background: 'var(--c2)', color: 'white'}}>
                                                    Next Question <ArrowRight size={18} />
                                                </button>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const Tutorial = ({ setScreen }) => {
    // A hardcoded 3x3 guided tutorial grid
    const [paths, setPaths] = useState({});
    const [drawingColor, setDrawingColor] = useState(null);
    const [currentMathValue, setCurrentMathValue] = useState(null);
    const [completedPairs, setCompletedPairs] = useState([]);
    const gridRef = useRef(null);

    const tutorialGrid = {
        gridSize: 3,
        numPairs: 1,
        grid: [
            [{ type: 'source', pairId: 1, value: 5 }, null, null],
            [{ type: 'modifier', pairId: null, op: '+', value: 3, display: '+3' }, null, null],
            [{ type: 'sink', pairId: 1, target: 8 }, null, null]
        ]
    };

    const calculatePathValue = (pId, path) => {
        if (path.length === 0) return null;
        let val = tutorialGrid.grid[path[0][0]][path[0][1]].value;
        for (let i = 1; i < path.length; i++) {
            const cell = tutorialGrid.grid[path[i][0]][path[i][1]];
            if (cell && cell.type === 'modifier') {
                if (cell.op === '+') val += cell.value;
            }
        }
        return val;
    };

    const getCellFromEvent = (e) => {
        if (!gridRef.current) return null;
        const rect = gridRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
        return { r: Math.floor(y / (rect.height / 3)), c: Math.floor(x / (rect.width / 3)) };
    };

    const handlePointerDown = (r, c) => {
        const cell = tutorialGrid.grid[r][c];
        if (cell && cell.type === 'source') {
            playPop();
            setDrawingColor(cell.pairId);
            setCurrentMathValue(cell.value);
            setPaths({ [cell.pairId]: [[r, c]] });
            setCompletedPairs([]);
        }
    };

    const handlePointerMove = (e) => {
        if (!drawingColor) return;
        const pos = getCellFromEvent(e);
        if (!pos) return;
        const { r, c } = pos;

        setPaths(prev => {
            const currentPath = prev[drawingColor] || [];
            if (currentPath.length === 0) return prev;
            const lastPos = currentPath[currentPath.length - 1];
            if (lastPos[0] === r && lastPos[1] === c) return prev;
            const isAdjacent = Math.abs(lastPos[0] - r) + Math.abs(lastPos[1] - c) === 1;
            if (!isAdjacent) return prev;

            const cell = tutorialGrid.grid[r][c];
            if (cell && cell.type === 'sink') {
                const newPath = [...currentPath, [r, c]];
                const finalVal = calculatePathValue(drawingColor, newPath);
                if (finalVal === cell.target) {
                    playPerfect();
                    setDrawingColor(null);
                    setCompletedPairs([drawingColor]);
                    return { ...prev, [drawingColor]: newPath };
                } else {
                    playError();
                    return prev;
                }
            }
            playPop();
            const newPath = [...currentPath, [r, c]];
            setCurrentMathValue(calculatePathValue(drawingColor, newPath));
            return { ...prev, [drawingColor]: newPath };
        });
    };

    const handleGlobalUp = () => { setDrawingColor(null); setCurrentMathValue(null); };

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="screen-container">
            <div className="header">
                <button className="btn-secondary" onClick={() => setScreen('MENU')} style={{padding: '0.5rem'}}><ChevronLeft size={24} /></button>
                <h2>Interactive Tutorial</h2>
                <div style={{width: 40}}></div>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, overflowY: 'auto' }}>
                
                <div style={{background: '#f5f5f7', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e1e1e8', textAlign: 'center'}}>
                    <h3 style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--c1)', marginBottom: '0.5rem'}}>How to Play Math Flow</h3>
                    <p style={{color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5'}}>
                        Drag a path from the solid number through modifiers to reach the open target!
                        <br/><strong>Drag the <span style={{color: 'var(--c1)'}}>5</span> through the <span style={{color: '#666'}}>&nbsp;+3&nbsp;</span> modifier to hit the <span style={{color: 'var(--c1)'}}>8</span> ring.</strong>
                    </p>
                </div>

                <div className="puzzle-section" style={{ touchAction: 'none', marginTop: '1rem', flex: 'none', height: '300px' }}>
                    <div className="grid-container" ref={gridRef} onPointerMove={handlePointerMove} onTouchMove={handlePointerMove} onPointerUp={handleGlobalUp} onTouchEnd={handleGlobalUp} style={{ gridTemplateColumns: `repeat(3, 1fr)`, gridTemplateRows: `repeat(3, 1fr)` }}>
                        <svg className="path-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {Object.entries(paths).map(([pId, path]) => {
                                if (path.length < 2) return null;
                                const cellW = 100 / 3;
                                const points = path.map(p => `${(p[1] + 0.5) * cellW},${(p[0] + 0.5) * cellW}`).join(' ');
                                const strokeW = cellW * 0.4;
                                return <polyline key={pId} points={points} fill="none" stroke={COLORS[pId]} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />;
                            })}
                        </svg>
                        
                        {tutorialGrid.grid.map((row, r) => row.map((cell, c) => (
                            <div key={`${r}-${c}`} className="grid-cell" onPointerDown={() => handlePointerDown(r, c)} onTouchStart={() => handlePointerDown(r, c)}>
                                {cell && cell.type === 'source' && (
                                    <div className="node" style={{ backgroundColor: COLORS[cell.pairId] }}>{cell.value}</div>
                                )}
                                {cell && cell.type === 'sink' && (
                                    <div className="sink" style={{ borderColor: COLORS[cell.pairId] }}>{cell.target}</div>
                                )}
                                {cell && cell.type === 'modifier' && (
                                    <div className="modifier-tile">{cell.display}</div>
                                )}
                            </div>
                        )))}

                        {!completedPairs.includes(1) && (
                            <motion.div 
                                animate={{ y: [0, 100, 200], x: [0, 0, 0], opacity: [0, 1, 0] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                style={{ position: 'absolute', top: '10%', left: '20%', fontSize: '2rem', pointerEvents: 'none', zIndex: 100 }}
                            >
                                👆
                            </motion.div>
                        )}
                    </div>
                </div>

                {completedPairs.includes(1) ? (
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} style={{textAlign: 'center', marginTop: '1rem', background: '#e8f5e9', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--c3)'}}>
                        <h3 style={{color: 'var(--c3)', marginBottom: '0.5rem'}}>Great Job!</h3>
                        <p style={{fontSize: '0.95rem', color: '#2e7d32', marginBottom: '1.5rem'}}>You matched the sum! Bonus: Fill every empty tile on the board to earn Hidden Stars.</p>
                        <button className="btn-primary" onClick={() => setScreen('MENU')} style={{margin: 0, background: 'var(--c3)', borderBottomColor: '#3cb051'}}>
                            Return to Menu
                        </button>
                    </motion.div>
                ) : (
                    <div style={{flex: 1}}></div>
                )}
            </div>
            {completedPairs.includes(1) && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
        </motion.div>
    );
};

// --- ARCADE MODE SCREEN ---
const ArcadeScreen = ({ setScreen, arcadeHighScore, setArcadeHighScore, isMuted, toggleMute, skipTrack, setGlobalScore }) => {
    const [arcadeLevel, setArcadeLevel] = useState(1);
    const [gridData, setGridData] = useState(null);
    const [paths, setPaths] = useState({});
    const [drawingColor, setDrawingColor] = useState(null);
    const [currentMathValue, setCurrentMathValue] = useState(null);
    const [completedPairs, setCompletedPairs] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const gridRef = useRef(null);

    // Timer logic
    useEffect(() => {
        if (gameOver) return;
        
        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setGameOver(true);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameOver]);

    useEffect(() => {
        if (gameOver) {
            if (score > arcadeHighScore) setArcadeHighScore(score);
            setGlobalScore(prev => prev + score); // Add to global economy
        }
    }, [gameOver, score, arcadeHighScore, setGlobalScore]);

    const handleQuit = () => {
        if (!gameOver) {
            if (score > arcadeHighScore) setArcadeHighScore(score);
            setGlobalScore(prev => prev + score);
        }
        setScreen('MENU');
    };

    const loadNewLevel = (lvl) => {
        let actualSize = Math.min(8, 4 + Math.floor(lvl / 3));
        let actualPairs = Math.min(5, 2 + Math.floor(lvl / 4));
        let minPath = Math.min(6, 3 + Math.floor(lvl / 4));
        let useFormulas = lvl >= 10;

        const data = generateLevel(actualSize, actualPairs, minPath, useFormulas);
        setGridData(data);
        setPaths({});
        setCompletedPairs([]);
        setDrawingColor(null);
        setCurrentMathValue(null);
    };

    useEffect(() => {
        loadNewLevel(arcadeLevel);
    }, [arcadeLevel]);

    useEffect(() => {
        const handleGlobalUp = () => { setDrawingColor(null); setCurrentMathValue(null); };
        window.addEventListener('pointerup', handleGlobalUp);
        window.addEventListener('pointercancel', handleGlobalUp);
        return () => {
            window.removeEventListener('pointerup', handleGlobalUp);
            window.removeEventListener('pointercancel', handleGlobalUp);
        };
    }, []);

    const calculatePathValue = (pId, path) => {
        if (!gridData || path.length === 0) return null;
        const startCell = gridData.grid[path[0][0]][path[0][1]];
        if (!startCell || startCell.type !== 'source') return null;
        
        let val = startCell.value;
        for (let i = 1; i < path.length; i++) {
            const cell = gridData.grid[path[i][0]][path[i][1]];
            if (cell && cell.type === 'sink') continue;
            if (cell && cell.type === 'modifier') {
                if (cell.op === '+') val += cell.value;
                if (cell.op === '-') val -= cell.value;
                if (cell.op === '*') val *= cell.value;
                if (cell.op === '/') val /= cell.value;
                if (cell.op === '^2') val = val * val;
                if (cell.op === '2x') val = val * 2;
            }
        }
        return val;
    };

    const getCellFromEvent = (e) => {
        if (!gridRef.current || !gridData) return null;
        const rect = gridRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
        return { r: Math.floor(y / (rect.height / gridData.gridSize)), c: Math.floor(x / (rect.width / gridData.gridSize)) };
    };

    const handlePointerDown = (r, c) => {
        if (gameOver) return;
        
        const cell = gridData.grid[r][c];
        
        if (cell && cell.type === 'source') {
            playPop();
            setDrawingColor(cell.pairId);
            setCurrentMathValue(cell.value);
            setPaths(prev => ({ ...prev, [cell.pairId]: [[r, c]] }));
            setCompletedPairs(prev => prev.filter(p => p !== cell.pairId));
        } else {
            for (const [pId, path] of Object.entries(paths)) {
                const idx = path.findIndex(p => p[0] === r && p[1] === c);
                if (idx !== -1) {
                    playPop();
                    const pIdNum = parseInt(pId);
                    const newPath = path.slice(0, idx + 1);
                    setDrawingColor(pIdNum);
                    setPaths(prev => ({ ...prev, [pIdNum]: newPath }));
                    setCurrentMathValue(calculatePathValue(pIdNum, newPath));
                    setCompletedPairs(prev => prev.filter(p => p !== pIdNum));
                    return;
                }
            }
        }
    };

    const handlePointerMove = (e) => {
        if (!drawingColor || gameOver) return;
        const pos = getCellFromEvent(e);
        if (!pos) return;
        const { r, c } = pos;

        setPaths(prev => {
            const currentPath = prev[drawingColor] || [];
            if (currentPath.length === 0) return prev;
            
            const lastPos = currentPath[currentPath.length - 1];
            if (lastPos[0] === r && lastPos[1] === c) return prev;

            const isAdjacent = Math.abs(lastPos[0] - r) + Math.abs(lastPos[1] - c) === 1;
            if (!isAdjacent) return prev;

            if (currentPath.length >= 2) {
                const prevPos = currentPath[currentPath.length - 2];
                if (prevPos[0] === r && prevPos[1] === c) {
                    playPop();
                    const newPath = currentPath.slice(0, -1);
                    setCurrentMathValue(calculatePathValue(drawingColor, newPath));
                    return { ...prev, [drawingColor]: newPath };
                }
            }

            for (const [pId, path] of Object.entries(prev)) {
                if (parseInt(pId) !== drawingColor) {
                    if (path.some(p => p[0] === r && p[1] === c)) return prev; 
                }
            }

            const cell = gridData.grid[r][c];
            
            if (cell && (cell.type === 'source' || cell.type === 'sink')) {
                if (cell.pairId === drawingColor) {
                    const isOrigin = currentPath[0][0] === r && currentPath[0][1] === c;
                    if (currentPath.length > 1 && !isOrigin && cell.type === 'sink') {
                        const newPath = [...currentPath, [r, c]];
                        const finalVal = calculatePathValue(drawingColor, newPath);
                        
                        if (Math.round(finalVal) === Math.round(cell.target)) {
                            playSnap();
                            setDrawingColor(null);
                            setCurrentMathValue(null);
                            setCompletedPairs(curr => {
                                if (curr.includes(drawingColor)) return curr; 
                                const next = [...curr, drawingColor];
                                if (next.length === gridData.numPairs) {
                                    playPerfect();
                                    setScore(s => s + 150 + (arcadeLevel * 10));
                                    setTimeLeft(t => t + 20); // 20s bonus!
                                    setTimeout(() => setArcadeLevel(l => l + 1), 500);
                                }
                                return next;
                            });
                            return { ...prev, [drawingColor]: newPath };
                        } else {
                            playError();
                            return prev;
                        }
                    }
                    return prev;
                } else {
                    return prev;
                }
            }

            playPop();
            const newPath = [...currentPath, [r, c]];
            const rawVal = calculatePathValue(drawingColor, newPath);
            const displayVal = Number.isInteger(rawVal) ? rawVal : parseFloat(rawVal.toFixed(2));
            setCurrentMathValue(displayVal);
            return { ...prev, [drawingColor]: newPath };
        });
    };

    const renderPaths = () => {
        if (!gridData || !gridRef.current) return null;
        const cellW = 100 / gridData.gridSize;
        
        return (
            <svg className="path-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Object.entries(paths).map(([pId, path]) => {
                    if (path.length < 2) return null;
                    const points = path.map(p => `${(p[1] + 0.5) * cellW},${(p[0] + 0.5) * cellW}`).join(' ');
                    const isComplete = completedPairs.includes(parseInt(pId));
                    const strokeW = isComplete ? cellW * 0.6 : cellW * 0.4;
                    return (
                        <polyline 
                            key={pId}
                            points={points}
                            fill="none"
                            stroke={COLORS[pId]}
                            strokeWidth={strokeW}
                            strokeLinecap="square"
                            strokeLinejoin="miter"
                            style={{ transition: 'stroke-width 0.3s' }}
                        />
                    );
                })}
            </svg>
        );
    };

    if (!gridData) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="screen-container">
            <div className="header" style={{background: 'var(--c5)', color: 'white'}}>
                <button className="btn-secondary" onClick={handleQuit} style={{padding: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white'}}><ChevronLeft size={24} /></button>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>SCORE {score}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--c4)' }}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={toggleMute} style={{padding: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white'}}>
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button className="btn-secondary" onClick={skipTrack} style={{padding: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white'}}>
                        <SkipForward size={20} />
                    </button>
                </div>
            </div>

            <div style={{ padding: '0.5rem', textAlign: 'center', background: '#fafafa', borderBottom: '1px solid #eee', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {currentMathValue !== null ? (
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS[drawingColor] }}>
                        {currentMathValue}
                    </div>
                ) : (
                    <div style={{ color: 'var(--text-muted)' }}>Draw a path to calculate!</div>
                )}
            </div>
            
            <div className="puzzle-section" style={{ touchAction: 'none' }}>
                <div className="grid-container" ref={gridRef} onPointerMove={handlePointerMove} onTouchMove={handlePointerMove} onDragStart={(e) => e.preventDefault()} style={{ gridTemplateColumns: `repeat(${gridData.gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridData.gridSize}, 1fr)` }}>
                    {renderPaths()}
                    
                    {gridData.grid.map((row, r) => row.map((cell, c) => (
                        <div key={`${r}-${c}`} className="grid-cell" onPointerDown={() => handlePointerDown(r, c)} onTouchStart={() => handlePointerDown(r, c)}>
                            {cell && cell.type === 'source' && (
                                <div className={`node ${drawingColor === cell.pairId ? 'active' : ''}`} style={{ backgroundColor: COLORS[cell.pairId] }}>
                                    {cell.value}
                                </div>
                            )}
                            {cell && cell.type === 'sink' && (
                                <div className="sink" style={{ borderColor: COLORS[cell.pairId] }}>
                                    {cell.target}
                                </div>
                            )}
                            {cell && cell.type === 'modifier' && (
                                <div className="modifier-tile">
                                    {cell.display}
                                </div>
                            )}
                        </div>
                    )))}
                </div>
            </div>

            <div className="hud-bar">
                <span className="level-text" style={{ color: 'var(--text-muted)' }}>
                    Target sums. +20s per clear!
                </span>
            </div>

            {gameOver && (
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 100}}>
                    <h1 style={{color: 'white', fontSize: '3rem', marginBottom: '0.5rem'}}>TIME'S UP!</h1>
                    <p style={{color: 'var(--c4)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem'}}>Final Score: {score}</p>
                    <button className="btn-primary" onClick={() => setScreen('MENU')} style={{width: '200px'}}>Main Menu</button>
                </div>
            )}
        </motion.div>
    );
};

// --- GAME SCREEN (Standard) ---
const GameScreen = ({ setScreen, difficulty, level, setLevel, maxUnlockedLevel, setMaxUnlockedLevel, levelStars, setLevelStars, stars, setStars, globalScore, setGlobalScore, isMuted, toggleMute, skipTrack }) => {
  const [gridData, setGridData] = useState(null);
  const [paths, setPaths] = useState({});
  const [drawingColor, setDrawingColor] = useState(null);
  const [currentMathValue, setCurrentMathValue] = useState(null);
  const [completedPairs, setCompletedPairs] = useState([]);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [perfectClear, setPerfectClear] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    loadLevel(level);
  }, [level, difficulty]);

  const loadLevel = (lvl) => {
    let baseSize, numPairs;
    switch(difficulty) {
        case 'EASY': baseSize = 4; numPairs = 2; break;
        case 'MEDIUM': baseSize = 5; numPairs = 3; break;
        case 'HARD': baseSize = 6; numPairs = 4; break;
        default: baseSize = 6; numPairs = 3; break;
    }
    
    // Capped at 8x8 maximum and 5 pairs maximum to prevent visual clutter
    let actualSize = Math.min(8, baseSize + Math.floor((lvl - 1) / 5));
    let actualPairs = Math.min(5, numPairs + Math.floor((lvl - 1) / 6));
    let minPath = Math.min(6, 3 + Math.floor((lvl - 1) / 4)); // Scales up path length as level increases
    let useFormulas = difficulty === 'HARD' && lvl >= 5; // Enable formulas on Hard 5+

    const data = generateLevel(actualSize, actualPairs, minPath, useFormulas);
    setGridData(data);
    setPaths({});
    setCompletedPairs([]);
    setDrawingColor(null);
    setCurrentMathValue(null);
    setIsLevelComplete(false);
    setPerfectClear(false);
  };

  useEffect(() => {
    const handleGlobalUp = () => {
      setDrawingColor(null);
      setCurrentMathValue(null);
    };
    
    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointercancel', handleGlobalUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
    };
  }, []);

  const useHint = () => {
      if (globalScore < 500 || isLevelComplete || !gridData) return;
      
      let pairToSolve = -1;
      for (let i = 1; i <= gridData.numPairs; i++) {
          if (!completedPairs.includes(i)) {
              pairToSolve = i;
              break;
          }
      }

      if (pairToSolve !== -1 && gridData.solutionPaths && gridData.solutionPaths[pairToSolve - 1]) {
          setGlobalScore(s => s - 500);
          playPowerup();
          
          const sol = gridData.solutionPaths[pairToSolve - 1];
          setPaths(prev => ({ ...prev, [pairToSolve]: sol }));
          
          setCompletedPairs(curr => {
              if (curr.includes(pairToSolve)) return curr; 
              const next = [...curr, pairToSolve];
              if (next.length === gridData.numPairs) {
                  setIsLevelComplete(true);
                  if (level >= (maxUnlockedLevel[difficulty] || 1)) {
                      setMaxUnlockedLevel(prev => ({ ...prev, [difficulty]: level + 1 }));
                  }
                  setGlobalScore(s => s + 100);
                  playWin();
              }
              return next;
          });
      }
  };

  const calculatePathValue = (pId, path) => {
      if (!gridData || path.length === 0) return null;
      const startCell = gridData.grid[path[0][0]][path[0][1]];
      if (!startCell || startCell.type !== 'source') return null;
      
      let val = startCell.value;
      
      for (let i = 1; i < path.length; i++) {
          const r = path[i][0];
          const c = path[i][1];
          const cell = gridData.grid[r][c];
          
          if (cell && cell.type === 'sink') continue;
          
          if (cell && cell.type === 'modifier') {
              if (cell.op === '+') val += cell.value;
              if (cell.op === '-') val -= cell.value;
              if (cell.op === '*') val *= cell.value;
              if (cell.op === '/') val /= cell.value;
              if (cell.op === '^2') val = val * val;
              if (cell.op === '2x') val = val * 2;
          }
      }
      return val;
  };

  const getCellFromEvent = (e) => {
    if (!gridRef.current || !gridData) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
    
    const cellW = rect.width / gridData.gridSize;
    const cellH = rect.height / gridData.gridSize;
    const c = Math.floor(x / cellW);
    const r = Math.floor(y / cellH);
    return { r, c };
  };

  const handlePointerDown = (r, c) => {
    if (isLevelComplete) return;
    const cell = gridData.grid[r][c];
    
    if (cell && cell.type === 'source') {
      playPop();
      setDrawingColor(cell.pairId);
      setCurrentMathValue(cell.value);
      setPaths(prev => ({ ...prev, [cell.pairId]: [[r, c]] }));
      setCompletedPairs(prev => prev.filter(p => p !== cell.pairId));
    } else {
      for (const [pId, path] of Object.entries(paths)) {
        const idx = path.findIndex(p => p[0] === r && p[1] === c);
        if (idx !== -1) {
          playPop();
          const pIdNum = parseInt(pId);
          const newPath = path.slice(0, idx + 1);
          setDrawingColor(pIdNum);
          setPaths(prev => ({ ...prev, [pIdNum]: newPath }));
          setCurrentMathValue(calculatePathValue(pIdNum, newPath));
          setCompletedPairs(prev => prev.filter(p => p !== pIdNum));
          return;
        }
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!drawingColor || isLevelComplete) return;
    const pos = getCellFromEvent(e);
    if (!pos) return;
    const { r, c } = pos;

    setPaths(prev => {
      const currentPath = prev[drawingColor] || [];
      if (currentPath.length === 0) return prev;
      
      const lastPos = currentPath[currentPath.length - 1];
      if (lastPos[0] === r && lastPos[1] === c) return prev;

      const isAdjacent = Math.abs(lastPos[0] - r) + Math.abs(lastPos[1] - c) === 1;
      if (!isAdjacent) return prev;

      if (currentPath.length >= 2) {
        const prevPos = currentPath[currentPath.length - 2];
        if (prevPos[0] === r && prevPos[1] === c) {
          playPop();
          const newPath = currentPath.slice(0, -1);
          setCurrentMathValue(calculatePathValue(drawingColor, newPath));
          return { ...prev, [drawingColor]: newPath };
        }
      }

      for (const [pId, path] of Object.entries(prev)) {
        if (parseInt(pId) !== drawingColor) {
           if (path.some(p => p[0] === r && p[1] === c)) return prev; 
        }
      }

      const cell = gridData.grid[r][c];
      
      if (cell && (cell.type === 'source' || cell.type === 'sink')) {
          if (cell.pairId === drawingColor) {
              const isOrigin = currentPath[0][0] === r && currentPath[0][1] === c;
              
              if (currentPath.length > 1 && !isOrigin && cell.type === 'sink') {
                  const newPath = [...currentPath, [r, c]];
                  const finalVal = calculatePathValue(drawingColor, newPath);
                  
                  const targetMatch = Math.round(finalVal) === Math.round(cell.target);
                  
                  if (targetMatch) {
                      playSnap();
                      setDrawingColor(null);
                      setCurrentMathValue(null);
                      setCompletedPairs(curr => {
                          if (curr.includes(drawingColor)) return curr; 
                          const next = [...curr, drawingColor];
                          checkWinCondition(next, { ...prev, [drawingColor]: newPath });
                          return next;
                      });
                      return { ...prev, [drawingColor]: newPath };
                  } else {
                      playError();
                      return prev;
                  }
              }
              return prev;
          } else {
              return prev;
          }
      }

      playPop();
      const newPath = [...currentPath, [r, c]];
      const rawVal = calculatePathValue(drawingColor, newPath);
      const displayVal = Number.isInteger(rawVal) ? rawVal : parseFloat(rawVal.toFixed(2));
      setCurrentMathValue(displayVal);
      return { ...prev, [drawingColor]: newPath };
    });
  };

  const checkWinCondition = (completed, currentPaths) => {
      if (!gridData) return;
      if (completed.length !== gridData.numPairs) return; 
      
      let filledCells = 0;
      Object.values(currentPaths).forEach(path => filledCells += path.length);
      
      const totalCells = gridData.gridSize * gridData.gridSize;
      let emptyCount = 0;
      for(let r=0; r<gridData.gridSize; r++){
          for(let c=0; c<gridData.gridSize; c++){
              const t = gridData.grid[r][c]?.type;
              if(t === 'empty' || t === 'modifier' || t === 'source' || t === 'sink') emptyCount++;
          }
      }

      setIsLevelComplete(true);
      
      const currentMaxLvl = maxUnlockedLevel[difficulty] || 1;
      if (level >= currentMaxLvl) {
          setMaxUnlockedLevel(prev => ({ ...prev, [difficulty]: level + 1 }));
      }
      
      if (filledCells === emptyCount) {
          const starsForDiff = levelStars[difficulty] || [];
          if (!starsForDiff.includes(level)) {
              setLevelStars(prev => ({ ...prev, [difficulty]: [...starsForDiff, level] }));
              setStars(s => s + 1);
          }
          setPerfectClear(true);
          setGlobalScore(s => s + 250);
          playPerfect();
      } else {
          setGlobalScore(s => s + 100);
          playWin();
      }
  };

  const renderPaths = () => {
      if (!gridData || !gridRef.current) return null;
      const cellW = 100 / gridData.gridSize;
      
      return (
          <svg className="path-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              {Object.entries(paths).map(([pId, path]) => {
                  if (path.length < 2) return null;
                  const points = path.map(p => `${(p[1] + 0.5) * cellW},${(p[0] + 0.5) * cellW}`).join(' ');
                  const isComplete = completedPairs.includes(parseInt(pId));
                  const strokeW = isComplete ? cellW * 0.6 : cellW * 0.4;
                  return (
                      <polyline 
                          key={pId}
                          points={points}
                          fill="none"
                          stroke={COLORS[pId]}
                          strokeWidth={strokeW}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transition: 'stroke-width 0.3s' }}
                      />
                  );
              })}
          </svg>
      );
  };

  if (!gridData) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="screen-container">
      {perfectClear && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} gravity={0.3} />}
      <div className="header">
        <button className="btn-secondary" onClick={() => setScreen('LEVEL_SELECT')} style={{padding: '0.5rem'}}><ChevronLeft size={24} /></button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                {`Level ${level}`}
            </h2>
            <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentMathValue !== null ? (
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: COLORS[drawingColor], lineHeight: 1 }}>
                        {currentMathValue}
                    </div>
                ) : (
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>XP: {globalScore}</div>
                )}
            </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={toggleMute} style={{padding: '0.5rem'}}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="btn-secondary" onClick={skipTrack} style={{padding: '0.5rem'}}>
                <SkipForward size={20} />
            </button>
            <button className="btn-secondary" onClick={() => loadLevel(level)} style={{padding: '0.5rem'}}><RotateCcw size={20} /></button>
        </div>
      </div>
      
      <div className="puzzle-section" style={{ touchAction: 'none' }}>
          <div className="grid-container" ref={gridRef} onPointerMove={handlePointerMove} onTouchMove={handlePointerMove} onDragStart={(e) => e.preventDefault()} style={{ gridTemplateColumns: `repeat(${gridData.gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridData.gridSize}, 1fr)` }}>
            {renderPaths()}
            {gridData.grid.map((row, r) => row.map((cell, c) => (
                <div key={`${r}-${c}`} className="grid-cell" onPointerDown={() => handlePointerDown(r, c)} onTouchStart={() => handlePointerDown(r, c)}>
                  {cell && cell.type === 'source' && (
                    <div className={`node ${drawingColor === cell.pairId ? 'active' : ''}`} style={{ backgroundColor: COLORS[cell.pairId] }}>
                        {cell.value}
                    </div>
                  )}
                  {cell && cell.type === 'sink' && (
                    <div className="sink" style={{ borderColor: COLORS[cell.pairId] }}>
                        {cell.target}
                    </div>
                  )}
                  {cell && cell.type === 'modifier' && (
                    <div className="modifier-tile">
                        {cell.display}
                    </div>
                  )}
                </div>
            )))}
          </div>
      </div>

      <div className="hud-bar" style={{justifyContent: 'space-between', padding: '1rem'}}>
          {!isLevelComplete && (
            <button 
                className="btn-secondary" 
                disabled={globalScore < 500} 
                onClick={useHint}
                style={{margin: 0, padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', background: globalScore >= 500 ? '#fff3cd' : '#85640420', color: globalScore >= 500 ? '#856404' : '#aaa'}}
            >
                <Lightbulb size={18} /> Buy Hint (500)
            </button>
          )}

          <span className="level-text" style={{ flex: 1, textAlign: 'center', color: perfectClear ? 'var(--c4)' : 'var(--text-muted)', fontWeight: perfectClear ? 'bold' : 'normal' }}>
              {perfectClear ? "✨ PERFECT CLEAR! +1 ⭐ ✨" : (isLevelComplete ? "Level Complete! +100 XP" : "Match the target sums!")}
          </span>
          
          {isLevelComplete && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn-primary" style={{margin: 0, width: 'auto'}} onClick={() => setLevel(l => l + 1)}>
                  Next Level →
              </motion.button>
          )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('MENU');
  const [difficulty, setDifficulty] = useState('EASY');
  
  // Progress State
  const [level, setLevel] = useState(1);
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(() => {
      const saved = localStorage.getItem('maxLvlV2');
      return saved ? JSON.parse(saved) : { EASY: 1, MEDIUM: 1, HARD: 1 };
  });
  const [levelStars, setLevelStars] = useState(() => {
      const saved = localStorage.getItem('starsV2');
      return saved ? JSON.parse(saved) : { EASY: [], MEDIUM: [], HARD: [] };
  });
  const [stars, setStars] = useState(() => {
      const saved = localStorage.getItem('starCurrencyV2');
      return saved !== null ? parseInt(saved) : 0;
  });
  const [collection, setCollection] = useState(() => {
      const saved = localStorage.getItem('collectionV2');
      return saved ? JSON.parse(saved) : [];
  });
  const [globalScore, setGlobalScore] = useState(() => {
      const saved = localStorage.getItem('globalScoreV3');
      return saved ? parseInt(saved) : 0;
  });
  const [arcadeHighScore, setArcadeHighScore] = useState(() => {
      const saved = localStorage.getItem('arcadeScore');
      return saved ? parseInt(saved) : 0;
  });

  // Settings State
  const [sfxVolume, setSfxVolume] = useState(() => {
      const saved = localStorage.getItem('sfxVol');
      return saved !== null ? parseFloat(saved) : 0.5;
  });
  const [bgmVolume, setBgmVolume] = useState(() => {
      const saved = localStorage.getItem('bgmVol');
      return saved !== null ? parseFloat(saved) : 0.3;
  });
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
      const saved = localStorage.getItem('hapticsEnabled');
      return saved !== null ? saved === 'true' : true;
  });

  // Audio State
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[0]);
      audioRef.current.loop = PLAYLIST.length === 1;
  }

  useEffect(() => {
      localStorage.setItem('maxLvlV2', JSON.stringify(maxUnlockedLevel));
      localStorage.setItem('starsV2', JSON.stringify(levelStars));
      localStorage.setItem('starCurrencyV2', stars);
      localStorage.setItem('collectionV2', JSON.stringify(collection));
      localStorage.setItem('globalScoreV3', globalScore);
      localStorage.setItem('arcadeScore', arcadeHighScore);
      
      localStorage.setItem('sfxVol', sfxVolume);
      localStorage.setItem('bgmVol', bgmVolume);
      localStorage.setItem('hapticsEnabled', hapticsEnabled);
      
      window.appSettings.sfxVolume = sfxVolume;
      window.appSettings.hapticsEnabled = hapticsEnabled;
      if (audioRef.current) audioRef.current.volume = bgmVolume;
  }, [maxUnlockedLevel, levelStars, stars, collection, globalScore, arcadeHighScore, sfxVolume, bgmVolume, hapticsEnabled]);

  const hardReset = () => {
      setMaxUnlockedLevel({ EASY: 1, MEDIUM: 1, HARD: 1 });
      setLevelStars({ EASY: [], MEDIUM: [], HARD: [] });
      setStars(0);
      setCollection([]);
      setGlobalScore(0);
      setArcadeHighScore(0);
      setLevel(1);
  };

  useEffect(() => {
      const audio = audioRef.current;
      
      const handleEnded = () => {
          setCurrentTrackIndex(prev => {
              if (PLAYLIST.length <= 1) return prev;
              let nextIdx = prev;
              while (nextIdx === prev) {
                  nextIdx = Math.floor(Math.random() * PLAYLIST.length);
              }
              return nextIdx;
          });
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  useEffect(() => {
      const audio = audioRef.current;
      audio.src = PLAYLIST[currentTrackIndex];
      if (!isMuted) {
          audio.play().catch(e => console.log('Waiting for user interaction to play music.'));
      }
  }, [currentTrackIndex]);

  useEffect(() => {
      if (isMuted) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch(e => console.log('Waiting for user interaction to play music.'));
      }
  }, [isMuted]);

  const toggleMute = () => setIsMuted(prev => !prev);
  
  const skipTrack = () => {
      setCurrentTrackIndex(prev => {
          if (PLAYLIST.length <= 1) return prev;
          let nextIdx = prev;
          while (nextIdx === prev) {
              nextIdx = Math.floor(Math.random() * PLAYLIST.length);
          }
          return nextIdx;
      });
      if (isMuted) setIsMuted(false); 
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {screen === 'MENU' && <MainMenu key="menu" setScreen={setScreen} setDifficulty={setDifficulty} isMuted={isMuted} toggleMute={toggleMute} skipTrack={skipTrack} arcadeHighScore={arcadeHighScore} globalScore={globalScore} />}
        {screen === 'SETTINGS' && <SettingsScreen key="settings" setScreen={setScreen} sfxVolume={sfxVolume} setSfxVolume={setSfxVolume} bgmVolume={bgmVolume} setBgmVolume={setBgmVolume} hapticsEnabled={hapticsEnabled} setHapticsEnabled={setHapticsEnabled} hardReset={hardReset} />}
        {screen === 'LEVEL_SELECT' && <LevelSelect key="level_select" setScreen={setScreen} difficulty={difficulty} setLevel={setLevel} maxUnlockedLevel={maxUnlockedLevel} levelStars={levelStars} />}
        {screen === 'COLLECTION' && <CollectionScreen key="collection" setScreen={setScreen} stars={stars} setStars={setStars} globalScore={globalScore} setGlobalScore={setGlobalScore} collection={collection} setCollection={setCollection} />}
        {screen === 'TUTORIAL' && <Tutorial key="tutorial" setScreen={setScreen} />}
        {screen === 'GAME' && <GameScreen key="game" setScreen={setScreen} difficulty={difficulty} level={level} setLevel={setLevel} maxUnlockedLevel={maxUnlockedLevel} setMaxUnlockedLevel={setMaxUnlockedLevel} levelStars={levelStars} setLevelStars={setLevelStars} stars={stars} setStars={setStars} globalScore={globalScore} setGlobalScore={setGlobalScore} isMuted={isMuted} toggleMute={toggleMute} skipTrack={skipTrack} />}
        {screen === 'ARCADE' && <ArcadeScreen key="arcade" setScreen={setScreen} arcadeHighScore={arcadeHighScore} setArcadeHighScore={setArcadeHighScore} isMuted={isMuted} toggleMute={toggleMute} skipTrack={skipTrack} setGlobalScore={setGlobalScore} />}
      </AnimatePresence>
    </div>
  );
}
