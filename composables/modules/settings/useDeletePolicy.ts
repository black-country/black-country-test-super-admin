import axios from 'axios';
import { ref } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
import { useUser } from "@/composables/auth/user";
const { fetchPolicy } = useFetchPolicy()
const { token } = useUser();

export const useDeletePolicy = () => {
  const loading = ref(false);
  const payload = ref({ ids: [] });
  const { showToast } = useCustomToast()

  const deletePolicy = async () => {
    loading.value = true;

    try {
        const response = await axios.request({
          method: 'DELETE',
          url: 'https://dev.api.blackcountry.africa/v1/policies/batch', // Removed extra `/` in the URL
          headers: {
            Authorization: `Bearer ${token.value}`, // Ensure token is properly passed
          },
          data: {
            ids: payload.value.ids, // Pass the payload as data
          },
        });
      
        console.log(response.data);
      
        if (response.data.type !== 'ERROR') {
          showToast({
            title: "Success",
            message: "Policies were deleted successfully",
            toastType: "success",
            duration: 3000,
          });
      
          if (typeof fetchPolicy === "function") {
            fetchPolicy(); // Ensure fetchPolicy exists before calling it
          } else {
            console.warn("fetchPolicy function is not defined.");
          }
      
        //   window.location.reload();
        } else {
          console.error('Error response:', response.data);
        }
      } catch (error) {
        console.error('Error deleting policies:', error.response?.data || error.message);
      } finally {
        loading.value = false;
      }
      
  };

  const setPayload = (data: any) => {
    payload.value.ids = data;
  };

  return { deletePolicy, loading, setPayload };
};
