import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Award, Lock, Cat, ShoppingCart, Hammer, Clock, Trophy, Upload } from 'lucide-react';

const MainMenu = ({ totalStars = 0, setScreen, setGridSize, setGameMode, onImportLevel }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleStartGame = (size) => {
    setGridSize(size);
    setGameMode('ARCADE');
    setScreen('GAME');
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants} 
      className="main-menu screen-container"
    >
      <div className="title-section">
        <motion.h1 variants={itemVariants}>SUGAR LOGIC</motion.h1>
        <motion.p variants={itemVariants} className="subtitle">Sweet Math Puzzles</motion.p>
      </div>
      
      <motion.div variants={itemVariants} className="menu-buttons" style={{marginBottom: '2rem'}}>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('STORY_MAP')}
          style={{
            background: 'linear-gradient(180deg, #ff99cc, #ff3366)',
            color: '#fff', border: 'none', borderRadius: '30px', padding: '1.5rem',
            fontSize: '1.5rem', fontWeight: '900', boxShadow: '0 8px 0 #cc0044',
            cursor: 'pointer', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}
        >
          <Play size={28} /> PLAY STORY SAGA
        </motion.button>

        <div style={{color: 'var(--color-purple)', fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase', textAlign: 'center'}}>Arcade Modes</div>
        <MenuButton title="Beginner (4x4)" onClick={() => handleStartGame(4)} icon={<Play size={20}/>} isSecondary />
        <MenuButton title="Intermediate (5x5)" onClick={() => handleStartGame(5)} icon={<Play size={20}/>} isSecondary />
        
        <MenuButton 
          title="Advanced (7x7)" 
          onClick={() => handleStartGame(7)} 
          isLocked={totalStars < 50}
          lockedMessage="Need 50 Stars"
          icon={<Play size={20}/>}
          isSecondary
        />
        
        <MenuButton 
          title="Expert (9x9)" 
          onClick={() => handleStartGame(9)} 
          isLocked={totalStars < 120}
          lockedMessage="Need 120 Stars"
          icon={<Play size={20}/>}
          isSecondary
        />

        <div style={{height: '1px', background: 'var(--border-neon)', margin: '1rem 0', opacity: 0.5}}></div>

        <MenuButton 
          title="Time Attack Mode" 
          onClick={() => setScreen('TIME_ATTACK')} 
          isLocked={totalStars < 10}
          lockedMessage="Need 10 Stars"
          icon={<Clock size={20} style={{color: '#ff3366'}} />}
          isSecondary
        />

        <div style={{height: '1px', background: 'var(--border-neon)', margin: '1rem 0', opacity: 0.5}}></div>

        <MenuButton title="Beast Sanctuary" onClick={() => setScreen('BEAST_SANCTUARY')} icon={<Cat size={20}/>} isSecondary />
        <MenuButton title="Candy Shop (Power-ups)" onClick={() => setScreen('CANDY_SHOP')} icon={<ShoppingCart size={20}/>} isSecondary />
        <MenuButton title="Weekly Leaderboard" onClick={() => setScreen('LEADERBOARD')} icon={<Trophy size={20}/>} isSecondary />
        <MenuButton title="Level Architect" onClick={() => setScreen('ARCHITECT')} icon={<Hammer size={20}/>} isSecondary />
        <MenuButton title="Import Custom Level" onClick={onImportLevel} icon={<Upload size={20}/>} isSecondary />
        <MenuButton title="How to Play" onClick={() => setScreen('TUTORIAL')} icon={<BookOpen size={20}/>} isSecondary />
      </motion.div>

      <motion.div variants={itemVariants} style={{marginTop: 'auto', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-neon)'}}>
         <span style={{color: '#ddd', fontWeight: 'bold'}}>Total Stars Collected: </span>
         <strong style={{color: 'var(--color-yellow)', fontSize: '1.2rem'}}>{totalStars}</strong>
      </motion.div>
    </motion.div>
  );
};

const MenuButton = ({ title, onClick, isLocked, lockedMessage, icon, isSecondary }) => {
  const baseClass = isSecondary ? 'btn-secondary' : 'btn-primary';
  
  if (isLocked) {
    return (
      <motion.button 
        className={`${baseClass}`}
        style={{opacity: 0.5, cursor: 'not-allowed', background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,51,102,0.3)'}}
        disabled
      >
        <Lock size={18} style={{color: 'var(--color-red)'}} />
        <span style={{flex: 1, textAlign: 'left', color: '#ddd'}}>{title}</span>
        <span style={{fontSize: '0.8rem', color: '#ff99cc'}}>{lockedMessage}</span>
      </motion.button>
    );
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={baseClass}
    >
      {icon}
      <span style={{flex: 1, textAlign: 'left'}}>{title}</span>
    </motion.button>
  );
};

export default MainMenu;
