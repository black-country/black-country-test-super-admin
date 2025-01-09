import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);

const payload = ref( {
    question: "",
    answer: "",
    app: "",
    position: 1
})

const router = useRouter()

export const useCreateFAQ = () => {
    const createFaq = async () => {
        loading.value = true;
        // try {
            const requestPayload = {
                list: [payload.value]
            };
            const res = await settings_api.$_create_faq(requestPayload) as any
            if(res.type !== 'ERROR'){
                showToast({
                    title: "Success",
                    message: 'FAQ was created successfully',
                    toastType: "success",
                    duration: 3000
                });
                // router.push('/dashboard/settings/faq-success')
                window.location.href = '/dashboard/settings/faq-success'
            }
            loading.value = false;
            // return res;
        // } catch (error) {
        //     showToast({
        //         title: "Error",
        //         message: 'Failed to create FAQ',
        //         toastType: "error",
        //         duration: 3000
        //     });
        //     throw error;
        // } finally {
        //     loading.value = false;
        // }
    };

    const setPayload = (data: any) => {
        payload.value = { ...data, position: 1 }
    }

    return { createFaq, setPayload, loading, payload }
};
