import { GATEWAY_ENDPOINT } from '../axios.config'
export const tenant_api = {
    $_fetch_tenants: (metadata: { page: number; perPage: number }, filters: any) => {
        let url = `/tenants?page=${metadata.page}&perPage=${metadata.perPage}`;
      
        // Check if search query exists and add it to the URL
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
        }      
        return GATEWAY_ENDPOINT.get(url);
      },
      $_tenent_details: (id: string) => {
        let url = `/tenants/${id}/details`;
        return GATEWAY_ENDPOINT.get(url);
      }
}
