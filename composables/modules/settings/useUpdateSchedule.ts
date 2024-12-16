import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();
const loading = ref(false);

const updatePayload = ref({})

export const useUpdateSchedule = () => {
    const updateSchedule = async (id: any) => {
        loading.value = true;
        try {
            const res = await settings_api.$_update_schedules(id, updatePayload.value);
            showToast({
                title: "Success",
                message: 'Schedule updated successfully',
                toastType: "success",
                duration: 3000
            });
            return res;
        } catch (error) {
            showToast({
                title: "Error",
                message: 'Failed to update schedule',
                toastType: "error",
                duration: 3000
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const setPayload = (data: any) => {
        updatePayload.value = { ...data}
    }

    return {updateSchedule, setPayload, loading, updatePayload };
};
