import { ref, onMounted, onUnmounted } from 'vue'
import { useUser } from "@/composables/auth/user";

const isIdle = ref(false)
const isModalVisible = ref(false)
const countdown = ref(10) // Countdown timer
const idleTimeout = 60 * 1000 // 1 minute in milliseconds
let idleTimer: number | undefined = undefined
let countdownInterval: number | undefined = undefined

export function useIdle() {
  const router = useRouter()
const { logOut } = useUser();
  function resetIdleTimer() {
    clearTimeout(idleTimer)
    clearInterval(countdownInterval)
    isIdle.value = false
    isModalVisible.value = false
    countdown.value = 10
    startIdleTimer()
  }

  function startIdleTimer() {
    idleTimer = setTimeout(() => {
      isIdle.value = true
      showWarningModal()
    }, idleTimeout)
  }

  function showWarningModal() {
    isModalVisible.value = true
    startCountdown()
  }

  function startCountdown() {
    countdownInterval = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
        logoutUser()
      }
    }, 1000)
  }

  function stopCountdown() {
    clearInterval(countdownInterval)
    isModalVisible.value = false
    resetIdleTimer()
  }

  function logoutUser() {
    localStorage.removeItem('auth_token') // Example: Clear user session
    router.push('/login')
    window.location.href = '/login' // Redirect to login
    logOut()
  }

  function addEventListeners() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    events.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    )
  }

  function removeEventListeners() {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart']
    events.forEach((event) =>
      window.removeEventListener(event, resetIdleTimer)
    )
  }

  onMounted(() => {
    addEventListeners()
    startIdleTimer()
  })

  onUnmounted(() => {
    clearTimeout(idleTimer)
    clearInterval(countdownInterval)
    removeEventListeners()
  })

  return {
    isIdle,
    isModalVisible,
    countdown,
    stopCountdown,
    // logoutUser,
  }
}
