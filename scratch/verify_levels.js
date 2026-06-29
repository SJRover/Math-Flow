import { generateLevel } from '../src/LevelGenerator.js';

let failed = 0;
for (let i = 0; i < 1000; i++) {
    const data = generateLevel(6, 3, 4, true);
    
    for (let p = 1; p <= data.numPairs; p++) {
        let path = data.solutionPaths[p - 1];
        let val = data.grid[path[0][0]][path[0][1]].value;
        
        for (let j = 1; j < path.length - 1; j++) {
            let mod = data.grid[path[j][0]][path[j][1]];
            if (mod.op === '+') val += mod.value;
            if (mod.op === '-') val -= mod.value;
            if (mod.op === '*') val *= mod.value;
            if (mod.op === '/') val /= mod.value;
            if (mod.op === '^2') val = val * val;
            if (mod.op === '2x') val = val * 2;
        }
        
        const target = data.grid[path[path.length - 1][0]][path[path.length - 1][1]].target;
        if (Math.round(val) !== Math.round(target)) {
            console.log(`Mismatch on pair ${p}! Calculated: ${val}, Target: ${target}`);
            failed++;
        }
    }
}
console.log(`Test complete. Failed: ${failed}/1000`);
