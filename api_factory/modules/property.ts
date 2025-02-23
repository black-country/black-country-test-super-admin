import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_V2 } from "../axios.config";

export const property_api = {
  $_create: (payload: any) => {
    const url = "/houses";
    return GATEWAY_ENDPOINT.post(url, payload);
  },
  $_fetch_properties: (metadata: { page: number; perPage: number }, filters: any) => {
    let url = `/houses?page=${metadata.page}&perPage=${metadata.perPage}`;
  
    // Check if search query exists and add it to the URL
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
    }
  
    // Add other filters to the URL
    if (filters.status !== null) { // Check if status is not null
      url += `&status=${filters.status}`;
    }
    if (filters.fromDate) {
      url += `&fromDate=${encodeURIComponent(filters.fromDate)}`;
    }
    if (filters.toDate) {
      url += `&toDate=${encodeURIComponent(filters.toDate)}`;
    }
    if (filters.agentId) {
      url += `&agentId=${encodeURIComponent(filters.agentId)}`;
    }
  
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_single_property: (id: string | number) => {
    const url = `/houses/${id}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_floorings: () => {
    const url = "/house-flooring-types";
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_property_types: () => {
    const url = "/house-types";
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_common_areas: () => {
    const url = "/common-areas";
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_room_features: () => {
    const url = "/rooms/features";
    return GATEWAY_ENDPOINT.get(url);
  },
  $_update_property: (id: any, payload: any) => {
    const url = `/houses/${id}`;
    return GATEWAY_ENDPOINT.patch(url, payload);
  },
  $_delete_property: (id: string | number) => {
    const url = `/houses/${id}`;
    return GATEWAY_ENDPOINT.delete(url);
  },
  $_duplicate_property: (id: string | number) => {
    const url = `/houses/${id}/duplicates`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_add_interior_common_area: (id: string | number) => {
    const url = `/houses/${id}/duplicates`;
    return GATEWAY_ENDPOINT.post(url);
  },
  $_fetch_properties_with_rentals: (filters: any) => { 
    let url = `/houses?page=1&perPage=100000&withRentalApplocation=true`;

        // Check if search query exists and add it to the URL
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
        }

    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_tenant_with_active_rental_application: (id: string, metadata: { page: number; perPage: number }, filters: any) => {
    let url = `/houses/${id}/tenants-applied?page=${metadata.page}&perPage=${metadata.perPage}`
  
    // Check if search query exists and add it to the URL
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
    }      
    return GATEWAY_ENDPOINT.get(url);
  },
  $_fetch_additional_charges: (category: string) => {
    const url = `/additional-charges?category=${category}`;
    return GATEWAY_ENDPOINT.get(url);
  },
  // $_fetch_property_tenants: (houseId: string) => {
  //   const url = `/rentals/houses/${houseId}/tenants`;
  //   return GATEWAY_ENDPOINT.get(url);
  // },
  // $_fetch_property_payment_histories: (houseId: string) => {
  //   const url = `houses/${houseId}/payments`;
  //   return GATEWAY_ENDPOINT.get(url);
  // },
  $_fetch_property_tenants: (houseId: any, metadata: { page: number; perPage: number }, filters: any) => {
    let url = `/rentals/houses/${houseId}/tenants?page=${metadata.page}&perPage=${metadata.perPage}`;
  
    // Check if search query exists and add it to the URL
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
    }
  
    // Add other filters to the URL
    if (filters.status !== null) { // Check if status is not null
      url += `&status=${filters.status}`;
    }
    if (filters.fromDate) {
      url += `&fromDate=${encodeURIComponent(filters.fromDate)}`;
    }
    if (filters.toDate) {
      url += `&toDate=${encodeURIComponent(filters.toDate)}`;
    }
    if (filters.agentId) {
      url += `&agentId=${encodeURIComponent(filters.agentId)}`;
    }
  
    return GATEWAY_ENDPOINT.get(url);
  },

  $_fetch_property_payment_histories: (houseId: any, metadata: { page: number; perPage: number }, filters: any) => {
    let url = `/houses/${houseId}/payments?page=${metadata.page}&perPage=${metadata.perPage}`;
  
    // Check if search query exists and add it to the URL
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
    }
  
    // Add other filters to the URL
    if (filters.status !== null) { // Check if status is not null
      url += `&status=${filters.status}`;
    }
    if (filters.fromDate) {
      url += `&fromDate=${encodeURIComponent(filters.fromDate)}`;
    }
    if (filters.toDate) {
      url += `&toDate=${encodeURIComponent(filters.toDate)}`;
    }
    if (filters.agentId) {
      url += `&agentId=${encodeURIComponent(filters.agentId)}`;
    }
  
    return GATEWAY_ENDPOINT.get(url);
  },
};
