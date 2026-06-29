/**
 * Math Flow Free Level Generator
 */

const getNeighbors = (r, c, size) => {
    return [
        [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
    ].filter(([nr, nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size);
};

const allOps = [
    { op: '+', apply: (a, b) => a + b },
    { op: '-', apply: (a, b) => a - b },
    { op: '*', apply: (a, b) => a * b },
    { op: '/', apply: (a, b) => a / b },
    { op: '^2', apply: (a, b) => a * a },
    { op: '2x', apply: (a, b) => a * 2 }
];

const generateRandomModifier = (includeDiv, includeFormulas) => {
    const currentOps = [
        { op: '+', format: (val) => `+${val}` },
        { op: '-', format: (val) => `-${val}` },
        { op: '*', format: (val) => `x${val}` }
    ];
    if (includeDiv) {
        currentOps.push({ op: '/', format: (val) => `÷${val}` });
    }
    if (includeFormulas) {
        currentOps.push({ op: '^2', format: () => `x²` });
        currentOps.push({ op: '2x', format: () => `2x` });
    }
    
    const opType = currentOps[Math.floor(Math.random() * currentOps.length)];
    // Prevent division by 1 (boring), so division uses 2 to 5
    const opVal = Math.floor(Math.random() * (opType.op === '/' ? 4 : 5)) + (opType.op === '/' ? 2 : 1);
    
    return { type: 'modifier', pairId: null, op: opType.op, value: opVal, display: opType.format(opVal) };
};

export function generateLevel(size, numPairs, minPathLength = 4, includeFormulas = false) {
    let maxAttempts = 1000;
    const includeDiv = size >= 6; // Include division on Medium (6x6) and Hard (8x8)
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const grid = Array(size).fill(null).map(() => Array(size).fill(null));
        
        let paths = [];
        let validWalks = true;
        
        for (let p = 1; p <= numPairs; p++) {
            let allNull = [];
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (grid[r][c] === null) allNull.push([r, c]);
                }
            }
            
            if (allNull.length === 0) {
                validWalks = false;
                break;
            }
            
            let start = allNull[Math.floor(Math.random() * allNull.length)];
            let path = [start];
            grid[start[0]][start[1]] = { type: 'reserved_source', pairId: p };
            
            let current = start;
            while (true) {
                let neighbors = getNeighbors(current[0], current[1], size).filter(([nr, nc]) => grid[nr][nc] === null);
                if (neighbors.length === 0) break;
                
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                path.push(next);
                grid[next[0]][next[1]] = { type: 'reserved_path', pairId: p };
                current = next;
                
                if (path.length >= minPathLength && Math.random() < 0.3) break;
            }
            
            if (path.length < 3) {
                validWalks = false;
                break;
            }
            paths.push(path);
        }
        
        if (!validWalks) continue;
        
        // Fill remaining empty tiles with modifiers
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === null || grid[r][c].type === 'reserved_path') {
                    grid[r][c] = generateRandomModifier(includeDiv, includeFormulas);
                }
            }
        }
        
        let targetValues = {};
        
        // Set up sources and sinks, and calculate targets
        for (let p = 1; p <= numPairs; p++) {
            let path = paths[p - 1];
            let start = path[0];
            let sink = path[path.length - 1];
            
            let startVal = Math.floor(Math.random() * 10) + 1;
            grid[start[0]][start[1]] = { type: 'source', pairId: p, value: startVal };
            
            let currentVal = startVal;
            for (let i = 1; i < path.length - 1; i++) {
                let r = path[i][0];
                let c = path[i][1];
                let mod = grid[r][c];
                
                if (mod && mod.type === 'modifier') {
                    if (mod.op === '/') {
                        // Ensure it's cleanly divisible. If not, fallback to subtraction.
                        if (currentVal % mod.value !== 0) {
                            mod.op = '-';
                            mod.display = `-${mod.value}`;
                        }
                    }
                    if (mod.op === '^2') {
                        // Prevent astronomical unreadable numbers
                        if (currentVal > 50 || currentVal < -50 || (currentVal * currentVal) > 50) {
                            mod.op = '*';
                            mod.value = 2;
                            mod.display = `x2`;
                        }
                    }
                    let opObj = allOps.find(o => o.op === mod.op);
                    if (opObj) {
                        currentVal = opObj.apply(currentVal, mod.value);
                    }
                }
            }
            
            grid[sink[0]][sink[1]] = { type: 'sink', pairId: p, target: currentVal };
            targetValues[p] = currentVal;
        }
        
        return { grid, numPairs, gridSize: size, targetValues, solutionPaths: paths };
    }
    
    // Failsafe
    const fallbackGrid = Array(size).fill(null).map(() => Array(size).fill({ type: 'empty' }));
    fallbackGrid[0][0] = { type: 'source', pairId: 1, value: 5 };
    fallbackGrid[0][size - 1] = { type: 'sink', pairId: 1, target: 5 };
    return { grid: fallbackGrid, numPairs: 1, gridSize: size, targetValues: {1: 5}, solutionPaths: [] };
}

export default generateLevel;
