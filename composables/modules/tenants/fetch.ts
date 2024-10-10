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
    const loadingMembers = ref(false);
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
        fromDate: null,
        toDate: null
    });

    const { $_fetch_tenants } = tenant_api
    const getTenants = async () => {
        loadingMembers.value = true;
        try {
            const res = await $_fetch_tenants(metadata.value, filters.value) as any;
            console.log(res, 'all tenants')
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                tenantsList.value = res?.data?.result ?? []
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            loadingMembers.value = false;
        }
    };

    // Debounced version of getTenants to avoid multiple API calls
    const debouncedGetProperties = debounce(getTenants, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingMembers.value = true;
        getTenants()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetProperties(); // Use the debounced version here
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
        // debouncedGetProperties();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetProperties.cancel?.();
    });

    return {
        getTenants,
        loadingMembers,
        tenantsList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters
    };
};
