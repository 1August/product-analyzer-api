import { MULTIPLY_CHAR } from '../../constants/constants.js'
import { getInnerText } from '../puppeteer.utils.js'

export async function transtelecomScrap (page, url) {
	let checkId
	const productList = []
	let total = 0
	let date

	await page.waitForSelector('.ready_ticket')

	const Url = new URL(url)

	checkId = Url.searchParams.get('i')
	total = Url.searchParams.get('s')
	// Format in url: YYYYMMDDTHHMMSS 20221216T152000
	const unformattedDate = Url.searchParams.get('t')
	const [year, month, day, hour, minute,] = [
		unformattedDate.substring(0, 4),
		unformattedDate.substring(4, 6),
		unformattedDate.substring(6, 8),
		unformattedDate.substring(9, 11),
		unformattedDate.substring(11, 13),
	]
	// month starts with 0
	date = new Date(+year, +month - 1, +day, +hour, +minute)

	const productElements = await page.$$('.ready_ticket__items_list > li')

	for (let product of productElements) {
		const productName = await (product.getProperty('innerText')
			.then(async value => {
				const text = String(await value.jsonValue())

				const firstNewLine = text.search(new RegExp('\\n'))
				const productName = text.substring(0, firstNewLine)
				return productName
			}))

		// const productId = await (product.$('b')
		// 	.then(async value => {
		// 		const productId = await (value.getProperty('innerText').then(id => id.jsonValue()))
		// 		return productId
		// 	}))

		const productCost = await (product.$('.ready_ticket__item')
			.then(async value => {
				const text = String(await getInnerText(value))

				const firstLineIndex = text.search(new RegExp('\\n'))

				const firstLine = text.substring(0, firstLineIndex)
				// + 1 because we have whitespace between id and calculation
				const firstWhitespaceIndex = firstLine.search(new RegExp('\\s'))
				const productCalculationText = firstLine.substring(firstWhitespaceIndex + 1)

				const firstMultiplyIndex = productCalculationText.indexOf(MULTIPLY_CHAR)
				// - 1 because it has whitspace between
				const productCost = productCalculationText.substring(0, firstMultiplyIndex - 1)

				return productCost
			}))

		const productOverall = await (product.$('.ready_ticket__item')
			.then(async value => {
				const text = String(await getInnerText(value))

				const firstLineIndex = text.search(new RegExp('\\n'))

				const firstLine = text.substring(0, firstLineIndex)

				const equalString = '='
				const lastEqualIndex = firstLine.lastIndexOf(equalString)

				// + 2 because it has whitespace between
				const productOverall = firstLine.substring(lastEqualIndex + 2)

				return productOverall
			}))

		const productNumber = +productOverall / +productCost

		const productInfo = {
			name: productName,
			cost: productCost,
			count: productNumber,
			overall: productOverall,
		}
		productList.push(productInfo)
	}

	return { checkId, productList, total, date, }
}
