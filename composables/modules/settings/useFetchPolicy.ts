import { settings_api } from "@/api_factory/modules/settings";
const loading = ref(false)
const policyList = ref({})

const appType = ref('tenant-app')

export const useFetchPolicy = () => {
    const fetchPolicy = async () => {
        loading.value = true
        const res = await  settings_api.$_fetch_policy(appType.value) as any
        console.log(res, 'res hweere')
        if (res.type !== 'ERROR') {
            policyList.value = res?.data ?? []
        }
        loading.value = false
    }

    watch(appType, () => {
        fetchPolicy()
    })

    onMounted(() => {
        fetchPolicy()
    })

    return { loading, fetchPolicy, appType, policyList }
}
