import { generateLevel } from '../src/LevelGenerator.js';

let failsafes = 0;
for (let i = 0; i < 100; i++) {
    // Hard level config max: 8x8, 5 pairs, minPath 6, useFormulas=true
    const data = generateLevel(8, 5, 6, true);
    if (data.solutionPaths.length === 0) {
        failsafes++;
    }
}
console.log(`Failsafe triggered: ${failsafes}/100 times`);
