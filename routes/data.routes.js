import { Router } from 'express'
import { launch } from 'puppeteer'
import { Supermarket } from '../models/Supermarket.js'
import { TOP_PRODUCTS_BASE_URL } from '../constants/constants.js'
import { getHref, getInnerText, getSrc } from '../utils/puppeteer.utils.js'
import { removeNewLineFromString, trimBoth } from '../utils/string.js'

const router = Router()

async function getInfoOfProduct(product) {
	// Should be like a Product model in mongodb/mongoose
	const productId = await getHref(product)
	const productName = await getInnerText(product.$('.product-block__descr'))
	const productPrice = await getInnerText(product.$('.product-block__price'))

	return {
		id: productId.substring(productId.lastIndexOf('/') + 1, productId.indexOf('?')),
		name: productName,
		price: productPrice,
	}
}

// /api/data/scrapProducts
router.get('/scrapProducts', async (req, res) => {
	const supermarketName = req.query.name

	const market = await Supermarket.findOne({ name: supermarketName.toLowerCase(), })

	const products = new Map()

	try {
		const browser = await launch()
		const page = await browser.newPage()
		await page.goto(market.productsPageUrl)

		await page.waitForSelector('.product-block').then(async () => {
			const productBlocks = await page.$$('.page-catalog__products .product-block')
			for (const i in productBlocks) {
				const productInfo = await getInfoOfProduct(productBlocks[i])
				products.set(productInfo.id, productInfo)
			}
		})

		await browser.close()
	} catch (err) {
		console.log('Error in parse:', err.message)
		res.json({ error: err.message, })
	}

	console.log(products)
	res.json({ message: 'Success!', })
})

// /api/data/top
router.get('/top', async (req, res) => {
	try {
		const products = []

		const browser = await launch()
		const page = await browser.newPage()

		// const URLs = []
		// for (let i = 1; i <= NUMBER_OF_TOP_PRODUCT_PAGES_TO_SCRAP; i++) {
		// 	const url = `${TOP_PRODUCTS_BASE_URL}?page=${i}`
		// 	URLs.push(url)
		// }

		// for (const url of URLs) {
		await page.goto(TOP_PRODUCTS_BASE_URL)

		await page.waitForSelector('.item-cards-grid')
		await page.waitForSelector('.item-card:nth-of-type(12)', {
			visible: true,
		})

		const productBlocks = await page.$$('.item-card')

		for (let i = 0; i < productBlocks.length; i++) {
			const idSelector = await page.$eval(`.item-card:nth-of-type(${i + 1})`, prod => {
				return prod.getAttribute('data-product-id')
			})
			const nameSelector = await productBlocks[i].$('.item-card__name-link')
			const priceSelector = await productBlocks[i].$('.item-card__prices-price')
			const linkSelector = await productBlocks[i].$('.item-card__image-wrapper')
			const imageSelector = await productBlocks[i].$('.item-card__image')

			const productInfo = {
				id: idSelector,
				name: await getInnerText(nameSelector),
				price: trimBoth(removeNewLineFromString(await getInnerText(priceSelector))),
				url: await getHref(linkSelector),
				imgLink: await getSrc(imageSelector),
			}

			products.push(productInfo)
		}

		await browser.close()

		res.json({ data: products, })
	} catch (err) {
		console.log('Error in parse:', err.message)
		res.json({ error: err.message, })
	}
})

export const dataRouter = router
