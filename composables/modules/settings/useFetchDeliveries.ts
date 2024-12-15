import { settings_api } from '@/api_factory/modules/settings'

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
    const route = useRoute()
    const loadingDeliveries = ref(false);
    const deliveriesList = ref([] as any);

    const { $_fetch_deliveries } = settings_api
    const fetchDeliveries = async () => {
        loadingDeliveries.value = true;
        // try {
            const res = await $_fetch_deliveries(route?.params?.id) as any;
             console.log(res, 'res hee')
            if (res.type !== 'ERROR') {
                deliveriesList.value = res?.data?.result
            } 
            loadingDeliveries.value = false;

        // } catch (error) {
        //     console.error('Error fetching notifications:', error);
        // } finally {
        //     loadingDeliveries.value = false;
        // }
    };

    // Debounced version of fetchDeliveries to avoid multiple API calls
    const debouncedGetProperties = debounce(fetchDeliveries, 300); // 300ms delay

    watch( [route.params.id], // Watch only page and perPage
        () => {
            // debouncedGetProperties(); // Use the debounced version here
            fetchDeliveries()
        }
    );


    onMounted(() => {
        fetchDeliveries()
        // Call debounced function once on mount
        // debouncedGetProperties();
    });

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetProperties.cancel?.();
    });

    return {
        fetchDeliveries,
        loadingDeliveries,
        deliveriesList
    };
};
