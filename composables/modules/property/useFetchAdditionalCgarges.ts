import { property_api } from '@/api_factory/modules/property'

const category = ref('rental') as any

export const useGetAdditionalCharges = () => {
    const loading = ref(false)
    const additionalChargesList = ref([] as any)

    const { $_fetch_additional_charges } = property_api


    const getAdditionalCharges = async () => {
        loading.value = true

        const res = await $_fetch_additional_charges(category) as any

        if (res.type !== 'ERROR') {
            additionalChargesList.value = res.data ?? []
        }
        loading.value = false
    }

    onMounted(() => {
        getAdditionalCharges()
    })

    return { getAdditionalCharges, loading, additionalChargesList }
}
