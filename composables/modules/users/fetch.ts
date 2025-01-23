import {  users_api } from '@/api_factory/modules/users'

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

export const useGetUsers = () => {
    const loadingUsers = ref(false);
    const usersList = ref([] as any);
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

    const { $_fetch_users } = users_api
    const getUsers = async () => {
        loadingUsers.value = true;
        try {
            const res = await $_fetch_users(metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                usersList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            loadingUsers.value = false;
        }
    };

    // Debounced version of getUsers to avoid multiple API calls
    const debounceGetUsers = debounce(getUsers, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingUsers.value = true;
        getUsers()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debounceGetUsers(); // Use the debounced version here
            getUsers()
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
        getUsers()
        // Call debounced function once on mount
        // debounceGetUsers();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debounceGetUsers.cancel?.();
    });

    return {
        getUsers,
        loadingUsers,
        usersList,
        searchQuery,
        metadata,
        filters,
        setPaginationObj,
        applyFilters, 
    };
};
