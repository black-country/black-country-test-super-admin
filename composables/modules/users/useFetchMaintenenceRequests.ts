import { ref, onMounted, watch } from 'vue'
import { tenant_api } from '@/api_factory/modules/tenant'


export const useFetchMaintenanceRequests = () => {
    const loading = ref(false) // Loading state for general properties
    const maintenanceRequests = ref([] as any) // Array to hold all properties
    const route = useRoute() as any

    const { $_fetch_maintenance_request } = tenant_api

    const fetchMaintenanceRequests = async () => {
        loading.value = true
        // Pass page, perPage, and searchQuery to the API factory
        const res = await $_fetch_maintenance_request(route.params.id) as any
        console.log(res, 'focumets list')

        if (res.type !== 'ERROR') {
            maintenanceRequests.value = res?.data?.result ?? [];
        }
        loading.value = false
    }


    onMounted(() => {
        fetchMaintenanceRequests()
    })

    return {
        fetchMaintenanceRequests,
        loading,
        maintenanceRequests
    }
}
