import { dashboard_api } from '@/api_factory/modules/dashboard'
import { ref, onMounted, watch } from 'vue'

const houseMetricsList = ref({} as Record<string, any>) as any

export const useFetchHouseMetrics = () => {
    const fetchingHouseMetrics = ref(false)

    const houseMetricsFilterObj = ref({
        startDate: '',
        endDate: '',
        agentId: '',
        houseId: '',
        propertyManagerId: ''
    })
    
    // Set default dates when the composable is initialized
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0]
        houseMetricsFilterObj.value.startDate = today
        houseMetricsFilterObj.value.endDate = today
    }

    const { $_fetch_house_metrics } = dashboard_api

    const getHouseMetrics = async () => {
        fetchingHouseMetrics.value = true
        const res = await $_fetch_house_metrics(
            houseMetricsFilterObj.value.startDate, 
            houseMetricsFilterObj.value.endDate,
            houseMetricsFilterObj.value.agentId,
            houseMetricsFilterObj.value.houseId,
            houseMetricsFilterObj.value.propertyManagerId,
        ) as any
        
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            houseMetricsList.value = res?.data.result ?? {}
        }
        fetchingHouseMetrics.value = false
    }

    // Set default dates immediately
    setDefaultDates()

    onMounted(() => {
        getHouseMetrics()
    })

    // Watch for changes in startDate and endDate
    watch(
        () => [houseMetricsFilterObj.value.startDate, houseMetricsFilterObj.value.agentId, houseMetricsFilterObj.value.houseId, houseMetricsFilterObj.value.startDate, houseMetricsFilterObj.value.propertyManagerId],
        () => {
            getHouseMetrics()
        }
    )
    
    return { houseMetricsList, houseMetricsFilterObj, fetchingHouseMetrics, getHouseMetrics }
}