import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
const { showToast } = useCustomToast();
const { fetchPolicy } = useFetchPolicy()
const loading = ref(false)
const route = useRoute();
const router = useRouter();

const payload = ref({
    ids: []
 })
export const useDeletePolicy = () => {
    const deletePolicy = async (id: string | number) => {
        loading.value = true
        const res = await  settings_api.$_batch_delete_policy(payload.value) as any

        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: "Policies was deleted successfully",
                toastType: "success",
                duration: 3000
              });
              fetchPolicy()
              window.location.reload();
        }
        loading.value = false
    }

    return { deletePolicy, loading }
}
