import { property_api } from "@/api_factory/modules/property";
import { useGetProperties } from "@/composables/modules/property/fetchProperties";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
import { ref } from "vue";

const selectedProperty = ref({}) as any

export const usePropertyDeactivate = () => {
  const { getProperties } = useGetProperties();
  const loading = ref(false);
  const { $_update_property } = property_api;
  const router = useRouter()

  const deactivateProperty = async (id: any, actionType: string, property: any) => {
    selectedProperty.value = property
    const updatedData = {
      status: actionType === 'deactivate' ? 'hidden' : 'published'
    };
    // const updatedData = {
    //   status: actionType === 'deactivate' ? 'hidden' : 'published'
    // };


    await updateProperty(id, updatedData);
  };

  const updateProperty = async (id: any, updatedData: any) => {
    const successRoute = selectedProperty.value.status === 'published'
    ? `/dashboard/property/${selectedProperty.value.id}/deactivate-success`
    : `/dashboard/property/${selectedProperty.value.id}/activate-success`;
    loading.value = true;
    try {
      const res = await $_update_property(id, updatedData);
      if (res.type !== "ERROR") { 
        await getProperties();
        showToast({
          title: "Success",
          message: 'Success!',
          toastType: "success",
          duration: 3000
        });
        router.push(successRoute);
        return res
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return res
      }
    } catch (error) {
      console.error("Error updating property:", error);
    } finally {
      loading.value = false;
    }
  };

  return { deactivateProperty, loading };
};
