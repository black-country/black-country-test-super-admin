import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
      $_fetch_dashboard_stats: () => {
        let url = '/admins/dashboard/summaries';
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_engagement_metrics: (userType: string, startDate: string, endDate: string) => {
        let url = `/insights/user-engagement-metrics?userType=${userType}&startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT.get(url);
      }
}
 