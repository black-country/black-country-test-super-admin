import { settings_api } from '@/api_factory/modules/settings'

const scheduleInfoObj = ref({} as Record<string, any>) as any

export const useFetchSchedule = () => {
    const loading = ref(false)
    const route = useRoute() as any

    const { $_fetch_schedule_by_id } = settings_api

    const getScheduleInfo = async () => {
        loading.value = true
        const res = await $_fetch_schedule_by_id(route.params.id) as any
        if (res.type !== 'ERROR') {
            console.log(res.data, 'heree')
            scheduleInfoObj.value = res?.data ?? {}
        }
        loading.value = false
    }

    onMounted(() => {
        getScheduleInfo()
    })
    
    return { scheduleInfoObj, loading, getScheduleInfo }
}
