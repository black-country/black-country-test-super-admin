import { GATEWAY_ENDPOINT } from '../axios.config'
export const lease_api = {
      $_fetch_lease_template: () => {
        let url = '/admins/lease-agreement-templates';
        return GATEWAY_ENDPOINT.get(url);
      },
      $_update_lease_template: (id: any, payload: any) => {
        const url = `/admins/lease-agreement-templates/${id}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_delete_lease_template: (id: string | number) => {
        const url = `/admins/lease-agreement-templates/${id}`;
        return GATEWAY_ENDPOINT.delete(url);
      },
      $_create_lease_template: (payload: any) => {
        const url = `/admins/lease-agreement-templates`;
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_lease_agreement: () => {
        let url = '/lease-agreements?status=PENDING_SIGNAGE,DRAFT, REJECTED,CANCELLED,SIGNED';
        return GATEWAY_ENDPOINT.get(url);
      },
      $_assign_lease_to_property: (tenantId: any, houseId: any, payload: any) => {
        const url = `/tenants/${tenantId}/houses/${houseId}/lease-agreements`;
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_sign_lease_agreement: (agreementId: string | number, payload: any) => {
        let url = `/lease-agreements/${agreementId}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_fetch_expiring_lease_agreement: (metadata: { page: number; perPage: number }) => {
        let url = `/lease-agreements?isExpiring=true&page=${metadata.page}&perPage=${metadata.perPage}`;
        return GATEWAY_ENDPOINT.get(url);
      },
}
 