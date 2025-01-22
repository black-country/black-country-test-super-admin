import { ref, onMounted, watch } from 'vue'
import { tenant_api } from '@/api_factory/modules/tenant'


export const useFetchRentalChecklist = () => {
    const loading = ref(false) // Loading state for general properties
    const rentalChecklist = ref({} as any) // Array to hold all properties
    const route = useRoute() as any

    const { $_fetch_rental_checklist } = tenant_api

    const fetchRentalChecklist = async () => {
        loading.value = true
        // Pass page, perPage, and searchQuery to the API factory
        const res = await $_fetch_rental_checklist(route.params.id) as any
         console.log(res, 'fetch rental checklist')
        if (res.status == 200) {
            rentalChecklist.value = res?.data
        }
        loading.value = false
    }


    onMounted(() => {
        fetchRentalChecklist()
    })

    return {
        fetchRentalChecklist,
        loading,
        rentalChecklist
    }
}
