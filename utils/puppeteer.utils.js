import { launch } from 'puppeteer'
import { KAZAKHTELECOM, TRANSTELECOM } from '../constants/providers.constants.js'
import { kazakhtelecomScrap } from './scrap/kazakhtelecom.scrap.js'
import { transtelecomScrap } from './scrap/transtelecom.scrap.js'

async function getByAttribute (selector, attribute = 'innerText') {
	return (await (await selector)?.getProperty(attribute))?.jsonValue()
}

export const getInnerText = async selector => await getByAttribute(selector)
export const getHref = async selector => await getByAttribute(selector, 'href')
export const getSrc = async selector => await getByAttribute(selector, 'src')
export const getProductId = async selector => await getByAttribute(selector, 'data-product-id')

export async function scrapCheque(name, url) {
	const browser = await launch()
	const page = await browser.newPage()
	await page.goto(url)

	if (name === KAZAKHTELECOM) {
		return await kazakhtelecomScrap(page)
	}
	if (name === TRANSTELECOM) {
		return await transtelecomScrap(page, url)
	}
}
