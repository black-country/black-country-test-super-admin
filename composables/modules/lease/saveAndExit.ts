import { lease_api } from "@/api_factory/modules/lease";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
import { useUser } from "@/composables/auth/user";
const { user } = useUser();

const leaseSignatureUrl = localStorage.getItem('lease-signature-url')
const processingSaveAndExit = ref(false)
const assignPayload = ref({
    leaseAgreement: "<html></html>",
    isPublished: false,
    houseOwnerSigneeName: "",
    houseOwnerSignatureUrl: "",
})
const router = useRouter()

export const useSaveAndExit = () => {
	const handleSaveAndExit = async (tenantId: string | number, houseId: string | number) => {
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
		processingSaveAndExit.value = true
		const res = await  lease_api.$_assign_lease_to_property(tenantId, houseId, {
            leaseAgreement: assignPayload.value.leaseAgreement,
            isPublished: false,
            houseOwnerSigneeName: `${localUser.firstName || ''} ${localUser.lastName || ''}`.trim() || assignPayload.value.houseOwnerSigneeName,
            houseOwnerSignatureUrl: leaseSignatureUrl || assignPayload.value.houseOwnerSignatureUrl
        }) as any

        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Lease was successfully saved as Draft',
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
        processingSaveAndExit.value = false
	}

    const setSaveAndExitPayloadObj = (data: any) => {
        assignPayload.value.leaseAgreement = data.leaseAgreement || '';
        assignPayload.value.houseOwnerSigneeName = data.houseOwnerSigneeName || '';
        assignPayload.value.houseOwnerSignatureUrl = data.houseOwnerSignatureUrl || leaseSignatureUrl;
	}

	return { handleSaveAndExit, processingSaveAndExit, assignPayload, setSaveAndExitPayloadObj }
}
