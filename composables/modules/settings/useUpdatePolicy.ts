import { settings_api } from '@/api_factory/modules/settings';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const { showToast } = useCustomToast();
const loading = ref(false);
const route = useRoute();
const router = useRouter();

const updatedPayload = ref({
    name: "",
    content: "",
    type: "",
    description: "",
    app: "",
});

export const useUpdatePolicy = () => {
    const router = useRouter();
    const route = useRoute();
    const updatePolicy = async () => {
        try {
            loading.value = true;

            const res = await settings_api.$_update_policy(updatedPayload?.value, route?.params?.id) as any;

            if (res.status === 200 || res.status === 201) {
                showToast({
                    title: "Success",
                    message: "Policy was updated successfully",
                    toastType: "success",
                    duration: 3000,
                });

                // Forcefully push to the route by using replace or by adding a key to ensure a fresh view
                router.push({
                    path: '/dashboard/settings',
                    query: { forceReload: new Date().getTime() }, // Adding a query param to ensure uniqueness
                });
            } else {
                showToast({
                    title: "Error",
                    message: "Failed to update policy",
                    toastType: "error",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error updating policy:", error);
            showToast({
                title: "Error",
                message: "Failed to update policy",
                toastType: "error",
                duration: 3000,
            });
        } finally {
            loading.value = false;
        }
    };

    const setUpdatedPayload = (data: any) => {
        updatedPayload.value = { ...data };
    };

    return { updatePolicy, setUpdatedPayload, loading, updatedPayload };
};
