import { ref } from 'vue';
import { notification_api } from '~/api_factory/modules';
import { useUser } from '~/composables/auth/user';

export const useMarkNotificationAsRead = () => {
    const { user } = useUser();
    const loading = ref(false);
    const markNotificationAsRead = async (notificationId:string) => {
        loading.value = true;
        try {
            const response = await notification_api.$_read_notifcation(user.value.id, notificationId);
            return response;
        } catch (error: any) {
            console.log("Error", error)
        } finally {
            loading.value = false;
        }
    };
    return { markNotificationAsRead, loading };
};
