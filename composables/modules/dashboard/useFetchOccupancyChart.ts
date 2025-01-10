import { dashboard_api } from '@/api_factory/modules/dashboard'
import { ref, onMounted, watch } from 'vue'

const occupancyChartInfo = ref({} as Record<string, any>) as any

export const useFetchOccupancyChart = () => {
    const loading = ref(false)

    const occupancyFilterObj = ref({
        startDate: '',
        endDate: ''
    })
    
    // Set default dates when the composable is initialized
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0]
        occupancyFilterObj.value.startDate = today
        occupancyFilterObj.value.endDate = today
    }

    const { $_fetch_occupancy_metrics } = dashboard_api

    const getOccupancyChart = async () => {
        loading.value = true
        const res = await $_fetch_occupancy_metrics(
            occupancyFilterObj.value.startDate, 
            occupancyFilterObj.value.endDate
        ) as any
        
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            occupancyChartInfo.value = res?.data.result ?? {}
        }
        loading.value = false
    }

    // Set default dates immediately
    setDefaultDates()

    onMounted(() => {
        getOccupancyChart()
    })

    // Watch for changes in startDate and endDate
    watch(
        () => [occupancyFilterObj.value.startDate,occupancyFilterObj.value.endDate],
        () => {
            getOccupancyChart()
        }
    )
    
    return { occupancyChartInfo, occupancyFilterObj, loading, getOccupancyChart }
}