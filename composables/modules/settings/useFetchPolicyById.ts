import { settings_api } from "@/api_factory/modules/settings";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const loading = ref(false);
const policyObj = ref({});
const route = useRoute();

export const useFetchPolicyById = () => {
    const route = useRoute();
    const fetchPolicyById = async () => {
        if (!route.params || !route.params.id) {
            console.warn("Route params or ID is not defined.");
            return;
        }

        loading.value = true;
        try {
            const res = await settings_api.$_get_policy_by_id(route.params.id);
            console.log(res, "res here");
            if (res.type !== "ERROR") {
                policyObj.value = res?.data ?? {};
            }
        } catch (error) {
            console.error("Error fetching policy:", error);
        } finally {
            loading.value = false;
        }
    };

    // onMounted(() => {
    //     fetchPolicyById();
    // });

    watch(
        () => route,
        (newId, oldId) => {
            console.log(newId.params.id, 'updated route here')
            fetchPolicyById();
        },
        { immediate: true } // Ensures the watcher runs immediately
    );

    return { loading, fetchPolicyById, policyObj };
};
