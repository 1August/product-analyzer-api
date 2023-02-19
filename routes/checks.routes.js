import { Router } from 'express'
import puppeteer from 'puppeteer'

const router = Router()

const KAZAKHTELECOM = 'kazakhtelecom' // need test another urls (https://consumer.oofd.kz/ticket/653bf166-a399-4260-9557-4f6eaf3682b8)
const TTC = 'transtelecom' // need test another urls (https://ofd1.kz/t/?i=56689177603&f=010101907419&s=2508.0&t=20221216T152000)

async function scrapCheck(name, url) {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(url)

	const productList = []

	if (name === KAZAKHTELECOM) {
		await page.waitForSelector('.ticket-columns.ticket-items')

		const productElements = await page.$$('.ticket-columns.ticket-items')

		for (let product of productElements) {
			const productNamePromise = await product.$(':nth-child(2)')
			const productName = await productNamePromise.getProperty('innerText').then(name => name.jsonValue())

			const productCostPromise = await product.$(':nth-child(4)')
			const productCost = await productCostPromise.getProperty('innerText').then(cost => cost.jsonValue())

			const productNumberPromise = await product.$(':nth-child(5)')
			const productNumber = await productNumberPromise.getProperty('innerText').then(num => num.jsonValue())

			const productOverallPromise = await product.$(':nth-child(7)')
			const productOverall = await productOverallPromise.getProperty('innerText').then(overall => overall.jsonValue())

			const productInfo = {
				name: productName,
				cost: productCost,
				number: productNumber,
				overall: productOverall,
			}

			productList.push(productInfo)
		}
	} else if (name === TTC) {
		await page.waitForSelector('.ready_ticket')

		const productElements = await page.$$('.ready_ticket__items_list > li')

		for (let product of productElements) {
			const productName = await (product.getProperty('innerText')
				.then(async value => {
					const text = String(await value.jsonValue())

					const firstNewLine = text.search(new RegExp('\\n'))
					const productName = text.substring(0, firstNewLine)
					return productName
				}))

			const productId = await (product.$('b')
				.then(async value => {
					const productId = await (value.getProperty('innerText').then(id => id.jsonValue()))
					return productId
				}))

			const productCost = await (product.$('.ready_ticket__item')
				.then(async value => {
					const text = String(await value.getProperty('innerText').then(text => text.jsonValue()))

					const firstLineIndex = text.search(new RegExp('\\n'))

					const firstLine = text.substring(0, firstLineIndex)
					// + 1 because we have whitespace between id and calculation
					const firstWhitespaceIndex = firstLine.search(new RegExp('\\s'))
					const productCalculationText = firstLine.substring(firstWhitespaceIndex + 1)

					const multiplyString = 'x'
					const firstMultiplyIndex = productCalculationText.indexOf(multiplyString)
					// - 1 because it has whitspace between
					const productCost = productCalculationText.substring(0, firstMultiplyIndex - 1)

					return productCost
				}))

			const productOverall = await (product.$('.ready_ticket__item')
				.then(async value => {
					const text = String(await value.getProperty('innerText').then(text => text.jsonValue()))

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
				number: productNumber,
				overall: productOverall,
			}

			productList.push(productInfo)
		}
	}

	return productList
}

// api/checks/scan
router.post('/scan', async (req, res) => {
	const { name, url, } = req.body

	const productList = await scrapCheck(name, url)
	console.log(productList)
	res.json({ message: 'ok!', })
})

export const checksRouter = router