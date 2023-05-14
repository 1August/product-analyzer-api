import { getInnerText, getSrc } from '../puppeteer.utils.js'
import { getDigitsFromString } from '../string.js'
import { launch } from 'puppeteer'

export async function scrapKaspiProductPage(url) {
	const browser = await launch()
	const page = await browser.newPage()
	await page.goto(url)

	const id = getDigitsFromString(await getInnerText(await page.$('.item__sku')))
	const name = await getInnerText(await page.$('.item__heading'))
	const price = await getInnerText(await page.$('.item__price-once'))
	const imgLink = await getSrc(await page.$('.item__slider-pic'))

	const shortSpecificationsScraped = await page.$$('.short-specifications__text')
	let shortSpecifications = []
	for (let specification of shortSpecificationsScraped) {
		shortSpecifications.push(await getInnerText(specification))
	}

	const sellersScraped = await page.$$('.sellers-table__self tbody tr')
	let sellers = []
	for (const seller of sellersScraped) {
		const newSeller = {
			name: await getInnerText(await seller.$('a')),
			ratingCount: await getInnerText(await seller.$('.rating-count')),
			deliveryOption: await getInnerText(await seller.$('.sellers-table__delivery-cell-option')),
			price: await getInnerText(await seller.$('.sellers-table__price-cell-text')),
		}

		sellers.push(newSeller)
	}

	const product = {
		id,
		url,
		name,
		price,
		imgLink,
		shortSpecifications,
		sellers,
	}

	return product
}

export function getKaspiTopProducts () {

}
