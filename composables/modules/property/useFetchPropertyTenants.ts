import { property_api } from '@/api_factory/modules/property'

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

export const useGetPropertyTenants = () => {
    const route = useRoute()
    const loadingPropertyTenants = ref(false);
    const tenantsList = ref([] as any);
    const searchQuery = ref<string>("");
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    const houseId = route?.params?.id

    // Filters including dates and agentId
    const filters = ref({
        searchQuery: null,
        status: null,
        fromDate: null,
        toDate: null,
        agentId: null,
    });

    const { $_fetch_property_tenants } = property_api;
    const getPropertyTenants = async () => {
        loadingPropertyTenants.value = true;
        try {
            const res = await $_fetch_property_tenants(houseId, metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                console.log(res?.data, 'Res here')
                // Sort properties by 'createdAt' in descending order
                tenantsList.value = (res?.data ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            loadingPropertyTenants.value = false;
        }
    };

    // Debounced version of getPropertyTenants to avoid multiple API calls
    const debouncedgetPropertyTenants = debounce(getPropertyTenants, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        console.log(filters, 'filters updated')
        loadingPropertyTenants.value = true;
        getPropertyTenants()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedgetPropertyTenants(); // Use the debounced version here
            getPropertyTenants()
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
        getPropertyTenants()
        // Call debounced function once on mount
        // debouncedgetPropertyTenants();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedgetPropertyTenants.cancel?.();
    });

    return {
        getPropertyTenants,
        loadingPropertyTenants,
        tenantsList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters, 
    };
};
