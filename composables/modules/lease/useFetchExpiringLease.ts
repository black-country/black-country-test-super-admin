import { lease_api } from "@/api_factory/modules/lease";

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

export const useFetchExpiringLease = () => {
    const loading = ref(false);
    const expiringLeaseList = ref([])
    const metadata = ref({
        page: 1,
        perPage: 7,
        total: 100,
        pages: 0,
    });

    const fetchExpiringLease = async () => {
        loading.value = true
        const res = await  lease_api.$_fetch_expiring_lease_agreement(metadata.value) as any
         console.log(res?.data?.result, 'here')
        if (res.type !== 'ERROR') {
            expiringLeaseList.value = (res?.data?.result ?? []).sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            metadata.value = res?.data?.metadata;
        }
        loading.value = false
    }

    const debouncedGetExpiringLease = debounce(fetchExpiringLease, 300); // 300ms delay

    watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
        () => {
            // debouncedGetExpiringLease(); // Use the debounced version here
            fetchExpiringLease()
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
        fetchExpiringLease()
    })

    return { fetchExpiringLease, loading, expiringLeaseList, setPaginationObj, metadata }
}
