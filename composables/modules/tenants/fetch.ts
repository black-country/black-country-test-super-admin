import {  tenant_api } from '@/api_factory/modules/tenant'

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

export const useGetTenants = () => {
    const loadingTenants = ref(false);
    const tenantsList = ref([] as any);
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
        status: null,
        fromDate: null,
        toDate: null,
        agentId: null,
    });

    const { $_fetch_tenants } = tenant_api
    const getTenants = async () => {
        loadingTenants.value = true;
        try {
            const res = await $_fetch_tenants(metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                tenantsList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            loadingTenants.value = false;
        }
    };

    // Debounced version of getTenants to avoid multiple API calls
    const debounceGetTenants = debounce(getTenants, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingTenants.value = true;
        getTenants()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debounceGetTenants(); // Use the debounced version here
            getTenants()
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
        getTenants()
        // Call debounced function once on mount
        // debounceGetTenants();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debounceGetTenants.cancel?.();
    });

    return {
        getTenants,
        loadingTenants,
        tenantsList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters, 
    };
};
