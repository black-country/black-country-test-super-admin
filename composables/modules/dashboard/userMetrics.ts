import { dashboard_api } from '@/api_factory/modules/dashboard';
import { ref, onMounted, watch } from 'vue';

export const useFetchUserMetrics = () => {
    const loading = ref(false);

    const filterObj = ref({
        userType: 'TENANT',
        startDate: '',
        endDate: '',
    });

    const signupMetricsObj = ref({} as Record<string, any>);
    const engagementMetricsObj = ref({} as Record<string, any>);

    // Set default dates when the composable is initialized
    const setDefaultDates = () => {
        const today = new Date().toISOString().split('T')[0];
        filterObj.value.startDate = today;
        filterObj.value.endDate = today;
    };

    const { $_fetch_signup_metrics, $_fetch_engagement_metrics } = dashboard_api;

    const fetchSignupMetrics = async () => {
        try {
            const res = await $_fetch_signup_metrics(
                filterObj.value.userType,
                filterObj.value.startDate,
                filterObj.value.endDate
            ) as any;

            if (res.type !== 'ERROR') {
                signupMetricsObj.value = res?.data ?? {};
            }
        } catch (error) {
            console.error('Error fetching signup metrics:', error);
        }
    };

    const fetchEngagementMetrics = async () => {
        try {
            const res = await $_fetch_engagement_metrics(
                filterObj.value.userType,
                filterObj.value.startDate,
                filterObj.value.endDate
            ) as any;

            if (res.type !== 'ERROR') {
                engagementMetricsObj.value = res?.data ?? {};
            }
        } catch (error) {
            console.error('Error fetching engagement metrics:', error);
        }
    };

    const fetchUserMetrics = async () => {
        loading.value = true;
        await Promise.all([fetchSignupMetrics(), fetchEngagementMetrics()]);
        loading.value = false;
    };

    // Set default dates immediately
    setDefaultDates();

    onMounted(() => {
        fetchUserMetrics();
    });

    // Watch for changes in startDate and endDate
    watch(
        () => [filterObj.value.startDate, filterObj.value.endDate],
        () => {
            fetchUserMetrics();
        }
    );

    return { filterObj, loading, signupMetricsObj, engagementMetricsObj, fetchUserMetrics };
};
