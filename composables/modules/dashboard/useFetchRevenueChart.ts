import { dashboard_api } from '@/api_factory/modules/dashboard'
import { ref, onMounted, watch } from 'vue'

const revenueChartInfo = ref({} as Record<string, any>) as any

export const useFetchRevenueChart = () => {
    const loading = ref(false)

    const revenueFilterObj = ref({
        startDate: '',
        endDate: ''
    })
    
    // Set default dates when the composable is initialized
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0]
        revenueFilterObj.value.startDate = today
        revenueFilterObj.value.endDate = today
    }

    const { $_fetch_revenue_metrics } = dashboard_api

    const getRevenueChart = async () => {
        loading.value = true
        const res = await $_fetch_revenue_metrics(
            revenueFilterObj.value.startDate, 
            revenueFilterObj.value.endDate
        ) as any
        
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            revenueChartInfo.value = res?.data.result ?? {}
        }
        loading.value = false
    }

    // Set default dates immediately
    setDefaultDates()

    onMounted(() => {
        getRevenueChart()
    })

    // Watch for changes in startDate and endDate
    watch(
        () => [revenueFilterObj.value.startDate,revenueFilterObj.value.endDate],
        () => {
            getRevenueChart()
        }
    )
    
    return { revenueChartInfo, revenueFilterObj, loading, getRevenueChart }
}