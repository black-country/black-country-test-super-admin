import { ref } from 'vue';
import { core_apis } from '@/api_factory/core/upload';
import { useCustomToast } from '@/composables/core/useCustomToast';

const { showToast } = useCustomToast();

export const useUploadFile = () => {
  const loading = ref(false); // Combined loader state
  const uploadResponse = ref<any>({});
  
  const { $_upload } = core_apis;

  // Upload PDF file and assign lease to property
  const pdfUploadFile = async (file: File) => {
    loading.value = true; // Start loading

    try {
      const formData = new FormData();
      formData.append('file', file); // Append file to FormData

      // Make the API call to upload the PDF
      const res = await $_upload(formData);

      if (res.status === 201) {
        uploadResponse.value = res.data ?? {};


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

  return { pdfUploadFile, loading, uploadResponse };
};
