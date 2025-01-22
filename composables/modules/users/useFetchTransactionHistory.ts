import { ref, onMounted, watch } from 'vue'
import { tenant_api } from '@/api_factory/modules/tenant'
import { useUser } from '@/composables/auth/user' 


export const useGetTransactionHistory = () => {
    const loading = ref(false) // Loading state for general properties
    const transactionHistory = ref([] as any) // Array to hold all properties
    const currentPage = ref(1)
    const perPage = ref(20)
    const totalPages = ref(1) // To store total pages
    const route = useRoute() as any

    const { $_fetch_transaction_history } = tenant_api

    const fetchTransactionHistory = async () => {
        loading.value = true
        // Pass page, perPage, and searchQuery to the API factory
        const res = await $_fetch_transaction_history(route.params.id, currentPage.value, perPage.value) as any

        if (res.type !== 'ERROR') {
            transactionHistory.value = res?.data?.result ?? [];
            totalPages.value = Math.ceil(res?.data?.metadata?.total / perPage.value) || 1; // Set total pages
            // Ensure currentPage and perPage are set correctly
        }
        loading.value = false
    }


    // Watch currentPage for pagination
    watch(currentPage, () => {
        fetchTransactionHistory()
    })


    onMounted(() => {
        fetchTransactionHistory()
    })

    return {
        fetchTransactionHistory,
        loading,
        transactionHistory,
        currentPage,
        perPage,
        totalPages,
    }
}
