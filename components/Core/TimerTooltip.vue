<template>
    <div class="timer-container">
      <p class="timer-label">{{ label }}</p>
      <div
        class="timer-box"
        @mouseover="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="timer-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12a10 10 0 1118.32 6.906l2.387 2.388a1 1 0 01-1.414 1.414l-2.388-2.387A10 10 0 012 12zm9-3a1 1 0 112 0v3h2a1 1 0 110 2h-3a1 1 0 01-1-1V9z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="timer-text ml-3">{{ formattedTime }}</span>
        <div v-if="showTooltip" class="tooltip">
          <div class="tooltip-arrow"></div>
          <div class="tooltip-content">
            <p class="tooltip-title">{{ tooltipTitle }}</p>
            <p class="tooltip-text">{{ tooltipMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue';
  
  // Define the props for the component to make it reusable
  const props = defineProps<{
    label?: string;
    tooltipTitle?: string;
    tooltipMessage?: string;
  }>();
  
  // Set default values if props are not provided
  const label = props.label || 'Timer';
  const tooltipTitle = props.tooltipTitle || 'Response Timer';
  const tooltipMessage =
    props.tooltipMessage ||
    'This timer helps you track how long it takes for a service provider to accept or approve a request.';
  
  const showTooltip = ref(false);
  
  // Timer state
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  
  // Computed property to format the timer display
  const formattedTime = computed(() => {
    const formatNumber = (num: number) => String(num).padStart(2, '0');
    return `${formatNumber(hours.value)} : ${formatNumber(minutes.value)} : ${formatNumber(seconds.value)}`;
  });
  
  // Start the timer when the component mounts
  let timerInterval: number;
  
  onMounted(() => {
    timerInterval = setInterval(() => {
      seconds.value += 1;
      if (seconds.value === 60) {
        seconds.value = 0;
        minutes.value += 1;
      }
      if (minutes.value === 60) {
        minutes.value = 0;
        hours.value += 1;
      }
    }, 1000);
  });
  
  // Clear the interval when the component unmounts
  onUnmounted(() => {
    clearInterval(timerInterval);
  });
  </script>
  
  <style scoped>
  .timer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  
  .timer-label {
    color: #6e7687;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .timer-box {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f4f5f7;
    border-radius: 0.5rem;
    position: relative;
    cursor: pointer;
  }
  
  .timer-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #6e7687;
    margin-right: 0.5rem;
  }
  
  .timer-text {
    color: #6e7687;
    font-size: 1.25rem;
    font-weight: bold;
  }
  
  .tooltip {
    position: absolute;
    top: 110%; /* Position below the timer */
    left: 50%;
    transform: translateX(-50%);
    background-color: #1d2739;
    color: #fff;
    padding: 0.75rem;
    border-radius: 0.5rem;
    width: 16rem;
    max-width: 90vw;
    text-align: left;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .tooltip-arrow {
    position: absolute;
    top: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1rem;
    height: 1rem;
    background-color: #1d2739;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
  }
  
  .tooltip-content {
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .tooltip-title {
    font-weight: bold;
    margin-bottom: 0.25rem;
  }
  
  .tooltip-text {
    color: #cfd8dc;
  }
  
  /* Responsive styling */
  @media (max-width: 768px) {
    .timer-text {
      font-size: 1rem;
    }
  
    .tooltip {
      width: 14rem;
    }
  }
  
  @media (max-width: 480px) {
    .tooltip {
      font-size: 0.75rem;
      padding: 0.5rem;
    }
  
    .tooltip-title {
      font-size: 0.875rem;
    }
  }
  </style>
  