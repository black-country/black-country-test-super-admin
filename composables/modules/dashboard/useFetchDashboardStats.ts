import { dashboard_api } from '@/api_factory/modules/dashboard'


const dashboardStats = ref({} as Record<string, any>) as any

export const useFetchDashboardStats = () => {
    const loading = ref(false)

        const { $_fetch_dashboard_stats } = dashboard_api

    const getDashboardStats = async () => {
        loading.value = true
        const res = await $_fetch_dashboard_stats() as any
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            dashboardStats.value = res?.data ?? {}
        }
        loading.value = false
    }

    onMounted(() => {
        getDashboardStats()
    })
    
    return { dashboardStats, loading, getDashboardStats }
}
