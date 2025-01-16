import { GATEWAY_ENDPOINT } from "../axios.config";

export const settings_api = {
      $_create_notification_preferences: (payload: any) => {
        const url = '/preferences/admins';
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_notification_preferences: () => {
        const url = '/preferences/users';
        return GATEWAY_ENDPOINT.get(url);
      },
      $_create_notification_schedule: (payload: any) => {
        const url = '/notifications/schedules';
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_schedules: (metadata: { page: number, perPage: number }) => {
        const url = `/notifications/schedules?page=${metadata.page}&perPage=${metadata.perPage}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_fetch_deliveries: (id: any) => {
        const url = `/notifications/schedules/${id}/deliveries`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_update_schedules: (id: string | number, payload: any) => {
        const url = `/notifications/schedules/${id}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_create_schedules: (payload: any) => {
        const url = '/notifications/schedules'
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_schedule_by_id: (id: any) => {
        const url = `/notifications/schedules/${id}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_create_faq: (payload: any) => {
        const url = '/faqs';
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_fetch_faq: (app: any) => {
        const url = `/faqs?app=${app}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_create_policy: (payload: any) => {
        const url = '/policies';
        return GATEWAY_ENDPOINT.post(url, payload);
      },
      $_update_policy: (payload: any, id: any) => {
        const url = `/policies/${id}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_update_faq: (payload: any, id: any) => {
        const url = `/faqs/${id}`;
        return GATEWAY_ENDPOINT.patch(url, payload);
      },
      $_batch_delete_policy: (payload: any) => {
        console.log(payload, 'from api factoruy')
        const url = '/policies/batch';
        return GATEWAY_ENDPOINT.delete(url, payload);
      },
      $_fetch_policy: (app: any) => {
        const url = `/policies?app=${app}`;
        return GATEWAY_ENDPOINT.get(url);
      }
};
