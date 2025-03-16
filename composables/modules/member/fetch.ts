import { member_api } from '@/api_factory/modules/member'

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

export const useGetMembers = () => {
    const loadingMembers = ref(false);
    const membersList = ref([] as any);
    const admins = ref([])
    const agents = ref([])
    const serviceProviders = ref([])
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

    const {$_fetch_members } = member_api
    const getMembers = async () => {
        loadingMembers.value = true;
        try {
            const res = await $_fetch_members(metadata.value, filters.value) as any;
    
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                membersList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                // serviceProviders.value = res?.data?.result.serviceProviders
                // agents.value = res?.data?.result.agents
                // admins.value = res?.data?.result.admins
                // metadata.value = res?.data?.metadata;
                serviceProviders.value = membersList.value.filter(user => user.group === 'SERVICE_PROVIDER');
                agents.value = membersList.value.filter(user => user.group === 'AGENT');
                admins.value = membersList.value.filter(user => user.group === 'ADMIN');
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            loadingMembers.value = false;
        }
    };

    // Debounced version of getMembers to avoid multiple API calls
    const debouncedGetProperties = debounce(getMembers, 300); // 300ms delay

    // Watch for changes in filters and metadata.page/perPage
    watch(filters, () => {
        if (metadata.value.page !== 1) {
            setPaginationObj(1); // Reset to the first page when search query changes
        }
        loadingMembers.value = true;
        getMembers()
    }, { deep: true });

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetProperties(); // Use the debounced version here
            getMembers()
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
        getMembers()
        // Call debounced function once on mount
        // debouncedGetProperties();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetProperties.cancel?.();
    });

    return {
        getMembers,
        loadingMembers,
        membersList,
        searchQuery,
        metadata,
        filters,
        serviceProviders,
        agents,
        admins,
        setPaginationObj,
        applyFilters
    };
};
