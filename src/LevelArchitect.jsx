import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { solveLevel } from './LevelSolver';

const LevelArchitect = ({ onBack, onExport }) => {
    const [gridSize, setGridSize] = useState(5);
    const [grid, setGrid] = useState(Array(5).fill(null).map(() => Array(5).fill(null)));
    
    const [activeToolType, setActiveToolType] = useState('source'); // 'source', 'sink', 'modifier', 'void', 'ice', 'conveyor'
    const [customPairId, setCustomPairId] = useState(1);
    const [customValue, setCustomValue] = useState(5);
    const [customOp, setCustomOp] = useState('+');
    
    const [validationResult, setValidationResult] = useState(null);

    const getActiveToolObj = () => {
        if (activeToolType === 'source') return { type: 'source', pairId: customPairId, value: customValue };
        if (activeToolType === 'sink') return { type: 'sink', pairId: customPairId, target: customValue };
        if (activeToolType === 'modifier') return { type: 'modifier', op: customOp, value: customOp === '|x|' ? null : customValue, display: customOp === '|x|' ? '|x|' : `${customOp}${customValue}` };
        if (activeToolType === 'conveyor') return { type: 'conveyor', dir: 'right' };
        return { type: activeToolType };
    };
    
    const handleCellClick = (r, c) => {
        const toolObj = getActiveToolObj();
        const newGrid = [...grid];
        newGrid[r] = [...newGrid[r]];
        
        if (newGrid[r][c] && newGrid[r][c].type === toolObj.type) {
            newGrid[r][c] = null; // Erase
        } else {
            newGrid[r][c] = toolObj;
        }
        setGrid(newGrid);
        setValidationResult(null); // Reset validation on change
    };

    const handleValidate = () => {
        const result = solveLevel(gridSize, grid);
        setValidationResult(result);
    };
    
    const generateCode = () => {
        const compressed = { size: gridSize, cells: [] };
        grid.forEach((row, r) => row.forEach((cell, c) => {
            if (cell) compressed.cells.push({ r, c, ...cell });
        }));
        const code = btoa(JSON.stringify(compressed));
        navigator.clipboard.writeText(code);
        alert("Level Code copied to clipboard!\n\n" + code);
    };

    const clearGrid = () => {
        setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="screen-container architect-bg">
            <div className="header" style={{background: 'var(--color-blue)', padding: '1rem', display: 'flex', justifyContent: 'space-between'}}>
                <button onClick={onBack} className="btn-candy-small">← Back</button>
                <h2 style={{color: '#fff', textShadow: '2px 2px 0 #000'}}>Level Architect</h2>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <button onClick={handleValidate} className="btn-candy-small" style={{background: '#ffcc00', color: '#000'}}>Validate</button>
                    <button onClick={generateCode} className="btn-candy-small" disabled={!validationResult?.isSolvable} style={{opacity: validationResult?.isSolvable ? 1 : 0.5}}>Export</button>
                </div>
            </div>
            
            {validationResult && (
                <div style={{padding: '0.5rem', textAlign: 'center', background: validationResult.error ? '#ffcccc' : (validationResult.isSolvable ? '#ccffcc' : '#ffcccc'), color: '#000', fontWeight: 'bold'}}>
                    {validationResult.error ? validationResult.error : (validationResult.isSolvable ? `Success! ${validationResult.validSolutions} valid paths found.` : "Impossible Level! No paths found.")}
                </div>
            )}
            
            <div className="toolbar" style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: '#fff'}}>
                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#f5f5f5', padding: '0.5rem', borderRadius: '8px'}}>
                    <button onClick={() => setActiveToolType('source')} className={`tool-btn ${activeToolType === 'source' ? 'active' : ''}`}>Source</button>
                    <button onClick={() => setActiveToolType('sink')} className={`tool-btn ${activeToolType === 'sink' ? 'active' : ''}`}>Sink</button>
                    <button onClick={() => setActiveToolType('modifier')} className={`tool-btn ${activeToolType === 'modifier' ? 'active' : ''}`}>Modifier</button>
                    
                    {(activeToolType === 'source' || activeToolType === 'sink') && (
                        <select value={customPairId} onChange={e => setCustomPairId(Number(e.target.value))} style={{padding: '0.2rem', borderRadius: '4px'}}>
                            <option value={1}>Color 1 (Red)</option>
                            <option value={2}>Color 2 (Blue)</option>
                            <option value={3}>Color 3 (Green)</option>
                        </select>
                    )}
                    {activeToolType === 'modifier' && (
                        <select value={customOp} onChange={e => setCustomOp(e.target.value)} style={{padding: '0.2rem', borderRadius: '4px'}}>
                            <option value="+">+</option>
                            <option value="-">-</option>
                            <option value="*">*</option>
                            <option value="/">/</option>
                            <option value="|x|">|x|</option>
                        </select>
                    )}
                    {(activeToolType === 'source' || activeToolType === 'sink' || (activeToolType === 'modifier' && customOp !== '|x|')) && (
                        <input type="number" value={customValue} onChange={e => setCustomValue(Number(e.target.value))} style={{width: '60px', padding: '0.2rem', borderRadius: '4px'}} />
                    )}
                </div>
                
                <button onClick={() => setActiveToolType('void')} className={`tool-btn ${activeToolType === 'void' ? 'active' : ''}`}>Wall</button>
                <button onClick={() => setActiveToolType('ice')} className={`tool-btn ${activeToolType === 'ice' ? 'active' : ''}`}>Ice</button>
                <button onClick={() => setActiveToolType('conveyor')} className={`tool-btn ${activeToolType === 'conveyor' ? 'active' : ''}`}>Conveyor</button>
                <button onClick={clearGrid} className="tool-btn" style={{background: '#ff3366', color: '#fff', marginLeft: 'auto'}}>Clear Grid</button>
            </div>

            <div className="puzzle-section" style={{background: '#ffe6f2'}}>
                <div className="grid-container" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)`, background: '#fff', border: '8px solid #ff99cc', borderRadius: '16px' }}>
                    {grid.map((row, r) => row.map((cell, c) => (
                        <div key={`${r}-${c}`} className="grid-cell candy-cell" onClick={() => handleCellClick(r, c)} style={{border: '1px solid #ffccdd'}}>
                            {cell?.type === 'source' && <div className="candy-node" style={{background: '#ff3366'}}>{cell.value}</div>}
                            {cell?.type === 'sink' && <div className="candy-sink" style={{borderColor: '#ff3366'}}>{cell.target}</div>}
                            {cell?.type === 'modifier' && <div className="candy-modifier">{cell.display}</div>}
                            {cell?.type === 'void' && <div className="candy-wall"></div>}
                            {cell?.type === 'ice' && <div className="candy-ice">❄️</div>}
                            {cell?.type === 'conveyor' && <div className="candy-conveyor">▶</div>}
                        </div>
                    )))}
                </div>
            </div>
        </motion.div>
    );
};

export default LevelArchitect;
