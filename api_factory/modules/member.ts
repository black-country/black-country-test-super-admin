import { GATEWAY_ENDPOINT } from '../axios.config'
export const member_api = {
    $_invite_member: (payload: any) => {
        let url = '/invitations'
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_members: (metadata: { page: number; perPage: number }, filters: any) => {
        let url = `/admins/members?page=${metadata.page}&perPage=${metadata.perPage}`;
        if (filters.searchQuery && filters.searchQuery.trim() !== "") {
          url += `&search=${encodeURIComponent(filters.searchQuery.trim())}`;
        }
        if (filters.fromDate) {
          url += `&fromDate=${encodeURIComponent(filters.fromDate)}`;
        }
        if (filters.toDate) {
          url += `&toDate=${encodeURIComponent(filters.toDate)}`;
        }
        return GATEWAY_ENDPOINT.get(url);
      },
      $_update_member: (id: any, payload: any) => {
        const url = `/members/${id}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_delete_member: (id: string | number) => {
        const url = `/members/${id}`;
        return GATEWAY_ENDPOINT.delete(url);
      },
      $_member_details: (id: string | number, group:string) => {
        const url = `/admins/members/${id}?group=${group}`;
        return GATEWAY_ENDPOINT.get(url);
      },
}
