import { lease_api } from "@/api_factory/modules/lease";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const loading = ref(false)
const assignPayload = ref({
    leaseAgreement: "<html></html>",
    isPublished: false
})
const router = useRouter()

export const useAssignLeaseToProperty = () => {
	const assignLeaseToProperty = async (tenantId: string | number, houseId: string | number) => {
		loading.value = true
		const res = await  lease_api.$_assign_lease_to_property(tenantId, houseId, {
            leaseAgreement: `<html>${assignPayload.value.leaseAgreement}</html>`,
        }) as any

        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Lease was successfully assigned to property',
                toastType: "success",
                duration: 3000
              });
              router.push('/dashboard/property/lease-documents/lease-document-success')
        } else {
            showToast({
                title: "Error",
                message: res.data.error || 'Something went wrong!',
                toastType: "error",
                duration: 3000
              });
        }
        loading.value = false
	}

    const setAssignPayloadObj = (data: any) => {
        console.log(data, 'caught from composable')
        assignPayload.value.leaseAgreement = data.leaseAgreement
        assignPayload.value.isPublished = data.isPublished
	}

	return { assignLeaseToProperty, loading, assignPayload, setAssignPayloadObj }
}
