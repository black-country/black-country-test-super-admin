import { message_api } from "@/api_factory/modules/messages";


const roomObj = ref({})
  
export const useCreateRoom = () => {
  const loading = ref(false);
  const { $_create_room } = message_api;
  const createRoom = async (payload: any) => {
    loading.value = true;
    try {
      const res = (await $_create_room(payload)) as any;
      console.log(res.data, 'hrtt')
      if (res.type !== "ERROR") {
        roomObj.value = res?.data
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      loading.value = false;
    }
  };


  return {
    createRoom,
    loading,
    roomObj,
  };
};
