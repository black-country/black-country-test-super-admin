import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
      $_fetch_dashboard_stats: () => {
        let url = '/admins/dashboard/summaries';
        return GATEWAY_ENDPOINT.get(url);
      }
}
 