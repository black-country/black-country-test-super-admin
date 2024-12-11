import { GATEWAY_ENDPOINT } from '../axios.config'
export const tenant_api = {
    $_fetch_tenants: (metadata: { page: number; perPage: number }, filters: any) => {
        let url = `/tenants?page=${metadata.page}&perPage=${metadata.perPage}&isHomeOwner=true`;
      
        // Check if search query exists and add it to the URL
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
        }      
        return GATEWAY_ENDPOINT.get(url);
      },
      $_tenent_details: (id: string) => {
        let url = `/tenants/${id}/details`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_transaction_history: (tenentId: string | number, page = 1, perPage = 20) => {
        let url = `/tenants/${tenentId}/payments?page=${page}&perPage=${perPage}&sort=transactionDate:desc`
        return GATEWAY_ENDPOINT.get(url)
      },
      $_fetch_lease_documents: (tenentId: string | number) => {
        let url = `/tenants/${tenentId}/lease-documents`
        return GATEWAY_ENDPOINT.get(url)
      },
      $_fetch_rental_checklist: (tenentId: string | number) => {
        let url = `/tenants/${tenentId}/rental-checklists`
        return GATEWAY_ENDPOINT.get(url)
      },
      $_fetch_maintenance_request: (tenentId: string | number, page = 1, perPage = 100000000) => {
        let url = `/maintenance-requests?page=${page}&perPage=${perPage}&tenantId=${tenentId}`
        return GATEWAY_ENDPOINT.get(url)
      },
}
