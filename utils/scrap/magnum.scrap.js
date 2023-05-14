import { launch } from 'puppeteer'
import { getHref, getInnerText, getSrc } from '../puppeteer.utils.js'
import { MAGNUM_CATALOG_URL, MAGNUM_EFFECTIVE_STOCK_URL } from '../../constants/magnum.constants.js'
import { body } from 'express-validator'
import { getDigitsFromString } from '../string.js'

// Catalog
export async function getMagnumCatalog (req, res) {
	const browser = await launch()
	// Reopen page(url), because have a bug with saving location in magnum website. And getting 1 product multiple times
	const tempPage = await browser.newPage()
	await tempPage.goto(MAGNUM_CATALOG_URL)
	await tempPage.close()

	const page = await browser.newPage()
	await page.goto(MAGNUM_CATALOG_URL)

	const catalog = []

	await page.waitForSelector('.page-catalog__items .product-block')
	await page.waitForSelector('.product-block__price')
	await page.waitForSelector('.product-block__img img')

	const catalogItems = await page.$$('.page-catalog__items a.product-block')

	for (const catalogItem of catalogItems) {
		const title = await getInnerText(await catalogItem.$('.product-block__descr'))
		const imgLink = await getSrc(await catalogItem.$('img'))
		const oldPrice = await getInnerText(await catalogItem.$('.product-block__old-price'))
		const price = await getInnerText(await catalogItem.$('.product-block__price'))

		const newItem = { title, imgLink, oldPrice, price: getDigitsFromString(price), }
		catalog.push(newItem)
	}

	await browser.close()
	res.json({ data: catalog, })
}

// Stocks
export async function getMagnumAllStocks (req, res) {
	const browser = await launch()
	const page = await browser.newPage()
	await page.goto(MAGNUM_EFFECTIVE_STOCK_URL)

	const effectiveStocks = await getMagnumEffectiveStocks(page)

	const stocks = {
		effectiveStocks,
	}

	await browser.close()
	res.json({ data: stocks, })
}

export async function sendMagnumEffectiveStocks (req, res){
	const browser = await launch()
	const page = await browser.newPage()
	await page.goto(MAGNUM_EFFECTIVE_STOCK_URL)

	const effectiveStocks = await getMagnumEffectiveStocks(page)

	await browser.close()
	res.json({ data: effectiveStocks, })
}

export async function getMagnumEffectiveStocks (page) {
	await page.waitForSelector('.page-stocks__items')

	await page.click('.page-stocks__tab:nth-of-type(1)')

	const stocks = []

	const stockLinkElements = await page.$$('.stocks__item')
	for (const stockLinkElement of stockLinkElements) {
		const stockLink = await getHref(stockLinkElement)
		const stockImg = await getSrc(await stockLinkElement.$('img'))

		const newStock = { stockLink, stockImg, }
		stocks.push(newStock)
	}

	return stocks
}
