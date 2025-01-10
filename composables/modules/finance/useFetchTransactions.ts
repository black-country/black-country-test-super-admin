import { finance_api } from '@/api_factory/modules/finance'

// Debounce function to limit the rate at which a function can be called
function debounce(fn: Function, delay: number) {
    let timeoutId: number | undefined;
    const debounced = function (...args: any) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    return debounced;
}

export const useGetTransactions = () => {
    const loadingTtansactions = ref(false);
    const transactionsList = ref([] as any);
    const searchQuery = ref<string>("");
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    // Filters including dates and agentId
    const filters = ref({
        searchQuery: null,
        startDate: null,
        endDate: null
    });

    const { $_fetch_transactions } = finance_api
    const getTransactions = async () => {
        loadingTtansactions.value = true;
        try {
            const res = await $_fetch_transactions(metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                transactionsList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            loadingTtansactions.value = false;
        }
    };

    // Debounced version of getTransactions to avoid multiple API calls
    const debouncedGetTransactions = debounce(getTransactions, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingTtansactions.value = true;
        getTransactions()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetTransactions(); // Use the debounced version here
            getTransactions()
        }
    );

    const setPaginationObj = (val: number) => {
        if (metadata.value.page !== val) {
            metadata.value.page = val;
        }
    };

    // Expose a method to apply the filters (from the UI)
    const applyFilters = (newFilters: any) => {
        filters.value = { ...filters.value, ...newFilters };
    };

    onMounted(() => {
        getTransactions()
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetTransactions.cancel?.();
    });

    return {
        getTransactions,
        loadingTtansactions,
        transactionsList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters, 
    };
};
