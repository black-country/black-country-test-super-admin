import { ref } from 'vue';
import { notification_api } from '~/api_factory/modules';
import { useUser } from '~/composables/auth/user';

export const useFetchNotificationCount = () => {
    const notificationCount = ref(0);
    const { user } = useUser();
    const loading = ref(false);
    const fetchNotificationCount = async () => {
        loading.value = true;
        try {
            const response = await notification_api.$_get_notification_count(user.value.id);
            notificationCount.value = response?.data?.count
        } catch (error: any) {
            console.log("Error getching count", error)
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchNotificationCount();
    })

    return { fetchNotificationCount, notificationCount, loading };
};
