<template>
    <div class="w-full flex items-center justify-center bg-white p-4 select-none">
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
            <linearGradient id="puzzleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#4338CA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#4F46E5;stop-opacity:1" />
            </linearGradient>
          </defs>
  
          <g :transform="`translate(${50}, ${25})`">
            <template v-for="(piece, index) in puzzlePieces" :key="piece.id">
              <g 
                :transform="`translate(${index * 120 + piece.offsetX}, ${piece.offsetY})`"
                @mouseenter="handlePieceHover(index, true)"
                @mouseleave="handlePieceHover(index, false)"
                @click="handlePieceClick(index)"
              >
                <path
                  :d="'M0,0 h120 v120 h-120 Z'"
                  :fill="piece.isHovered ? 'url(#puzzleGradient)' : '#4F46E5'"
                  class="transition-colors duration-300"
                />
                <text
                  x="60"
                  y="65"
                  class="text-7xl font-serif fill-white"
                  text-anchor="middle"
                  dominant-baseline="middle"
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
  import { ref, onMounted } from 'vue';
  
  interface PuzzlePiece {
    id: string;
    letter: string;
    delay: number;
    animationDuration: number;
    easing: string;
    offsetX: number;
    offsetY: number;
    isHovered: boolean;
  }
  
  const isAnimationComplete = ref(false);
  const puzzlePieces = ref<PuzzlePiece[]>([
    { id: 'p1', letter: 'B', delay: 0, animationDuration: 1.2, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
    { id: 'p2', letter: 'u', delay: 0.2, animationDuration: 1.1, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
    { id: 'p3', letter: 'i', delay: 0.4, animationDuration: 1.0, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
    { id: 'p4', letter: 'l', delay: 0.6, animationDuration: 0.9, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
    { id: 'p5', letter: 'd', delay: 0.8, animationDuration: 0.8, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
    { id: 'p6', letter: 'r', delay: 1.0, animationDuration: 0.7, easing: 'ease', offsetX: 0, offsetY: 0, isHovered: false },
  ]);
  
  onMounted(() => {
    puzzlePieces.value.forEach((piece, index) => {
      const initialX = Math.random() * 200 - 100;
      const initialY = Math.random() * 200 - 100;
      piece.offsetX = initialX;
      piece.offsetY = initialY;
      setTimeout(() => {
        piece.offsetX = 0;
        piece.offsetY = 0;
        if (index === puzzlePieces.value.length - 1) {
          isAnimationComplete.value = true;
        }
      }, 1500 + piece.delay * 1000);
    });
  });
  
  const handleMouseMove = () => {};
  const handleMouseLeave = () => {};
  const handlePieceHover = (index: number, isHovered: boolean) => {
    puzzlePieces.value[index].isHovered = isHovered;
  };
  const handlePieceClick = (index: number) => {};
  </script>
  
  <style scoped>
  </style>
  