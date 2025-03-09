import { utilities_api } from "~/api_factory/modules/utilities";

const loading = ref(false);
const payload = ref({
    search: "",
    page: 1,
    perPage: 20
});
const usersList = ref<any[]>([]);
const totalUsers = ref(0);
const hasMore = ref(true);

export const useFetchAllUsers = () => {
    const fetchAllUsers = async (loadMore = false) => {
        if (loading.value) return;
        loading.value = true;
        try {
            const res = (await utilities_api.$_get_all_users(payload.value)) as any;
            if (res.type !== "ERROR") {
                const newUsers = [
                    ...res.data.result.tenants.map((user: any) => ({ ...user, role: 'TENANT' })),
                    ...res.data.result.serviceProviders.map((user: any) => ({ ...user, role: 'SERVICE_PROVIDER' })),
                    ...res.data.result.agents.map((user: any) => ({ ...user, role: 'AGENT' })),
                    ...res.data.result.admins.map((user: any) => ({ ...user, role: 'ADMIN' })),
                ];
                totalUsers.value = res.data.metadata.total;
                
                let filteredUsers = newUsers;
                console.log(newUsers, 'ggggk')
                if (payload.value.search) {
                    filteredUsers = newUsers.filter((user) =>
                        (user.firstName + " " + user.lastName + " " + user.email)
                            .toLowerCase()
                            .includes(payload.value.search.toLowerCase())
                    );
                }

                usersList.value = loadMore
                    ? [...usersList.value, ...filteredUsers]
                    : filteredUsers;

                hasMore.value = payload.value.page < res.data.metadata.pages;
            } else {
                console.error(res.data.error);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }

        loading.value = false;
    };

    const loadMore = async () => {
        if (!hasMore.value || loading.value) return;
        payload.value.page += 1;
        await fetchAllUsers(true);
    };

    const resetSearch = () => {
        payload.value.page = 1;
        hasMore.value = true;
        usersList.value = [];
    };

    watch(() => payload.value.search, async () => {
        resetSearch();
        await fetchAllUsers();
    });

    return { fetchAllUsers, loadMore, loading, payload, usersList, totalUsers, hasMore, resetSearch };
};
