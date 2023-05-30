import { SMALL_CATALOG_URL } from '../../../constants/small.constants.js'
import { browser } from '../../../index.js'
import { getInnerText, getSrc } from '../../../utils/puppeteer.utils.js'
import { removeNewLineFromString, trimBoth } from '../../../utils/string.utils.js'

// Catalog
export async function getSmallCatalog(req, res) {
	try {
		const page = await browser.newPage()

		const catalog = []

		for (let i = 0; i < 2; i++) {
			await page.goto(SMALL_CATALOG_URL + `?page=${i}`)

			await page.waitForSelector('.goods')
			await page.waitForSelector('.good')
			await new Promise(resolve => setTimeout(resolve, 1000))

			const catalogItems = await page.$$('.goods .good')

			for (let i = 0; i < catalogItems.length; i++) {
				const name = removeNewLineFromString(await getInnerText(await catalogItems[i].$('.goodInfo')))
				const imgLink = await getSrc(await catalogItems[i].$('img.goodImage'))
				const oldPrice = trimBoth(await getInnerText(await catalogItems[i].$('.oldPrice')))
				const price = await getInnerText(await catalogItems[i].$('.activePrice'))
				// const url = await getHref(await catalogItems[i].$('.woocommerce-LoopProduct-link.woocommerce-loop-product__link'))
				const date = await getInnerText(await catalogItems[i].$('.goodInfo .grey'))

				// const newItem = { id, name, imgLink, url, price, oldPrice, date }
				const newItem = { name, imgLink, price, oldPrice, date, }
				catalog.push(newItem)
			}
		}

		await page.close()
		res.status(200).json({ data: catalog, })
	} catch (error) {
		console.log({ error, })
		res.status(503).json({ data: error, })
	}
}
