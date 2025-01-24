import { lease_api } from "@/api_factory/modules/lease";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useUser } from "@/composables/auth/user";
const { user } = useUser();

const { showToast } = useCustomToast();
const loading = ref(false)
const assignPayload = ref({
    agreementName: "",
    leaseAgreement: "<html></html>",
    isPublished: false,
    startDate: "",
    endDate: "",
    houseOwnerSigneeName: ""
})
const router = useRouter()
const localStorageObj = JSON.parse(localStorage.getItem('lease-template-payload') || '{}');

export const useAssignLeaseToProperty = () => {
	const assignLeaseToProperty = async (tenantId: string | number, houseId: string | number) => {
		loading.value = true
		const res = await  lease_api.$_assign_lease_to_property(tenantId, houseId, {
            leaseAgreement: `<html>${assignPayload.value.leaseAgreement}</html>`,
            houseOwnerSigneeName: `${user?.value?.firstName} ${user?.value?.lastName}` || "",
            agreementName: assignPayload.value.agreementName,
            isPublished: assignPayload.value.isPublished,
            startDate: localStorageObj?.startDate,
            endDate: localStorageObj?.endDate,
        }) as any
         
        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Lease was successfully assigned to property',
                toastType: "success",
                duration: 3000
              });
              window.location.href = '/dashboard/property/lease-documents/lease-document-success'
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
        assignPayload.value.leaseAgreement = data?.leaseAgreement
        assignPayload.value.isPublished = data?.isPublished
        assignPayload.value.agreementName = data?.agreementName
        assignPayload.value.startDate = localStorageObj?.startDate
        assignPayload.value.endDate = localStorageObj?.endDate
        assignPayload.value.houseOwnerSigneeName = data?.houseOwnerSigneeName
	}

	return { assignLeaseToProperty, loading, assignPayload, setAssignPayloadObj }
}
