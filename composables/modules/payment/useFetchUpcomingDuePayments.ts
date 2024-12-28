import { payment_api } from "@/api_factory/modules/payment";

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

export const useFetchUpcomingDuePayments = () => {
    const loading = ref(false);
    const upcomingDuePaymentList = ref([])
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    const fetchUpcomingDuePayments = async () => {
        loading.value = true
        const res = await payment_api.$_get_upcoming_due_payment(metadata.value) as any
         console.log(res?.data?.result, 'here')
        if (res.type !== 'ERROR') {
            upcomingDuePaymentList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            metadata.value = res?.data?.metadata;
        }
        loading.value = false
    }

    const debouncedGetExpiringLease = debounce(fetchUpcomingDuePayments, 300); // 300ms delay

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetExpiringLease(); // Use the debounced version here
            fetchUpcomingDuePayments()
        }
    );

    const setPaginationObj = (val: number) => {
        if (metadata.value.page !== val) {
            metadata.value.page = val;
        }
    };

    onBeforeUnmount(() => {
        // Clear timeout to avoid memory leaks
        debouncedGetExpiringLease.cancel?.();
    });

    onMounted(() => {
        fetchUpcomingDuePayments()
    })

    return { fetchUpcomingDuePayments, loading, upcomingDuePaymentList, setPaginationObj, metadata }
}
