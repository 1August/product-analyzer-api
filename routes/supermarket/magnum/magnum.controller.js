import { MAGNUM_EFFECTIVE_STOCK_URL } from '../../../constants/magnum.constants.js'
import { browser } from '../../../index.js'
import { getMagnumEffectiveStocks } from '../../../utils/scrap/magnum.scrap.js'
import axios from 'axios'

// Catalog
export async function getMagnumCatalog(req, res) {
	try {
		const response = await axios.get('https://magnum.kz:1337/api/products?pagination[page]=1&pagination[pageSize]=1500&populate[image]=*&populate[localizations]=*&populate[category]=*&sort[0]=id:asc&filters[id][$ne]=3&filters[shops][city][id][$eq]=3&locale=ru')
		const data = await response.data.data
		res.status(200).json({ data, })

		// // Reopen page(url), because have a bug with saving location in magnum website. And getting 1 product multiple times
		// const tempPage = await browser.newPage()
		// await tempPage.goto(MAGNUM_CATALOG_URL)
		// await tempPage.close()
		//
		// const page = await browser.newPage()
		// await page.goto(MAGNUM_CATALOG_URL)
		//
		// await page.evaluate(() => {
		// 	window.scrollTo(0, window.document.body.scrollHeight)
		// })
		// await new Promise(resolve => setTimeout(resolve, 3000))
		//
		// const catalog = []
		//
		// await page.waitForSelector('.page-catalog__items .product-block')
		// await page.waitForSelector('.product-block__price')
		// await page.waitForSelector('.product-block__img img')
		//
		//
		// const catalogItems = await page.$$('.page-catalog__items a.product-block')
		//
		// for (let i = 0; i < catalogItems.length; i++) {
		// 	const id = await page.$eval(`.page-catalog__items a.product-block:nth-of-type(${i + 1})`, prod => {
		// 		const linkElement = prod.getAttribute('href')
		// 		const id = linkElement.substring(linkElement.lastIndexOf('/') + 1, linkElement.indexOf('?'))
		// 		return id
		// 	})
		// 	const name = await getInnerText(await catalogItems[i].$('.product-block__descr'))
		// 	const imgLink = await getSrc(await catalogItems[i].$('img'))
		// 	const oldPrice = await getInnerText(await catalogItems[i].$('.product-block__old-price'))
		// 	const price = await getInnerText(await catalogItems[i].$('.product-block__price'))
		// 	const url = await page.$eval(`.page-catalog__items a.product-block:nth-of-type(${i + 1})`, prod => prod.getAttribute('href'))
		//
		// 	const newItem = { id, name, imgLink, url, oldPrice, price: trimBoth(getDigitsFromString(price)), }
		// 	catalog.push(newItem)
		// }
		//
		// await page.close()
		// res.status(200).json({ data: catalog, })
	} catch (error) {
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

export async function sendMagnumEffectiveStocks(req, res) {
	try {
		const page = await browser.newPage()
		await page.goto(MAGNUM_EFFECTIVE_STOCK_URL)

		const effectiveStocks = await getMagnumEffectiveStocks(page)

		await page.close()
		res.status(200).json({ data: effectiveStocks, })
	} catch (error) {
		res.status(503).json({ data: error, })
	}
}


