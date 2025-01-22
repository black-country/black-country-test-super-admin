import { ref, onMounted, watch } from 'vue'
import { tenant_api } from '@/api_factory/modules/tenant'


export const useFetchLeaseDocuments = () => {
    const loading = ref(false) // Loading state for general properties
    const leaseDocumentsList = ref([] as any) // Array to hold all properties
    const route = useRoute() as any

    const { $_fetch_lease_documents } = tenant_api

    const fetchLeaseDocuments = async () => {
        loading.value = true
        // Pass page, perPage, and searchQuery to the API factory
        const res = await $_fetch_lease_documents(route.params.id) as any
        console.log(res, 'focumets list')

        if (res.type !== 'ERROR') {
            leaseDocumentsList.value = res?.data?.result ?? [];
        }
        loading.value = false
    }


    onMounted(() => {
        fetchLeaseDocuments()
    })

    return {
        fetchLeaseDocuments,
        loading,
        leaseDocumentsList
    }
}
