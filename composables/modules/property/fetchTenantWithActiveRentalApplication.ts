import { property_api } from '@/api_factory/modules/property';

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

export const useGetTenantsWithActiveRentals = () => {
    const loadingTenants = ref(false);
    const tenantsList = ref([] as any);
    const houseId = ref<string>("");

    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    const filters = ref({
        searchQuery: "",
        fromDate: null,
        toDate: null,
    });

    const { $_fetch_tenant_with_active_rental_application } = property_api;

    const getTenantsWithActiveRentals = async () => {
        if (!houseId.value) return; // Ensure houseId is provided before making the API call

        loadingTenants.value = true;
        try {
            const res = await $_fetch_tenant_with_active_rental_application(houseId.value, metadata.value, filters.value) as any;

            if (res.type !== 'ERROR') {
                tenantsList.value = res?.data?.result ?? [];
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            loadingTenants.value = false;
        }
    };

    const debouncedGetTenants = debounce(getTenantsWithActiveRentals, 300); // Debounced API call to limit frequent calls

    const setPaginationObj = (val: number) => {
        if (metadata.value.page !== val) {
            metadata.value.page = val;
        }
    };

    const applyFilters = (newFilters: any) => {
        filters.value = { ...filters.value, ...newFilters };
    };

    watch(houseId, () => {
        if (houseId.value) {
            setPaginationObj(1); // Reset pagination when houseId changes
            debouncedGetTenants();
        }
    });

    watch([metadata.value.page, metadata.value.perPage], () => {
        if (houseId.value) {
            getTenantsWithActiveRentals(); // Fetch tenants when pagination changes
        }
    });

    onMounted(() => {
        if (houseId.value) {
            getTenantsWithActiveRentals();
        }
    });

    onBeforeUnmount(() => {
        debouncedGetTenants.cancel?.(); // Clear any pending debounce calls on unmount
    });

    return {
        getTenantsWithActiveRentals,
        loadingTenants,
        tenantsList,
        houseId,
        metadata,
        filters,
        setPaginationObj,
        applyFilters,
    };
};
