import { rental_api } from '@/api_factory/modules/rental'

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

export const useGetRentals = () => {
    const loadingRentals = ref(false);
    const rentalsList = ref([] as any);
    const searchQuery = ref<string>("");
    const route = useRoute() as any
    const metadata = ref({
        page: 1,
        perPage: 9,
        total: 100,
        pages: 0,
    });

    // Filters including dates and agentId
    const filters = ref({
        searchQuery: null,
        fromDate: null,
        toDate: null,
        status: ''
    });

    const { $_fetch_rentals } = rental_api;
    const getRentals = async () => {
        loadingRentals.value = true;
        try {
            const res = await $_fetch_rentals(route.params.id, metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                rentalsList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching rentals', error);
        } finally {
            loadingRentals.value = false;
        }
    };

    // Debounced version of getRentals to avoid multiple API calls
    const debouncedGetRentals = debounce(getRentals, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingRentals.value = true;
        getRentals()
    }, { deep: true });


    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetRentals(); // Use the debounced version here
            getRentals()
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
        getRentals()
        // Call debounced function once on mount
        // debouncedGetRentals();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetRentals.cancel?.();
    });

    return {
        getRentals,
        loadingRentals,
        rentalsList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters, // Expose applyFilters for external usage
    };
};
