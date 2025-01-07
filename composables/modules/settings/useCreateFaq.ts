import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);

const payload = ref( {
    question: "",
    answer: "",
    app: ""
})

const router = useRouter()

export const useCreateFAQ = () => {
    const createFaq = async () => {
        loading.value = true;
        try {
            const res = await settings_api.$_create_faq(payload.value);
            showToast({
                title: "Success",
                message: 'FAQ was created successfully',
                toastType: "success",
                duration: 3000
            });
            // router.push('/dashboard/settings/new-faq')
            return res;
        } catch (error) {
            showToast({
                title: "Error",
                message: 'Failed to create FAQ',
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

    return { createFaq, setPayload, loading, payload }
};
