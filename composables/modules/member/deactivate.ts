import { member_api } from "@/api_factory/modules//member";
import { useGetProperties } from "@/composables/modules/property/fetchProperties";
import { ref } from "vue";

export const useDeactivateMember = () => {
  const { getProperties } = useGetProperties();
  const loading = ref(false);
  const { $_update_member } = member_api

  const deactivateMember = async (id: any, actionType: string) => {
    const updatedData = {
      isActive: actionType !== 'deactivate'
    };

    await updateMember(id, updatedData);
  };

  const updateMember = async (id: any, updatedData: any) => {
    loading.value = true;
    try {
      const res = await $_update_member(id, updatedData) as any
      if (res.type !== "ERROR") {
        await getProperties();
      }
    } catch (error) {
    } finally {
      loading.value = false;
    }
  };

  return { deactivateMember, loading };
};
