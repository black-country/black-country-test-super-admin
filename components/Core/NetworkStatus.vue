<!-- components/NetworkStatus.vue -->
<template>
  <Transition name="slide-down">
    <div
      v-if="!isOnline || isSlowConnection"
      class="network-status-wrapper"
      role="alert"
      aria-live="assertive"
    >
      <div 
        class="network-status-alert"
        :class="{ 'offline': !isOnline, 'slow': isSlowConnection && isOnline }"
      >
        <div class="alert-inner">
          <div class="status-indicator">
            <div class="pulse-ring"></div>
            <div class="status-dot"></div>
          </div>
          
          <div class="content-wrapper">
            <div class="icon-message">
              <div class="icon-container">
                <svg v-if="!isOnline" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
                
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
              </div>
              
              <div class="message">
                <h3 v-if="!isOnline">Connection Lost</h3>
                <h3 v-else>Slow Connection</h3>
                
                <p v-if="!isOnline">
                  Unable to connect to the internet. Check your network settings.
                </p>
                <p v-else>
                  Your connection is slower than usual. Performance may be affected.
                </p>
              </div>
            </div>
            
            <button 
              class="retry-btn" 
              @click="handleRetry"
              :disabled="isRetrying"
              aria-label="Retry connection"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                :class="{ 'spinning': isRetrying }"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>{{ isRetrying ? 'Checking...' : 'Retry' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useNetworkStatus } from "@/composables/core/useNetworkStatus"
const { isOnline, isSlowConnection, checkConnection, testNetworkSpeed } = useNetworkStatus()
const isRetrying = ref(false)

const handleRetry = async () => {
  isRetrying.value = true
  checkConnection()
  await testNetworkSpeed()
  setTimeout(() => {
    isRetrying.value = false
  }, 1000)
}
</script>

<style scoped>
.network-status-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 0.875rem 1rem;
  pointer-events: none;
}

.network-status-alert {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  box-shadow: 
    0 10px 40px -10px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  overflow: hidden;
  position: relative;
}

.network-status-alert::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    rgba(255, 255, 255, 0.8) 100%
  );
}

.network-status-alert.offline {
  background: linear-gradient(135deg, 
    rgba(220, 38, 38, 0.95) 0%, 
    rgba(185, 28, 28, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.network-status-alert.slow {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.95) 0%, 
    rgba(217, 119, 6, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.alert-inner {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.status-indicator {
  position: relative;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

.content-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
}

.icon-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.icon-container {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.message {
  flex: 1;
  min-width: 0;
}

.message h3 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: white;
}

.message p {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.retry-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.125rem;
  background-color: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.network-status-alert.offline .retry-btn {
  color: #dc2626;
}

.network-status-alert.slow .retry-btn {
  color: #f59e0b;
}

.retry-btn:hover:not(:disabled) {
  background-color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.retry-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.retry-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.retry-btn svg {
  transition: transform 0.3s ease;
}

.retry-btn svg.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Transition animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  transform: translateY(-120%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-120%);
  opacity: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .network-status-wrapper {
    padding: 0.75rem;
  }
  
  .alert-inner {
    padding: 0.875rem 1rem;
  }
  
  .content-wrapper {
    gap: 1rem;
  }
  
  .message h3 {
    font-size: 0.875rem;
  }
  
  .message p {
    font-size: 0.75rem;
  }
  
  .retry-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
  }
  
  .icon-container {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 540px) {
  .content-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 0.875rem;
  }
  
  .retry-btn {
    justify-content: center;
    width: 100%;
  }
  
  .status-indicator {
    display: none;
  }
}
</style>