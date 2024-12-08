

// import { ref } from 'vue';
// import { core_apis } from '@/api_factory/core/upload';
// import { useCustomToast } from '@/composables/core/useCustomToast'
// import { useAssignLeaseToProperty } from '@/composables/modules/lease/assignLeaseToProperty'
// const { showToast } = useCustomToast();

// export const useUploadFile = () => {
//   const loading = ref(false);
//   const uploadResponse = ref({} as any);
//   const { assignLeaseToProperty, loading: processing, assignPayload, setAssignPayloadObj } = useAssignLeaseToProperty()
  
//   const { $_pdf_upload } = core_apis;
//   const localStorageObj = JSON.parse(localStorage.getItem('lease-template-payload'))

//   const pdfUploadFile = async (file: File) => {
//     loading.value = true;
//     try {
//       // Create FormData and append the file directly
//       const formData = new FormData();
//       formData.append('file', file);  // Append the file, no conversion to Base64

//       // Make the API call with FormData
//       const res = await $_pdf_upload(formData) as any;
//         console.log(res, 'upload es hee')
//       if (res.status == 201) {
//         uploadResponse.value = res.data ?? {};

//         const payloadObj = {
//           leaseAgreement: res.data.url,
//           isPublished: true
//         }

//         setAssignPayloadObj(payloadObj)
//         await assignLeaseToProperty(localStorageObj.tenantId, localStorageObj.propertyId)
//         showToast({
//             title: "Success",
//             message: 'Lease document was uploaded successfully',
//             toastType: "success",
//             duration: 3000
//           });
//       }
//     } catch (error) {
//         showToast({
//             title: "Error",
//             message: `Error uploading file:', ${error}`,
//             toastType: "error",
//             duration: 3000
//           });
//     //   console.error('Error uploading file:', error);
//     } finally {
//       loading.value = false;
//     }
//   };

//   return { pdfUploadFile, loading, uploadResponse };
// };

import { ref } from 'vue';
import { core_apis } from '@/api_factory/core/upload';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useAssignLeaseToProperty } from '@/composables/modules/lease/assignLeaseToProperty';

const { showToast } = useCustomToast();

export const useUploadFile = () => {
  const loading = ref(false); // Combined loader state
  const uploadResponse = ref<any>({});
  const { assignLeaseToProperty, loading: processing, setAssignPayloadObj } = useAssignLeaseToProperty();
  
  const { $_pdf_upload } = core_apis;
  const localStorageObj = JSON.parse(localStorage.getItem('lease-template-payload') || '{}');

  // Upload PDF file and assign lease to property
  const pdfUploadFile = async (file: File) => {
    loading.value = true; // Start loading

    try {
      const formData = new FormData();
      formData.append('file', file); // Append file to FormData

      // Make the API call to upload the PDF
      const res = await $_pdf_upload(formData);

      if (res.status === 201) {
        uploadResponse.value = res.data ?? {};

        // Prepare payload for lease assignment
        const payloadObj = {
          leaseAgreement: res.data.url,
          isPublished: true,
        };

        setAssignPayloadObj(payloadObj);

        // Assign lease to property
        await assignLeaseToProperty(localStorageObj.tenantId, localStorageObj.propertyId);

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
    } catch (error) {
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
