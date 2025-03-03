import { GATEWAY_ENDPOINT } from '../axios.config'
export const utilities_api = {
  $_get_all_users: (payload : any) => {
    let url = `/utilities/search`;
    return GATEWAY_ENDPOINT.post(url, payload);
  },
}
