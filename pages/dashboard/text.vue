<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-2xl relative" ref="containerRef">
      <svg viewBox="0 0 600 120" class="w-full">
        <defs>
          <path 
            id="puzzleConnector" 
            d="M0,0 h60 a10,10 0 0 1 10,10 v20 a5,5 0 0 0 10,0 v-20 a10,10 0 0 1 10,-10 h10 v80 h-10 a10,10 0 0 1 -10,10 v20 a5,5 0 0 1 -10,0 v-20 a10,10 0 0 1 -10,-10 h-60 a10,10 0 0 1 -10,-10 v-20 a5,5 0 0 0 -10,0 v20 a10,10 0 0 1 -10,10 v-80 a10,10 0 0 1 10,-10 v20 a5,5 0 0 0 10,0 v-20 a10,10 0 0 1 10,-10 Z"
          />
        </defs>


        <g ref="puzzleContainer">
          <template v-for="(letter, index) in letters" :key="letter.id">
            <g 
              :ref="el => puzzlePieces[index] = el"
              class="puzzle-piece cursor-pointer"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >

              <use 
                href="#puzzleConnector"
                class="piece-bg transition-colors duration-300"
                fill="#4F46E5"
                />

              <text
                x="45"
                y="45"
                text-anchor="middle"
                dominant-baseline="middle"
                class="fill-white text-6xl font-black font-serif select-none"
              >
                {{ letter.char }}
              </text>
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

interface PuzzleLetter {
  id: number;
  char: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

const containerRef = ref<HTMLDivElement | null>(null)
const puzzleContainer = ref<SVGGElement | null>(null)
const puzzlePieces = ref<SVGGElement[]>([])

// Generate random initial positions
const letters: PuzzleLetter[] = ['B', 'u', 'i', 'l', 'd', 'r'].map((char, index) => ({
  id: index,
  char,
  initialX: Math.random() * 400 - 200,
  initialY: Math.random() * 400 - 200,
  rotation: Math.random() * 360
}))

// Initialize GSAP animations
onMounted(() => {
  // Set initial positions
  letters.forEach((letter, index) => {
    if (puzzlePieces.value[index]) {
      gsap.set(puzzlePieces.value[index], {
        x: letter.initialX,
        y: letter.initialY,
        rotation: letter.rotation,
        opacity: 0,
        scale: 0.5
      })
    }
  })

  // Create timeline for assembly animation
  const tl = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'elastic.out(1, 0.5)'
    }
  })

  // Animate each piece into place
  letters.forEach((_, index) => {
    const piece = puzzlePieces.value[index]
    if (piece) {
      tl.to(piece, {
        x: index * 95,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'elastic.out(1, 0.5)',
        stagger: {
          each: 0.1,
          from: 'random'
        }
      }, index * 0.2)
    }
  })
})

// Hover animations
const handleHover = (index: number) => {
  if (puzzlePieces.value[index]) {
    gsap.to(puzzlePieces.value[index], {
      y: -10,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

const handleHoverOut = (index: number) => {
  if (puzzlePieces.value[index]) {
    gsap.to(puzzlePieces.value[index], {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })
  }
}
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->

<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 800 400" class="w-full">
        <defs>
          <path
            id="puzzlePiece"
            d="M0,0 h100 
               a10,10 0 0 1 10,10 
               v20 
               a10,10 0 0 0 20,0 
               v-20 
               a10,10 0 0 1 10,-10 
               h100 
               a10,10 0 0 1 10,10 
               v100 
               a10,10 0 0 1 -10,10 
               h-20 
               a10,10 0 0 0 0,20 
               h20 
               a10,10 0 0 1 10,10 
               v100 
               a10,10 0 0 1 -10,10 
               h-100 
               a10,10 0 0 1 -10,-10 
               v-20 
               a10,10 0 0 0 -20,0 
               v20 
               a10,10 0 0 1 -10,10 
               h-100 
               a10,10 0 0 1 -10,-10 
               v-100 
               a10,10 0 0 1 10,-10 
               h20 
               a10,10 0 0 0 0,-20 
               h-20 
               a10,10 0 0 1 -10,-10 
               v-100 
               a10,10 0 0 1 10,-10 Z"
          />
        </defs>

        <g ref="puzzleContainer">
          <template v-for="(letter, index) in letters" :key="letter.id">
            <g
              :ref="el => puzzlePieces[index] = el"
              class="puzzle-piece cursor-pointer"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
              :transform="`translate(${(index % cols) * 120}, ${Math.floor(index / cols) * 120})`"
            >
              <use
                href="#puzzlePiece"
                class="piece-bg transition-colors duration-300"
                fill="#4F46E5"
              />
              <text
                x="100"
                y="100"
                text-anchor="middle"
                dominant-baseline="middle"
                class="fill-white text-6xl font-black font-serif select-none"
              >
                {{ letter.char }}
              </text>
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

interface PuzzleLetter {
  id: number;
  char: string;
}

const containerRef = ref<HTMLDivElement | null>(null);
const puzzleContainer = ref<SVGGElement | null>(null);
const puzzlePieces = ref<SVGGElement[]>([]);

// Rows and columns for the grid
const rows = 2;
const cols = 3;

// Puzzle letters
const letters: PuzzleLetter[] = ['B', 'u', 'i', 'l', 'd', 'r'].map((char, index) => ({
  id: index,
  char,
}));

// Animate puzzle assembly on mount
onMounted(() => {
  const tl = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    },
  });

  letters.forEach((_, index) => {
    const piece = puzzlePieces.value[index];
    if (piece) {
      const targetX = (index % cols) * 120;
      const targetY = Math.floor(index / cols) * 120;

      gsap.set(piece, {
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        opacity: 0,
        scale: 0.5,
      });

      tl.to(piece, {
        x: targetX,
        y: targetY,
        opacity: 1,
        scale: 1,
        rotation: 0,
      }, index * 0.2);
    }
  });
});

// Hover animations
const handleHover = (index: number) => {
  if (puzzlePieces.value[index]) {
    gsap.to(puzzlePieces.value[index], {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

const handleHoverOut = (index: number) => {
  if (puzzlePieces.value[index]) {
    gsap.to(puzzlePieces.value[index], {
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }
};
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->


<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 720 360" class="w-full">
        <defs>
          <path
            id="puzzlePiece"
            d="M0,0 h80 
               a8,8 0 0 1 8,8 
               v16 
               a8,8 0 0 0 16,0 
               v-16 
               a8,8 0 0 1 8,-8 
               h80 
               a8,8 0 0 1 8,8 
               v80 
               a8,8 0 0 1 -8,8 
               h-16 
               a8,8 0 0 0 0,16 
               h16 
               a8,8 0 0 1 8,8 
               v80 
               a8,8 0 0 1 -8,8 
               h-80 
               a8,8 0 0 1 -8,-8 
               v-16 
               a8,8 0 0 0 -16,0 
               v16 
               a8,8 0 0 1 -8,8 
               h-80 
               a8,8 0 0 1 -8,-8 
               v-80 
               a8,8 0 0 1 8,-8 
               h16 
               a8,8 0 0 0 0,-16 
               h-16 
               a8,8 0 0 1 -8,-8 
               v-80 
               a8,8 0 0 1 8,-8 Z"
          />
        </defs>

        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzleGrid" :key="`${piece.row}-${piece.col}`">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.col * 96}, ${piece.row * 96})`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >

              <use
                href="#puzzlePiece"
                class="piece-bg transition-colors duration-300"
                fill="#4F46E5"
              />
            </g>
          </template>

          <template v-for="(letter, index) in letters" :key="`letter-${index}`">
            <text
              :x="(index % 6) * 96 + 48"
              :y="(Math.floor(index / 6) + 1) * 96 + 60"
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-white text-5xl font-black font-serif select-none"
            >
              {{ letter }}
            </text>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const rows = 3;
const cols = 6;
const letters = ['B', 'u', 'i', 'l', 'd', 'r'];

// Generate grid positions
const puzzleGrid = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    puzzleGrid.push({ row, col });
  }
}

// Hover animations
const handleHover = (index: number) => {
  const piece = puzzleGrid[index];
  if (piece) {
    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

const handleHoverOut = (index: number) => {
  const piece = puzzleGrid[index];
  if (piece) {
    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }
};

// Animate puzzle assembly on mount
onMounted(() => {
  const tl = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    },
  });

  puzzleGrid.forEach((_, index) => {
    const piece = puzzleGrid[index];
    if (piece) {
      const targetX = piece.col * 96;
      const targetY = piece.row * 96;

      gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        opacity: 0,
        scale: 0.5,
      });

      tl.to(`.puzzle-piece:nth-child(${index + 1})`, {
        x: targetX,
        y: targetY,
        opacity: 1,
        scale: 1,
        rotation: 0,
      }, index * 0.1);
    }
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->

<!-- 
<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 360" class="w-full">
        <defs>
          <path
            id="puzzlePiece"
            d="M0,0 h80 
               a8,8 0 0 1 8,8 
               v16 
               a8,8 0 0 0 16,0 
               v-16 
               a8,8 0 0 1 8,-8 
               h80 
               a8,8 0 0 1 8,8 
               v80 
               a8,8 0 0 1 -8,8 
               h-16 
               a8,8 0 0 0 0,16 
               h16 
               a8,8 0 0 1 8,8 
               v80 
               a8,8 0 0 1 -8,8 
               h-80 
               a8,8 0 0 1 -8,-8 
               v-16 
               a8,8 0 0 0 -16,0 
               v16 
               a8,8 0 0 1 -8,8 
               h-80 
               a8,8 0 0 1 -8,-8 
               v-80 
               a8,8 0 0 1 8,-8 
               h16 
               a8,8 0 0 0 0,-16 
               h-16 
               a8,8 0 0 1 -8,-8 
               v-80 
               a8,8 0 0 1 8,-8 Z"
          />
        </defs>


        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzleGrid" :key="`${piece.row}-${piece.col}`">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.col * 95 + 10}, ${
                piece.row < 2 ? piece.row * 95 + 10 : piece.row * 70 + 10
              })`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >
              <use
                href="#puzzlePiece"
                class="piece-bg transition-colors duration-300"
                fill="#4F46E5"
              />
            </g>
          </template>

          <template v-for="(letter, index) in letters" :key="`letter-${index}`">
            <text
              :x="(index % 6) * 95 + 55"
              :y="(Math.floor(index / 6) + 1.5) * 95"
              text-anchor="middle"
              dominant-baseline="middle"
              class="fill-white text-[6rem] font-black font-serif select-none"
            >
              {{ letter }}
            </text>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

// Puzzle grid and dimensions
const rows = 3;
const cols = 6;
const letters = ['B', 'u', 'i', 'l', 'd', 'r'];

// Generate grid positions
const puzzleGrid = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    puzzleGrid.push({ row, col });
  }
}

// Hover animations
const handleHover = (index: number) => {
  const piece = puzzleGrid[index];
  if (piece) {
    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      scale: 1.1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
};

const handleHoverOut = (index: number) => {
  const piece = puzzleGrid[index];
  if (piece) {
    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }
};

// Animate puzzle assembly on mount
onMounted(() => {
  const tl = gsap.timeline({
    defaults: {
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
    },
  });

  puzzleGrid.forEach((_, index) => {
    const piece = puzzleGrid[index];
    if (piece) {
      const targetX = piece.col * 95 + 10;
      const targetY = piece.row < 2 ? piece.row * 95 + 10 : piece.row * 70 + 10;

      gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        opacity: 0,
        scale: 0.5,
      });

      tl.to(`.puzzle-piece:nth-child(${index + 1})`, {
        x: targetX,
        y: targetY,
        opacity: 1,
        scale: 1,
        rotation: 0,
      }, index * 0.1);
    }
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->
<!-- 
<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 200" class="w-full">
        <defs>
          <pattern id="pattern-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
          </pattern>
        </defs>

        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzleGrid" :key="`${piece.row}-${piece.col}`">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.col * (pieceWidth - overlap)}, 0)`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >
              <path
                :d="generatePuzzlePath(piece.col)"
                class="piece-bg transition-colors duration-300"
                fill="#4F46E5"
                stroke="#4338CA"
                stroke-width="0.5"
              />
              <rect
                x="5"
                y="5"
                :width="pieceWidth - 10"
                :height="pieceHeight - 10"
                fill="url(#pattern-grid)"
              />
              <text
                :x="pieceWidth / 2"
                :y="pieceHeight / 2"
                text-anchor="middle"
                dominant-baseline="middle"
                class="fill-white text-7xl font-serif select-none"
                style="text-shadow: 2px 2px 4px rgba(0,0,0,0.2)"
              >
                {{ letters[index] }}
              </text>
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import gsap from 'gsap';

const pieceWidth = 150;
const pieceHeight = 150;
const overlap = 15;
const cols = 6;
const letters = ['B', 'u', 'i', 'l', 'd', 'r'];

// Generate grid positions
const puzzleGrid = letters.map((_, col) => ({ col }));

// Generate puzzle piece path
const generatePuzzlePath = (col: number) => {
  const w = pieceWidth;
  const h = pieceHeight;
  const tabSize = 20;
  
  let path = `M0,0`;
  
  // Top edge
  path += `h${w}`;
  
  // Right edge
  if (col < cols - 1) {
    path += `v${h/2 - tabSize}`;
    path += `c0,${tabSize} ${tabSize},${tabSize} ${tabSize},0`;
    path += `v${h/2 + tabSize}`;
  } else {
    path += `v${h}`;
  }
  
  // Bottom edge
  path += `h-${w}`;
  
  // Left edge
  if (col > 0) {
    path += `v-${h/2 - tabSize}`;
    path += `c0,-${tabSize} -${tabSize},-${tabSize} -${tabSize},0`;
    path += `v-${h/2 - tabSize}`;
  } else {
    path += `v-${h}`;
  }
  
  return path + 'Z';
};

const handleHover = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    y: -5,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleHoverOut = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    y: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
  });
};

onMounted(() => {
  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'elastic.out(1, 0.5)' }
  });

  puzzleGrid.forEach((_, index) => {
    gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
      y: Math.random() * 200 - 100,
      opacity: 0,
      scale: 0.5,
    });

    tl.to(`.puzzle-piece:nth-child(${index + 1})`, {
      y: 0,
      opacity: 1,
      scale: 1,
    }, index * 0.1);
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->

<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 400" class="w-full">
        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzlePieces" :key="index">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.x}, ${piece.y})`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >
              <path
                :d="generatePuzzlePath(piece)"
                class="piece-bg"
                fill="#4F46E5"
                stroke="white"
                stroke-width="1"
              />
              <text
                v-if="piece.letter"
                :x="pieceSize / 2"
                :y="pieceSize / 2"
                text-anchor="middle"
                dominant-baseline="middle"
                class="fill-white text-7xl font-serif select-none"
              >
                {{ piece.letter }}
              </text>
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import gsap from 'gsap';

const pieceSize = 120;
const spacing = 4;
const letters = 'Buildr'.split('');

interface PuzzlePiece {
  row: number;
  col: number;
  x: number;
  y: number;
  letter?: string;
  hasTop: boolean;
  hasRight: boolean;
  hasBottom: boolean;
  hasLeft: boolean;
}

const puzzlePieces = computed(() => {
  const pieces: PuzzlePiece[] = [];
  const rows = 3;
  const cols = 7;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        row,
        col,
        x: col * (pieceSize + spacing),
        y: row * (pieceSize + spacing),
        letter: row === 1 ? letters[col] : undefined,
        hasTop: row > 0,
        hasRight: col < cols - 1,
        hasBottom: row < rows - 1,
        hasLeft: col > 0
      });
    }
  }
  return pieces;
});

const generatePuzzlePath = (piece: PuzzlePiece) => {
  const s = pieceSize;
  const t = s / 4; // tab size
  let path = `M 0,0`;

  // Top edge
  if (piece.hasTop) {
    path += `h${s/2 - t} q${t},0 ${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} h${s/2 - t}`;
  } else {
    path += `h${s}`;
  }

  // Right edge
  if (piece.hasRight) {
    path += `v${s/2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s/2 - t}`;
  } else {
    path += `v${s}`;
  }

  // Bottom edge
  if (piece.hasBottom) {
    path += `h-${s/2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} h-${s/2 - t}`;
  } else {
    path += `h-${s}`;
  }

  // Left edge
  if (piece.hasLeft) {
    path += `v-${s/2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} v-${s/2 - t}`;
  } else {
    path += `v-${s}`;
  }

  return path;
};

const handleHover = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleHoverOut = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
  });
};

onMounted(() => {
  puzzlePieces.value.forEach((_, index) => {
    gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 0,
      scale: 0.5,
      rotation: Math.random() * 90 - 45
    });

    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.05
    });
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.2));
}
</style> -->

<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 400" class="w-full">
        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzlePieces" :key="index">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.x}, ${piece.y})`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >
              <path
                :d="generatePuzzlePath(piece)"
                class="piece-bg"
                fill="#4F46E5"
                stroke="white"
                stroke-width="1"
              />
              <text
                v-if="piece.letter"
                :x="pieceSize / 2"
                :y="pieceSize / 2"
                text-anchor="middle"
                dominant-baseline="middle"
                class="fill-white font-serif select-none"
                style="font-size: 96px; z-index: 1000; position: relative;"
              >
                {{ piece.letter }}
              </text>
            </g>
          </template>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

const pieceSize = 120;
const spacing = 4;
const letters = 'Buildr'.split('');

interface PuzzlePiece {
  row: number;
  col: number;
  x: number;
  y: number;
  letter?: string;
  hasTop: boolean;
  hasRight: boolean;
  hasBottom: boolean;
  hasLeft: boolean;
}

const puzzlePieces = computed(() => {
  const pieces: PuzzlePiece[] = [];
  const rows = 3;
  const cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        row,
        col,
        x: col * (pieceSize + spacing),
        y: row * (pieceSize + spacing),
        letter: row === 1 ? letters[col] : undefined,
        hasTop: row > 0,
        hasRight: col < cols - 1,
        hasBottom: row < rows - 1,
        hasLeft: col > 0
      });
    }
  }
  return pieces;
});

const generatePuzzlePath = (piece: PuzzlePiece) => {
  const s = pieceSize;
  const t = s / 4; // tab size
  let path = `M 0,0`;

  // Top edge
  if (piece.hasTop) {
    path += `h${s/2 - t} q${t},0 ${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} h${s/2 - t}`;
  } else {
    path += `h${s}`;
  }

  // Right edge
  if (piece.hasRight) {
    path += `v${s/2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s/2 - t}`;
  } else {
    path += `v${s}`;
  }

  // Bottom edge
  if (piece.hasBottom) {
    path += `h-${s/2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} h-${s/2 - t}`;
  } else {
    path += `h-${s}`;
  }

  // Left edge
  if (piece.hasLeft) {
    path += `v-${s/2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} v-${s/2 - t}`;
  } else {
    path += `v-${s}`;
  }

  return path;
};

const handleHover = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleHoverOut = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
  });
};

onMounted(() => {
  puzzlePieces.value.forEach((_, index) => {
    gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 0,
      scale: 0.5,
      rotation: Math.random() * 90 - 45
    });

    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.05
    });
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.2));
}

text {
  font-size: 96px; /* Increased text size */
  font-weight: bold;
  z-index: 1000; /* Higher z-index to ensure text is on top */
}
</style>  -->

<!-- <template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 400" class="w-full">
        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzlePieces" :key="index">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.x}, ${piece.y})`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >

              <path
                :d="generatePuzzlePath(piece)"
                class="piece-bg"
                fill="#4F46E5"
                stroke="white"
                stroke-width="3"
              />
            </g>
          </template>
        </g>

        <text
          v-for="(letter, index) in letters"
          :key="index"
          :x="(index + 0.5) * (pieceSize + spacing)"
          :y="1.5 * (pieceSize + spacing)"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-white font-serif select-none prominent-text"
        >
          {{ letter }}
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

const pieceSize = 120;
const spacing = 0; // No spacing for seamless layout
const letters = 'Buildr'.split('');

interface PuzzlePiece {
  row: number;
  col: number;
  x: number;
  y: number;
  hasTop: boolean;
  hasRight: boolean;
  hasBottom: boolean;
  hasLeft: boolean;
}

const puzzlePieces = computed(() => {
  const pieces: PuzzlePiece[] = [];
  const rows = 3;
  const cols = 7;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        row,
        col,
        x: col * (pieceSize + spacing),
        y: row * (pieceSize + spacing),
        hasTop: row > 0,
        hasRight: col < cols - 1,
        hasBottom: row < rows - 1,
        hasLeft: col > 0,
      });
    }
  }
  return pieces;
});

const generatePuzzlePath = (piece: PuzzlePiece) => {
  const s = pieceSize;
  const t = s / 6; // Tab size
  let path = `M 0,0`;

  // Top edge
  if (piece.hasTop) {
    path += `h${s / 2 - t} q${t},0 ${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} q0,${t} ${t},${t} h${s / 2 - t}`;
  } else {
    path += `h${s}`;
  }

  // Right edge
  if (piece.hasRight) {
    path += `v${s / 2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s / 2 - t}`;
  } else {
    path += `v${s}`;
  }

  // Bottom edge
  if (piece.hasBottom) {
    path += `h-${s / 2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} q0,-${t} -${t},-${t} h-${s / 2 - t}`;
  } else {
    path += `h-${s}`;
  }

  // Left edge
  if (piece.hasLeft) {
    path += `v-${s / 2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} v-${s / 2 - t}`;
  } else {
    path += `v-${s}`;
  }

  return path;
};

const handleHover = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleHoverOut = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
  });
};

onMounted(() => {
  puzzlePieces.value.forEach((_, index) => {
    gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 0,
      scale: 0.5,
      rotation: Math.random() * 90 - 45,
    });

    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: index * 0.05,
    });
  });
});
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.2));
}

.prominent-text {
  font-size: 120px; /* Large and bold text */
  font-weight: bold;
  z-index: 10;
  fill: white;
  pointer-events: none; /* Ensure text is not interactive */
}
</style> -->

<template>
  <div class="min-h-screen bg-white flex items-center justify-center p-4">
    <div class="w-full max-w-4xl relative" ref="containerRef">
      <svg viewBox="0 0 900 400" class="w-full">
        <g ref="puzzleContainer">
          <template v-for="(piece, index) in puzzlePieces" :key="index">
            <g
              class="puzzle-piece cursor-pointer"
              :transform="`translate(${piece.x}, ${piece.y})`"
              @mouseenter="handleHover(index)"
              @mouseleave="handleHoverOut(index)"
            >
              <!-- Puzzle Path -->
              <path
                :d="generatePuzzlePath(piece)"
                class="piece-bg"
                fill="#4F46E5"
                stroke="white"
                stroke-width="0.8"
              />
            </g>
          </template>
        </g>
        <!-- Text Layer -->
        <text
          :x="puzzleWidth / 2"
          :y="puzzleHeight - pieceSize / 3"
          text-anchor="middle"
          dominant-baseline="middle"
          class="fill-white font-serif select-none prominent-text"
        >
          {{ letters.join('') }} <!-- Join array to display as a single string -->
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import gsap from 'gsap';

const pieceSize = 120; // Size of each puzzle piece
const spacing = 0; // No spacing between pieces
const letters = 'Buildr'.split(''); // Split string into an array of characters

// Puzzle grid dimensions
const rows = 3;
const cols = 7;

const puzzleWidth = cols * pieceSize;
const puzzleHeight = rows * pieceSize;

interface PuzzlePiece {
  row: number;
  col: number;
  x: number;
  y: number;
  hasTop: boolean;
  hasRight: boolean;
  hasBottom: boolean;
  hasLeft: boolean;
}

const puzzlePieces = computed(() => {
  const pieces: PuzzlePiece[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        row,
        col,
        x: col * (pieceSize + spacing),
        y: row * (pieceSize + spacing),
        hasTop: row > 0,
        hasRight: col < cols - 1,
        hasBottom: row < rows - 1,
        hasLeft: col > 0,
      });
    }
  }
  return pieces;
});

const generatePuzzlePath = (piece: PuzzlePiece) => {
  const s = pieceSize; // Size of each puzzle piece
  const t = s / 6; // Tab size
  const r = t * 1.5; // Radius for the circular edges

  let path = `M 0,0`;

  // Top edge
  if (!piece.hasTop) {
    path += `h${s / 2 - r} a${r},${r} 0 0 1 ${r},-${r} a${r},${r} 0 0 1 ${r},${r} h${s / 2 - r}`;
  } else {
    path += `h${s / 2 - r} a${r},${r} 0 0 0 ${r},-${r} a${r},${r} 0 0 0 ${r},${r} h${s / 2 - r}`;
  }

  // Right edge
  if (!piece.hasRight) {
    path += `v${s / 2 - r} a${r},${r} 0 0 1 ${r},${r} a${r},${r} 0 0 1 -${r},${r} v${s / 2 - r}`;
  } else {
    path += `v${s / 2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s / 2 - t}`;
  }

  // Bottom edge
  if (!piece.hasBottom) {
    path += `h-${s / 2 - r} a${r},${r} 0 0 1 -${r},${r} a${r},${r} 0 0 1 -${r},-${r} h-${s / 2 - r}`;
  } else {
    path += `h-${s / 2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} q0,-${t} -${t},-${t} h-${s / 2 - t}`;
  }

  // Left edge
  if (!piece.hasLeft) {
    path += `v-${s / 2 - r} a${r},${r} 0 0 1 -${r},-${r} a${r},${r} 0 0 1 ${r},-${r} v-${s / 2 - r}`;
  } else {
    path += `v-${s / 2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} v-${s / 2 - t}`;
  }

  return path;
};


// const generatePuzzlePath = (piece: PuzzlePiece) => {
//   const s = pieceSize; // Piece size
//   const t = s / 6; // Tab size
//   const r = t * 1.5; // Radius for circular edges

//   let path = `M 0,0`;

//   // Top edge
//   if (!piece.hasTop) {
//     path += `h${s / 2 - r} a${r},${r} 0 0 1 ${r},-${r} a${r},${r} 0 0 1 ${r},${r} h${s / 2 - r}`;
//   } else {
//     path += `h${s / 2 - t} q${t},0 ${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} q0,${t} ${t},${t} h${s / 2 - t}`;
//   }

//   // Right edge
//   if (!piece.hasRight) {
//     path += `v${s / 2 - r} a${r},${r} 0 0 1 ${r},${r} a${r},${r} 0 0 1 -${r},${r} v${s / 2 - r}`;
//   } else {
//     path += `v${s / 2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s / 2 - t}`;
//   }

//   // Bottom edge
//   if (!piece.hasBottom) {
//     path += `h-${s / 2 - r} a${r},${r} 0 0 1 -${r},${r} a${r},${r} 0 0 1 -${r},-${r} h-${s / 2 - r}`;
//   } else {
//     path += `h-${s / 2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} q0,-${t} -${t},-${t} h-${s / 2 - t}`;
//   }

//   // Left edge
//   if (!piece.hasLeft) {
//     path += `v-${s / 2 - r} a${r},${r} 0 0 1 -${r},-${r} a${r},${r} 0 0 1 ${r},-${r} v-${s / 2 - r}`;
//   } else {
//     path += `v-${s / 2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} v-${s / 2 - t}`;
//   }

//   return path;
// };


// const generatePuzzlePath = (piece: PuzzlePiece) => {
//   const s = pieceSize;
//   const t = s / 6; // Tab size
//   let path = `M 0,0`;

//   // Top edge
//   if (piece.hasTop) {
//     path += `h${s / 2 - t} q${t},0 ${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} q0,${t} ${t},${t} h${s / 2 - t}`;
//   } else {
//     path += `h${s}`;
//   }

//   // Right edge
//   if (piece.hasRight) {
//     path += `v${s / 2 - t} q0,${t} ${t},${t} q${t},0 ${t},${t} q0,${t} -${t},${t} v${s / 2 - t}`;
//   } else {
//     path += `v${s}`;
//   }

//   // Bottom edge
//   if (piece.hasBottom) {
//     path += `h-${s / 2 - t} q-${t},0 -${t},${t} q0,${t} -${t},${t} q-${t},0 -${t},-${t} q0,-${t} -${t},-${t} h-${s / 2 - t}`;
//   } else {
//     path += `h-${s}`;
//   }

//   // Left edge
//   if (piece.hasLeft) {
//     path += `v-${s / 2 - t} q0,-${t} -${t},-${t} q-${t},0 -${t},-${t} q0,-${t} ${t},-${t} q${t},0 ${t},${t} v-${s / 2 - t}`;
//   } else {
//     path += `v-${s}`;
//   }

//   return path;
// };

const handleHover = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleHoverOut = (index: number) => {
  gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)',
  });
};

onMounted(() => {
  puzzlePieces.value.forEach((_, index) => {
    gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 0,
      scale: 0.5,
      rotation: Math.random() * 90 - 45,
    });

    gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 2, // Slower duration for each piece animation
      ease: 'elastic.out(1, 0.75)', // Smooth and slower easing
      delay: index * 0.15, // Increased delay for a slower sequence
    });
  });
});


// onMounted(() => {
//   puzzlePieces.value.forEach((_, index) => {
//     gsap.set(`.puzzle-piece:nth-child(${index + 1})`, {
//       opacity: 0,
//       scale: 0.5,
//       rotation: Math.random() * 90 - 45,
//     });

//     gsap.to(`.puzzle-piece:nth-child(${index + 1})`, {
//       opacity: 1,
//       scale: 1,
//       rotation: 0,
//       duration: 1,
//       ease: 'elastic.out(1, 0.5)',
//       delay: index * 0.05,
//     });
//   });
// });
</script>

<style scoped>
.piece-bg {
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.puzzle-piece:hover .piece-bg {
  filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.2));
}

.prominent-text {
  font-size: 190px; /* Large font size for prominence */
  font-weight: bold;
  z-index: 10;
  fill: white;
  pointer-events: none; /* Ensure text is not interactive */
}
</style>
