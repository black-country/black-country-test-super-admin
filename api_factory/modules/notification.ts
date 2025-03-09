import { GATEWAY_ENDPOINT } from '../axios.config'
export const notification_api = {
  $_get_notification: (id: string | number, metadata: { page: number; perPage: number }) => {
    let url = `/users/${id}/notifications/in-app`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_get_notification_count: (id: string) => {
    let url = `/users/${id}/notifications/in-app/count?isRead=false`;
    return GATEWAY_ENDPOINT.get(url);
  },
  $_read_notification: (id: string, notificationId: string) => {
    let url = `/users/${id}/notifications/in-app/${notificationId}/read`;
    return GATEWAY_ENDPOINT.patch(url);
  },
}
