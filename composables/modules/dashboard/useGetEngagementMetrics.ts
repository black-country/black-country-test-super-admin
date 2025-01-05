// import { dashboard_api } from '@/api_factory/modules/dashboard'


// const metricsObj = ref({} as Record<string, any>) as any

// export const useFetchEngagementMetrics = () => {
//     const loading = ref(false)

//     const filterObj = ref({
//         userType : 'TENANT' ,
//         startDate : '' ,
//         endDate : ''
//     })

      
//   const today = new Date().toISOString().split('T')[0];
//   filterObj.startDate = today;
//   filterObj.endDate = today;

//         const { $_fetch_engagement_metrics } = dashboard_api

//     const getEngagementMetrics = async () => {
//         loading.value = true
//         const res = await $_fetch_engagement_metrics(filterObj.value.userType, filterObj.value.startDate, filterObj.value.endDate) as any
//         if (res.type !== 'ERROR') {
//             console.log(res.data, 'heree')
//             metricsObj.value = res?.data ?? {}
//         }
//         loading.value = false
//     }


//     onMounted(() => {
//         getEngagementMetrics()
//     })

//     // watch(() => [filterObj.value.endDate, filterObj.value.endDate, filterObj.value.startDate], () => {
//     //     getEngagementMetrics()
//     // })
    
//     return { metricsObj, filterObj, loading, getEngagementMetrics }
// }


import { dashboard_api } from '@/api_factory/modules/dashboard'
import { ref, onMounted, watch } from 'vue'

const metricsObj = ref({} as Record<string, any>) as any

export const useFetchEngagementMetrics = () => {
    const loading = ref(false)

    const filterObj = ref({
        userType: 'TENANT',
        startDate: '',
        endDate: ''
    })
    
    // Set default dates when the composable is initialized
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0]
        filterObj.value.startDate = today
        filterObj.value.endDate = today
    }

    const { $_fetch_engagement_metrics } = dashboard_api

    const getEngagementMetrics = async () => {
        loading.value = true
        const res = await $_fetch_engagement_metrics(
            filterObj.value.userType, 
            filterObj.value.startDate, 
            filterObj.value.endDate
        ) as any
        
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            metricsObj.value = res?.data ?? {}
        }
        loading.value = false
    }

    // Set default dates immediately
    setDefaultDates()

    onMounted(() => {
        getEngagementMetrics()
    })

    // Watch for changes in startDate and endDate
    watch(
        () => [filterObj.value.startDate, filterObj.value.endDate],
        () => {
            getEngagementMetrics()
        }
    )
    
    return { metricsObj, filterObj, loading, getEngagementMetrics }
}