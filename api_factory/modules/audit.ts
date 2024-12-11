import { GATEWAY_ENDPOINT } from '../axios.config'
export const audit_api = {
	$_fetch_audits: (metadata: { page: number; perPage: number }) => {
		const url = `/audits?page=${metadata.page}&perPage=${metadata.perPage}`
		return GATEWAY_ENDPOINT.get(url)
	}
}
