export const useNetworkStatus = () => {
  const isOnline = ref(true)
  const isSlowConnection = ref(false)
  const connectionType = ref<string>('unknown')

  const checkConnection = () => {
    isOnline.value = navigator.onLine

    // Check connection type and speed
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connectionType.value = connection.effectiveType || 'unknown'
      
      // Consider 'slow-2g' and '2g' as slow connections
      isSlowConnection.value = ['slow-2g', '2g'].includes(connection.effectiveType)
    }
  }

  const testNetworkSpeed = async () => {
    if (!navigator.onLine) {
      isOnline.value = false
      return
    }

    try {
      const startTime = performance.now()
      const response = await fetch('/favicon.ico?_=' + Date.now(), { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      const endTime = performance.now()
      const duration = endTime - startTime

      // If request takes more than 3 seconds, consider it slow
      if (duration > 3000) {
        isSlowConnection.value = true
      } else {
        isSlowConnection.value = false
      }

      isOnline.value = response.ok
    } catch (error) {
      isOnline.value = false
    }
  }

  onMounted(() => {
    checkConnection()

    // Listen for online/offline events
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', checkConnection)
    }

    // Periodically test network speed
    const speedTestInterval = setInterval(testNetworkSpeed, 30000) // Every 30 seconds

    onUnmounted(() => {
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
      
      if (connection) {
        connection.removeEventListener('change', checkConnection)
      }
      
      clearInterval(speedTestInterval)
    })
  })

  return {
    isOnline: readonly(isOnline),
    isSlowConnection: readonly(isSlowConnection),
    connectionType: readonly(connectionType),
    checkConnection,
    testNetworkSpeed
  }
}