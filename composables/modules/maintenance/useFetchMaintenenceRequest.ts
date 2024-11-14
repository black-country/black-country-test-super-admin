import { ref } from 'vue'

const maintenanceRequest = ref({})

export const useFetchMaintenanceRequest = () => {

  const handleMaintenanceRequest = (data: any) => {
    maintenanceRequest.value = data
  }

  return {
    handleMaintenanceRequest,
    maintenanceRequest
  }
}
