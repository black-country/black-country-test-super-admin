import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);
const route = useRoute() 
const router = useRouter()

const updatedPayload = ref( {
    name: "",
    content: "",
    type: "",
    description: "",
    app: ""
})


export const useUpdatePloicy = () => {
    const updatePolicy = async () => {
        loading.value = true;
        const res = await settings_api.$_update_policy(updatedPayload.value, route.params.id) as any
        console.log(res, 'tse hee')
        if(res.status === 200 || res.status === 201){
           showToast({
                title: "Success",
                message: 'Policy was update successfully',
                toastType: "success",
                duration: 3000
            });
            router.push('/dashboard/settings/new-faq')
            window.location.href = '/dashboard/settings/new-faq'
        } else {
                     showToast({
                title: "Error",
                message: 'Failed to update policy',
                toastType: "error",
                duration: 3000
            });
        }
        loading.value = false;
        // try {
        //     const res = await settings_api.$_update_policy(updatedPayload.value, route.params.id);
        //     showToast({
        //         title: "Success",
        //         message: 'Policy was update successfully',
        //         toastType: "success",
        //         duration: 3000
        //     });
        //     router.push('/dashboard/settings/new-faq')
        //     window.location.href = '/dashboard/settings/new-faq'
        //     // return res;
        //     // console.log(res, 'res here')
        // } catch (error) {
        //     console.log(error, 'error ')
        //     showToast({
        //         title: "Error",
        //         message: 'Failed to update policy',
        //         toastType: "error",
        //         duration: 3000
        //     });
        //     // throw error;
        // } finally {
        //     loading.value = false;
        // }
    };

    const setUpdatedPayload = (data: any) => {
        updatedPayload.value = { ...data}
    }

    return { updatePolicy, setUpdatedPayload, loading, updatedPayload }
};
