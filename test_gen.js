import { generateLevel } from './src/LevelGenerator.js';
for (let i = 0; i < 100; i++) {
    const r = generateLevel(4, 1);
    if (!r) {
        console.log("FAILED ON ITERATION " + i);
        process.exit(1);
    }
}
console.log("Passed 100 times");
