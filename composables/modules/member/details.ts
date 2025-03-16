import { member_api } from '@/api_factory/modules/member'
import { ref, onMounted } from 'vue'

const memberObj = ref<Record<string, any>>({})

export const useFetchMemberDetails = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const route = useRoute() // Access the current route

    const { $_member_details } = member_api

    // Get the property ID from the route parameter
    const queryId = ref(route.params.id as string || '') 
    const group = ref(route.query.group as string || '') 


    const getMemberDetails = async () => {
        if (!queryId.value) {
            error.value = 'No property ID available to fetch'
            return
        }

        loading.value = true
        error.value = null // Reset error state
        try {
            const res = await $_member_details(queryId.value, group.value) as any
            console.log(res, 'here')
            memberObj.value = res.data
        } catch (e) {
            error.value = 'An unexpected error occurred'
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        getMemberDetails()
    })

    return { memberObj, loading, error, getMemberDetails }
}
