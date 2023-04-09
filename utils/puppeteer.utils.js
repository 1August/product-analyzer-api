import puppeteer from 'puppeteer'

export async function getPage(url) {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url)

	return page
}

export async function getInnerText(selector) {
	return await selector.getProperty('innerText').then(text => text.jsonValue())
}
