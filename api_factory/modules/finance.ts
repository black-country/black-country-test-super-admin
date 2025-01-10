import { GATEWAY_ENDPOINT } from "../axios.config";

export const finance_api = {
    $_fetch_transactions: (metadata: { page: number; perPage: number }, filters: any) => {
        let url = `/finance/transactions?page=${metadata.page}&perPage=${metadata.perPage}`;
      
        // Check if search query exists and add it to the URL
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
        }
    
        if (filters.fromDate) {
          url += `&startDate=${encodeURIComponent(filters.fromDate)}`;
        }
        if (filters.toDate) {
          url += `&endDate=${encodeURIComponent(filters.toDate)}`;
        }
    
        return GATEWAY_ENDPOINT.get(url);
      },
  $_fetch_fianance_summaries: () => {
    const url = '/finance/summaries';
    return GATEWAY_ENDPOINT.get(url);
  }
};
