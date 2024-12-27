import { GATEWAY_ENDPOINT } from '../axios.config'
export const payment_api = {
    $_get_overdue_payment: (metadata: { page: number; perPage: number }) => {
        let url = `/payments/overdue?page=${metadata.page}&perPage=${metadata.perPage}`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_upcoming_due_payment: (metadata: { page: number; perPage: number }) => {
        let url = `/payments/upcoming-due?page=${metadata.page}&perPage=${metadata.perPage}`;
        return GATEWAY_ENDPOINT.get(url);
      },
}
