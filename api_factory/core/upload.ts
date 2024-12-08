import { GATEWAY_ENDPOINT, STORIPOD_UPLOAD_GATEWAY_ENDPOINT } from '../axios.config'

export const core_apis = {
	$_upload: (payload: any) => {
		const url = '/utilities/files'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_batch_upload: (payload: any) => {
		const url = '/utilities/files/batch'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_pdf_upload: (payload: any) => {
		const url = '/files'
		return STORIPOD_UPLOAD_GATEWAY_ENDPOINT.post(url, payload)
	},
}
