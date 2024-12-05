import { roles_api } from '@/api_factory/modules/roles-mgt'
import { ref } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();

const loading = ref(false);
const roles = ref([]);

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


export const useFetchRoles = () => {
    const filters = ref({
        searchQuery: null,
    });

    const fetchRoles = async () => {
        loading.value = true;
        try {
            const res = await roles_api.$_fetch_roles(filters.value);
            console.log(res.data, 'here')
            roles.value = res.data.result;
            return res;
        } catch (error) {
            showToast({
                title: "Error",
                message: 'Failed to fetch roles',
                toastType: "error",
                duration: 3000
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    watch(filters, () => {
        fetchRoles()
    }, { deep: true });

       // Expose a method to apply the filters (from the UI)
       const applyFilters = (newFilters: any) => {
        filters.value = { ...filters.value, ...newFilters };
    };

    onMounted(() => {
        fetchRoles()
    });

    // onBeforeUnmount(() => {
    //     // Clear timeout to avoid memory leaks
    //     debouncedGetProperties.cancel?.();
    // });


    return { fetchRoles, loading, roles, filters };
};
