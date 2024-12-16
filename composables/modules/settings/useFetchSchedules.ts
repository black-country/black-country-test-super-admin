import { settings_api } from '@/api_factory/modules/settings'

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

export const useFetchSchedules = () => {
    const loadingSchedules = ref(false);
    const schedulesList = ref([] as any);
    const searchQuery = ref<string>("");
    const filteredSchedulesList = ref([] as any); // To hold filtered results
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    // Filters including dates and agentId
    const { $_fetch_schedules } = settings_api
    const fetchSchedules = async () => {
        loadingSchedules.value = true;
        try {
            const res = await $_fetch_schedules(metadata.value) as any;
            console.log(res, 'dchedules')
            if (res.type !== 'ERROR') {
                // Sort properties by 'createdAt' in descending order
                schedulesList.value = res?.data?.result
                filteredSchedulesList.value = [...schedulesList.value]; // Initialize filtered list
                metadata.value = res?.data?.metadata;
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            loadingSchedules.value = false;
        }
    };

    // Debounced version of fetchSchedules to avoid multiple API calls
    const debouncedGetProperties = debounce(fetchSchedules, 300); // 300ms delay

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetProperties(); // Use the debounced version here
            fetchSchedules()
        }
    );

    const setPaginationObj = (val: number) => {
        if (metadata.value.page !== val) {
            metadata.value.page = val;
        }
    };

      // Watch for changes in searchQuery
      watch(
        () => searchQuery.value,
        (newQuery) => {
            if (!newQuery.trim()) {
                // If the search query is empty, reset the filtered list
                filteredSchedulesList.value = [...schedulesList.value];
                return;
            }

            const lowerCaseQuery = newQuery.toLowerCase();
            filteredSchedulesList.value = schedulesList.value.filter((schedule: any) =>
                schedule.subject?.toLowerCase().includes(lowerCaseQuery) ||
                schedule.notificationType?.toLowerCase().includes(lowerCaseQuery) ||
                schedule.recipientType?.toLowerCase().includes(lowerCaseQuery)
            );
        }
    );


    onMounted(() => {
        fetchSchedules()
        // Call debounced function once on mount
        // debouncedGetProperties();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetProperties.cancel?.();
    });

    return {
        fetchSchedules,
        loadingSchedules,
        schedulesList,
        filteredSchedulesList, 
        searchQuery,
        metadata,
        setPaginationObj
    };
};
