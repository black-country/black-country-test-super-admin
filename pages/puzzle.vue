<template>
  <div class="w-full min-h-screen bg-red-500 flex items-center justify-center bg-white p-4 select-none">
    <div 
      class="w-full max-w-3xl relative"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <svg 
        viewBox="0 0 800 200" 
        class="w-full"
        :class="{ 'cursor-pointer': isAnimationComplete }"
      >
        <defs>
          <!-- Enhanced puzzle piece shape with more detailed connections -->
          <path 
            id="puzzlePiece" 
            d="M0,0 
               h65 
               a8,8 0 0 1 8,8 
               v12 
               a12,12 0 0 0 24,0 
               v-12
               a8,8 0 0 1 8,-8
               h15
               v65
               a8,8 0 0 1 -8,8
               h-12
               a12,12 0 0 0 0,24
               h12
               a8,8 0 0 1 8,8
               v15
               h-120
               v-15
               a8,8 0 0 1 8,-8
               h12
               a12,12 0 0 0 0,-24
               h-12
               a8,8 0 0 1 -8,-8
               v-65
               Z"
          />
          
          <!-- Gradient definitions -->
          <linearGradient id="puzzleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4338CA;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4F46E5;stop-opacity:1" />
          </linearGradient>
          
          <!-- Shine effect -->
          <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0" />
            <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
          </linearGradient>
        </defs>

        <g :transform="`translate(${50}, ${25})`">
          <template v-for="(piece, index) in puzzlePieces" :key="piece.id">
            <g 
              :transform="`translate(${index * 120 + piece.offsetX}, ${piece.offsetY})`"
              :style="{
                transition: `all ${piece.animationDuration}s ${piece.easing}`,
                transitionDelay: `${piece.delay}s`,
                transform: getTransform(index, piece),
              }"
              @click="handlePieceClick(index)"
            >
              <!-- Background puzzle piece -->
              <path
                :d="piece.pathD || getPiecePath(index)"
                :fill="piece.isHovered ? 'url(#puzzleGradient)' : '#4F46E5'"
                class="transition-colors duration-300"
                :class="{ 
                  'hover:brightness-110': isAnimationComplete,
                  'filter drop-shadow-lg': piece.isHovered 
                }"
              />
              
              <!-- Shine effect -->
              <path
                v-if="piece.isHovered"
                :d="piece.pathD || getPiecePath(index)"
                fill="url(#shineGradient)"
                class="animate-shine"
                style="mix-blend-mode: overlay"
              />
              
              <!-- Letter -->
              <text
                :x="60"
                :y="65"
                class="text-7xl font-serif fill-white"
                text-anchor="middle"
                dominant-baseline="middle"
                :class="{
                  'animate-bounce': piece.isHovered && isAnimationComplete
                }"
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
interface PuzzlePiece {
  id: string;
  letter: string;
  delay: number;
  animationDuration: number;
  easing: string;
  offsetX: number;
  offsetY: number;
  isHovered: boolean;
  pathD?: string;
  initialPosition?: { x: number; y: number };
}

const isAnimationComplete = ref(false);
const puzzlePieces = ref<PuzzlePiece[]>([
  { id: 'p1', letter: 'B', delay: 0, animationDuration: 1.2, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
  { id: 'p2', letter: 'u', delay: 0.2, animationDuration: 1.1, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
  { id: 'p3', letter: 'i', delay: 0.4, animationDuration: 1.0, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
  { id: 'p4', letter: 'l', delay: 0.6, animationDuration: 0.9, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
  { id: 'p5', letter: 'd', delay: 0.8, animationDuration: 0.8, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
  { id: 'p6', letter: 'r', delay: 1.0, animationDuration: 0.7, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', offsetX: 0, offsetY: 0, isHovered: false },
]);

// Initialize with random positions
onMounted(() => {
  puzzlePieces.value = puzzlePieces.value.map(piece => ({
    ...piece,
    initialPosition: {
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    }
  }));
  
  // Set animation complete after all pieces are in place
  setTimeout(() => {
    isAnimationComplete.value = true;
  }, 2000);
});

const getTransform = (index: number, piece: PuzzlePiece) => {
  if (!piece.initialPosition) return '';
  
  const finalX = 0;
  const finalY = 0;
  const rotation = isAnimationComplete.value ? 0 : (Math.random() * 360);
  
  if (isAnimationComplete.value) {
    return `translate(${finalX}px, ${finalY}px) rotate(0deg)`;
  }
  
  return `translate(${piece.initialPosition.x}px, ${piece.initialPosition.y}px) rotate(${rotation}deg)`;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isAnimationComplete.value) return;
  
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  puzzlePieces.value = puzzlePieces.value.map((piece, index) => {
    const pieceX = index * 120 + 50;
    const pieceWidth = 120;
    
    return {
      ...piece,
      isHovered: x >= pieceX && x <= pieceX + pieceWidth
    };
  });
};

const handleMouseLeave = () => {
  puzzlePieces.value = puzzlePieces.value.map(piece => ({
    ...piece,
    isHovered: false
  }));
};

const handlePieceClick = (index: number) => {
  if (!isAnimationComplete.value) return;
  
  // Add bounce animation
  puzzlePieces.value[index].offsetY -= 10;
  setTimeout(() => {
    puzzlePieces.value[index].offsetY = 0;
  }, 200);
};
</script>

<style scoped>
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shine {
  animation: shine 2s infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}
</style>