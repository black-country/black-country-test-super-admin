import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);
const route = useRoute() 

const payload = ref( {
    question: "",
    answer: "",
    app: "",
    position: 1
})

const router = useRouter()

export const useUpdateFaq = () => {
    const router = useRouter()
    const updateFaq = async () => {
        loading.value = true;
        const res = await settings_api.$_update_faq(payload.value, route.params.id) as any
        console.log(res, 'here')
        if(res.status !== 'ERROR'){
            showToast({
                title: "Success",
                message: 'FAQ was update successfully',
                toastType: "success",
                duration: 3000
            });
            router.push('/dashboard/settings/faq-success')
            // window.location.href = '/dashboard/settings/faq-success'
            localStorage.removeItem('selected-faq')
        } else {
            showToast({
                title: "Error",
                message: 'Failed to update Faq',
                toastType: "error",
                duration: 3000
            });
        }
        loading.value = false;
    };

    const setPayload = (data: any) => {
        payload.value = { ...data}
    }

    return { updateFaq, setPayload, loading, payload }
};
