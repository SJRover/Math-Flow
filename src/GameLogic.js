export const COLOR_MAP = {
  'red': 1,
  'blue': 2,
  'green': 3,
  'yellow': 4,
  'purple': 5
};

const rawPuzzles = [
  {
    id: 1,
    size: 5,
    nodes: [
      { id: 'A', positions: [0, 9], color: 'red' },
      { id: 'B', positions: [14, 22], color: 'blue' },
      { id: 'C', positions: [6, 21], color: 'green' },
      { id: 'D', positions: [7, 12], color: 'yellow' }
    ]
  },
  {
    id: 2,
    size: 5,
    nodes: [
      { id: 'A', positions: [0, 14], color: 'red' },
      { id: 'B', positions: [19, 20], color: 'blue' },
      { id: 'C', positions: [8, 15], color: 'green' },
      { id: 'D', positions: [12, 13], color: 'yellow' }
    ]
  },
  {
    id: 3,
    size: 5,
    nodes: [
      { id: 'A', positions: [0, 16], color: 'red' },
      { id: 'B', positions: [11, 23], color: 'blue' },
      { id: 'C', positions: [18, 24], color: 'green' }
    ]
  }
];

// Helper to convert 1D index puzzles to 2D grid matrix
export function getPuzzleGrid(puzzleId) {
  const p = rawPuzzles.find(x => x.id === puzzleId) || rawPuzzles[0];
  const grid = Array(p.size).fill().map(() => Array(p.size).fill(0));
  
  p.nodes.forEach(node => {
    const numId = COLOR_MAP[node.color];
    node.positions.forEach(pos => {
      const r = Math.floor(pos / p.size);
      const c = pos % p.size;
      grid[r][c] = numId;
    });
  });
  return { grid, numPairs: p.nodes.length };
}

export const getTotalPuzzles = () => rawPuzzles.length;

/**
 * Calculates a beast drop based on the defined rarity probabilities:
 * Common (60%), Uncommon (25%), Rare (10%), Epic (4%), Legendary (1%)
 */
export function calculateDrop() {
  const rand = Math.random();
  if (rand < 0.60) return 'Common';
  if (rand < 0.85) return 'Uncommon';
  if (rand < 0.95) return 'Rare';
  if (rand < 0.99) return 'Epic';
  return 'Legendary';
}
