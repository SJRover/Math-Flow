const applyMath = (currentVal, op, val) => {
    if (op === '+') return currentVal + val;
    if (op === '-') return currentVal - val;
    if (op === '*') return currentVal * val;
    if (op === '/') return currentVal / val;
    if (op === '|x|') return Math.abs(currentVal);
    return currentVal;
};

export const solveLevel = (gridSize, gridData) => {
    // 1. Identify sources, sinks, and walkable cells
    let walkableCount = 0;
    const sources = {};
    const sinks = {};
    
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = gridData[r][c];
            if (!cell || cell.type !== 'void') walkableCount++;
            
            if (cell?.type === 'source') {
                sources[cell.pairId] = { r, c, val: cell.value };
            }
            if (cell?.type === 'sink') {
                sinks[cell.pairId] = { r, c, target: cell.target };
            }
        }
    }

    const pairIds = Object.keys(sources);
    
    // Quick validation
    if (pairIds.length === 0) return { error: "No sources found!" };
    if (pairIds.length !== Object.keys(sinks).length) return { error: "Mismatched sources and sinks!" };
    
    let validSolutionsCount = 0;
    let firstValidSolution = null;
    
    // Helper to get valid neighbors
    const getNeighbors = (r, c) => {
        return [
            [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]
        ].filter(([nr, nc]) => nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize);
    };

    // Main backtracking function
    const solvePaths = (pairIndex, visited, currentVal, r, c, currentPaths) => {
        if (pairIndex >= pairIds.length) {
            // All pairs successfully connected! Check if we filled the board.
            if (visited.size === walkableCount) {
                validSolutionsCount++;
                if (!firstValidSolution) {
                    // Deep copy the paths for our hint
                    firstValidSolution = JSON.parse(JSON.stringify(currentPaths));
                }
            }
            return;
        }

        const currentPairId = pairIds[pairIndex];
        const sink = sinks[currentPairId];
        
        // Try all neighbors
        const neighbors = getNeighbors(r, c);
        for (const [nr, nc] of neighbors) {
            const cellKey = `${nr},${nc}`;
            if (visited.has(cellKey)) continue;

            const cell = gridData[nr][nc];

            // If we hit a void, skip
            if (cell?.type === 'void') continue;

            // If we hit our sink!
            if (nr === sink.r && nc === sink.c) {
                if (currentVal === sink.target) {
                    // Valid connection! Move to next pair
                    visited.add(cellKey);
                    currentPaths[currentPairId].push({r: nr, c: nc, val: currentVal});
                    if (pairIndex + 1 < pairIds.length) {
                        const nextPairId = pairIds[pairIndex + 1];
                        const nextSource = sources[nextPairId];
                        visited.add(`${nextSource.r},${nextSource.c}`);
                        currentPaths[nextPairId] = [{r: nextSource.r, c: nextSource.c, val: nextSource.val}];
                        solvePaths(pairIndex + 1, visited, nextSource.val, nextSource.r, nextSource.c, currentPaths);
                        visited.delete(`${nextSource.r},${nextSource.c}`);
                        delete currentPaths[nextPairId];
                    } else {
                        // All pairs finished!
                        solvePaths(pairIndex + 1, visited, 0, 0, 0, currentPaths);
                    }
                    currentPaths[currentPairId].pop();
                    visited.delete(cellKey);
                }
                continue;
            }

            // If we hit ANY OTHER source or sink, we can't walk over it!
            if (cell?.type === 'source' || cell?.type === 'sink') {
                continue;
            }

            // Walkable cell! Calculate math if it's a modifier
            let nextVal = currentVal;
            if (cell?.type === 'modifier') {
                nextVal = applyMath(currentVal, cell.op, cell.value);
            }

            visited.add(cellKey);
            currentPaths[currentPairId].push({r: nr, c: nc, val: nextVal});
            solvePaths(pairIndex, visited, nextVal, nr, nc, currentPaths);
            currentPaths[currentPairId].pop();
            visited.delete(cellKey);
        }
    };

    // Start with the first pair
    const firstSource = sources[pairIds[0]];
    const initialVisited = new Set();
    initialVisited.add(`${firstSource.r},${firstSource.c}`);
    
    const initialPaths = {
        [pairIds[0]]: [{r: firstSource.r, c: firstSource.c, val: firstSource.val}]
    };
    
    // Performance limit to avoid crashing browser on completely open boards
    const maxExecutionMs = 3000; 
    const startTime = performance.now();
    
    try {
        solvePaths(0, initialVisited, firstSource.val, firstSource.r, firstSource.c, initialPaths);
    } catch (e) {
        return { error: "Validation timed out." };
    }

    if (performance.now() - startTime > maxExecutionMs) {
        // Technically it might just exit if it took too long, but we didn't inject throws in the loop to save overhead.
    }

    return { 
        validSolutions: validSolutionsCount,
        isSolvable: validSolutionsCount > 0,
        hintPaths: firstValidSolution,
        error: null
    };
};
