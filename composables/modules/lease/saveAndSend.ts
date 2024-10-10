import { lease_api } from "@/api_factory/modules/lease";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const processingSaveAndSend = ref(false)
const assignPayload = ref({
    leaseAgreement: "<html></html>",
    isPublished: true
})
const router = useRouter()

export const useSaveAndSend = () => {
	const handleSaveAndSend = async (tenantId: string | number, houseId: string | number) => {
		processingSaveAndSend.value = true
		const res = await  lease_api.$_assign_lease_to_property(tenantId, houseId, {
            leaseAgreement: `<html>${assignPayload.value.leaseAgreement}</html>`,
            isPublished: true
        }) as any

        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Lease was successfully saved and sent to tenant.',
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
        processingSaveAndSend.value = false
	}

    const setSaveAndSendPayloadObj = (data: any) => {
        assignPayload.value.leaseAgreement = data.leaseAgreement
	}

	return { handleSaveAndSend, processingSaveAndSend, assignPayload, setSaveAndSendPayloadObj }
}
