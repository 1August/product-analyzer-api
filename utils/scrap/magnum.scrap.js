import { getHref, getSrc } from '../puppeteer.utils.js'

export async function getMagnumEffectiveStocks(page) {
	try {
		await page.waitForSelector('.page-stocks__items')

		await page.click('.page-stocks__tab:nth-of-type(1)')

		await page.waitForSelector('.stocks__item img')
		await page.waitForSelector('.default-wrapper .page-stocks__items img')
		await new Promise(resolve => setTimeout(resolve, 1000))

		const stocks = []

		const stockLinkElements = await page.$$('.stocks__item')
		for (const stockLinkElement of stockLinkElements) {
			const stockLink = await getHref(stockLinkElement)
			const stockImg = await getSrc(await stockLinkElement.$('img'))

			const newStock = { stockLink, stockImg, }
			stocks.push(newStock)
		}

		return stocks
	} catch (error) {
		return []
	}
}
