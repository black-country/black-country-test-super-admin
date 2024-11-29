import {  tenant_api } from '@/api_factory/modules/tenant'

export const useGetTenentDetails = () => {
    const loading = ref(false);
    const route = useRoute()
    const tenantDetails = ref({} as any);
    const { $_tenent_details } = tenant_api
    const getTenantDetails = async () => {
        loading.value = true;
        const id = route.params.id || route?.query?.userId
        try {
            const res = await $_tenent_details(id) as any;
            console.log(res, 'tenent detrals')
            if (res.type !== 'ERROR') {
                tenantDetails.value = res?.data
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        getTenantDetails()
    });

    return {
        getTenantDetails,
        loading,
        tenantDetails
    };
};
