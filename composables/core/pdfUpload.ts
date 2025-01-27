import { ref } from 'vue';
import { core_apis } from '@/api_factory/core/upload';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useAssignLeaseToProperty } from '@/composables/modules/lease/assignLeaseToProperty';
import { useUser } from "@/composables/auth/user";
const { user } = useUser();

const { showToast } = useCustomToast();

export const useUploadFile = () => {
  const loading = ref(false); // Combined loader state
  const uploadResponse = ref<any>({});
  const { assignLeaseToProperty, loading: processing, setAssignPayloadObj } = useAssignLeaseToProperty();
  
  const { $_upload } = core_apis;
  const localStorageObj = JSON.parse(localStorage.getItem('lease-template-payload') || '{}');

  // Upload PDF file and assign lease to property
  const pdfUploadFile = async (file: File, agreementObj?: any) => {
    loading.value = true; // Start loading

    try {
      const formData = new FormData();
      formData.append('file', file); // Append file to FormData

      // Make the API call to upload the PDF
      const res = await $_upload(formData);

      if (res.status === 201) {
        console.log(res.data, 'upload respomse')
        uploadResponse.value = res.data ?? {};

        // Prepare payload for lease assignment
        const payloadObj = {
          leaseAgreement: res.data.url,
          isPublished: agreementObj.isPublished,
          houseOwnerSigneeName: `${user?.value?.firstName} ${user?.value?.lastName}` || "",
          agreementName: agreementObj.agreementName,
          startDate: agreementObj?.startDate,
          endDate: agreementObj?.endDate,
        };

        setAssignPayloadObj(payloadObj);

        // Assign lease to property
        await assignLeaseToProperty(localStorageObj?.tenantId, localStorageObj?.propertyId, 'pdf');

        // Show success toast
        // showToast({
        //   title: 'Success',
        //   message: 'Lease document was uploaded successfully',
        //   toastType: 'success',
        //   duration: 3000,
        // });

      } else {
        // Handle unexpected response status
        throw new Error('Unexpected response status from upload');
      }
    } catch (error: any) {
      // Handle error
      console.error('Error during upload or lease assignment:', error);

      showToast({
        title: 'Error',
        message: `Error uploading file: ${error.message || error}`,
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false; // Stop loading
    }
  };

  return { pdfUploadFile, loading, uploadResponse, processing };
};
