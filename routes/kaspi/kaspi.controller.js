import { scrapKaspiProductPage } from '../../utils/scrap/kaspi.scrap.js'
import { launch } from 'puppeteer'
import { getInnerText } from '../../utils/puppeteer.utils.js'

export const productInfoGet = async (req, res) => {
	const url = req.query.url

	const product = await scrapKaspiProductPage(url)

	res.json({ data: product, })
}

export const kaspiSearchPost = async (req, res) => {
	const { query, } = req.body

	const baseUrl = 'https://kaspi.kz'
	const url = new URL(`/shop/search/?text=${query}`, baseUrl)

	const browser = await launch()
	const page = await browser.newPage()
	await page.goto(url.href)

	await page.waitForSelector('.item-cards-grid__cards')

	const foundProducts = await page.$$('.item-card__info')

	const products = []
	for (let i in foundProducts) {
		const product = {
			name: await getInnerText(foundProducts[i].$('.item-card__name-link')),
			price: await getInnerText(foundProducts[i].$('.item-card__prices-price')),
		}

		products.push(product)
	}

	await browser.close()
	return res.json({ data: products, })
}
