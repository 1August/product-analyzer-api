import { GALMART_CATALOG_URL } from '../../../constants/galmart.constants.js'
import { browser } from '../../../index.js'
import { getHref, getInnerText, getSrc } from '../../../utils/puppeteer.utils.js'

// Catalog
export async function getGalmartCatalog(req, res) {
	try {
		const page = await browser.newPage()
		await page.goto(GALMART_CATALOG_URL)

		const catalog = []

		await page.waitForSelector('ul.products')
		await page.waitForSelector('ul.products li.product')
		await new Promise(resolve => setTimeout(resolve, 1000))

		const catalogItems = await page.$$('ul.products li.product')

		for (let i = 0; i < catalogItems.length; i++) {
			const id = await catalogItems[i].$eval('.button', prod => prod.getAttribute('data-product_id'))
			const name = await getInnerText(await catalogItems[i].$('.woocommerce-loop-product__title'))
			const imgLink = await getSrc(await catalogItems[i].$('img.attachment-woocommerce_thumbnail.size-woocommerce_thumbnail'))
			const price = await getInnerText(await catalogItems[i].$('.woocommerce-Price-amount.amount bdi'))
			const url = await getHref(await catalogItems[i].$('.woocommerce-LoopProduct-link.woocommerce-loop-product__link'))

			const newItem = { id, name, imgLink, url, price, }
			catalog.push(newItem)
		}

		await page.close()
		res.status(200).json({ data: catalog, })
	} catch (error) {
		console.log({error,})
		res.status(503).json({ data: error, })
	}
}

// Stocks
// export async function getMagnumAllStocks (req, res) {
// 	try {
// 		const page = await browser.newPage()
// 		await page.goto(MAGNUM_EFFECTIVE_STOCK_URL)
//
// 		const effectiveStocks = await getMagnumEffectiveStocks(page)
//
// 		await page.close()
// 		res.status(200).json({ data: effectiveStocks, })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
//
// export async function sendMagnumEffectiveStocks(req, res) {
// 	try {
// 		const page = await browser.newPage()
// 		await page.goto(MAGNUM_EFFECTIVE_STOCK_URL)
//
// 		const effectiveStocks = await getMagnumEffectiveStocks(page)
//
// 		await page.close()
// 		res.status(200).json({ data: effectiveStocks, })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }


