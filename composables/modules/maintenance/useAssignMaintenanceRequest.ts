import { maintenance_api } from "@/api_factory/modules/maintenance";
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRouter } from "vue-router"; // Make sure to import the router

const loading = ref(false);

export const useAssignMaintenanceRequest = () => {
  const { showToast } = useCustomToast();
  const router = useRouter(); // Initialize router
  const route = useRoute()

  // Function to handle rental action (either cancel or approve)
  const assignMaintenenceRequest = async (reqId: string, spid: string) => {
    loading.value = true;
    
    try {
      // Make patch request using the payload
      const res = await maintenance_api.$_assign_maintenance_to_service_provider(reqId, spid) as any;
      if (res.type !== 'ERROR') {
        showToast({
          title: "Success",
          message: 'Maintenence request has been successfully assigned to a service provider.',
          toastType: "success",
          duration: 3000
        });
        router.back()
      } else {
        showToast({
          title: "Error",
          message:  res.data.error,
          toastType: "error",
          duration: 3000
        });
        console.error("Failed to update rental status", res.message);
      }
    } catch (error) {
      showToast({
        title: "Error",
        message:  "An unexpected error occurred.",
        toastType: "error",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  };

  return { assignMaintenenceRequest, loading };
};
