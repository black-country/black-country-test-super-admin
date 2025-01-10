import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);
const route = useRoute() 

const payload = ref( {
    name: "",
    content: "",
    type: "",
    description: "",
    app: ""
})


export const useUpdatePloicy = () => {
    const updatePolicy = async () => {
        loading.value = true;
        try {
            const res = await settings_api.$_update_policy(payload.value, route.params.id);
            showToast({
                title: "Success",
                message: 'Policy was update successfully',
                toastType: "success",
                duration: 3000
            });
            // router.push('/dashboard/settings/new-faq')
            return res;
        } catch (error) {
            showToast({
                title: "Error",
                message: 'Failed to update policy',
                toastType: "error",
                duration: 3000
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const setPayload = (data: any) => {
        payload.value = { ...data}
    }

    return { updatePolicy, setPayload, loading, payload }
};
