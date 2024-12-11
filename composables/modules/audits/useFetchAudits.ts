import { audit_api } from '@/api_factory/modules/audit'

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

export const useGetAudits = () => {
    const loading = ref(false);
    const auditList = ref([] as any);
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    const filters = ref({
        searchQuery: ""
    })


    const { $_fetch_audits } = audit_api
    const fetchAudits = async () => {
        loading.value = true;
        try {
            const res = await $_fetch_audits(metadata.value) as any;
            console.log(res, 'audit res')
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                auditList.value = res?.data?.result ?? []
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            loading.value = false;
        }
    };

    // Debounced version of fetchAudits to avoid multiple API calls
    const debouncedGetProperties = debounce(fetchAudits, 300); // 300ms delay

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetProperties(); // Use the debounced version here
            fetchAudits()
        }
    );

    const setPaginationObj = (val: number) => {
        if (metadata.value.page !== val) {
            metadata.value.page = val;
        }
    };

    onMounted(() => {
        fetchAudits()
    });

    onBeforeUnmount(() => {
        debouncedGetProperties.cancel?.();
    });

    return {
        fetchAudits,
        loading,
        auditList,
        metadata,
        setPaginationObj,
        filters
    };
};
