import { providers } from '../constants/providers.constants.js'

export function getProviderName (url) {
	const Url = new URL(url)
	const domainName = Url.hostname
	return providers[domainName] || new Error('Can not found check provider')
}
