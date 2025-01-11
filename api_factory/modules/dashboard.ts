import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
      $_fetch_dashboard_stats: () => {
        let url = '/admins/dashboard/summaries';
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_engagement_metrics: (userType: string, startDate: string, endDate: string) => {
        let url = `/insights/user-engagement-metrics?userType=${userType}&startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_signup_metrics: (userType: string, startDate: string, endDate: string) => {
        let url = `/insights/signup-chart-data?userType=${userType}&startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_house_metrics: (startDate: string, endDate: string, agentId: string, houseId: string, propertyManagerId: string) => {
        let url = `/insights/houses?startDate=${startDate}&endDate=${endDate}&agentId=${agentId}&houseId=${houseId}&propertyManagerId=${propertyManagerId}`
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_revenue_metrics: (startDate: string, endDate: string) => {
        let url = `/insights/revenue-chart-data?startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_occupancy_metrics: (startDate: string, endDate: string) => {
        let url = `/insights/occupancy-chart-data?startDate=${startDate}&endDate=${endDate}`
        return GATEWAY_ENDPOINT.get(url);
      },
}
 