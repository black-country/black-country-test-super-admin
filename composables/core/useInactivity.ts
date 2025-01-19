// composables/useInactivity.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export function useInactivity(timeout = 1800000) { // 30 minutes default timeout (30 * 60 * 1000)
  const router = useRouter();
  const lastActivity = ref(Date.now());
  const isWarningVisible = ref(false);
  const countdown = ref(180); // 3 minutes countdown in seconds
  let countdownInterval: NodeJS.Timer | null = null;
  
  const updateActivity = () => {
    lastActivity.value = Date.now();
    if (isWarningVisible.value) {
      hideWarning();
    }
  };

  const checkInactivity = () => {
    const elapsedTime = Date.now() - lastActivity.value;
    if (elapsedTime > timeout && !isWarningVisible.value) {
      showWarning();
    }
  };

  const showWarning = () => {
    isWarningVisible.value = true;
    startCountdown();
  };

  const hideWarning = () => {
    isWarningVisible.value = false;
    stopCountdown();
    countdown.value = 180; // Reset countdown to 3 minutes
  };

  const startCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        handleLogout();
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  const handleLogout = () => {
    hideWarning();
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  const stayLoggedIn = () => {
    hideWarning();
    lastActivity.value = Date.now(); // Reset the activity timer
  };

  const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  
  onMounted(() => {
    // Only set up inactivity detection if not on login page
    if (!router.currentRoute.value.path.includes('/login')) {
      events.forEach(event => window.addEventListener(event, updateActivity));
      const inactivityInterval = setInterval(checkInactivity, 1000);

      onUnmounted(() => {
        events.forEach(event => window.removeEventListener(event, updateActivity));
        clearInterval(inactivityInterval);
        stopCountdown();
      });
    }
  });

  return {
    isWarningVisible,
    countdown,
    handleLogout,
    stayLoggedIn,
  };
}