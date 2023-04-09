import { Router } from 'express'
import puppeteer from 'puppeteer'
import { Supermarket } from '../models/Supermarket.js'
import { TOP_PRODUCTS_BASE_URL } from '../constants/constants.js'

const router = Router()

async function getPropertyOfProduct(product, propName) {
	return (await product.getProperty(propName)).jsonValue()
}

async function getTextOfProduct(product, selector) {
	const productPromise = await getPropertyOfProduct(await product.$(selector), 'innerText')
	const productContent = await productPromise
	return productContent
}

async function getInfoOfProduct(product) {
	// Should be like a Product model in mongodb/mongoose
	const productId = await getPropertyOfProduct(product, 'href')
	const productName = await getTextOfProduct(product, '.product-block__descr')
	const productPrice = await getTextOfProduct(product, '.product-block__price')

	const productInfo = {
		id: productId.substring(productId.lastIndexOf('/') + 1, productId.indexOf('?')),
		name: productName,
		price: productPrice,
	}

	return productInfo
}

// /api/data/scrapProducts
router.get('/scrapProducts', async (req, res) => {
	const supermarketName = req.query.name

	const market = await Supermarket.findOne({ name: supermarketName.toLowerCase(), })

	const products = new Map()

	try {
		const browser = await puppeteer.launch()
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

		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		await page.goto(TOP_PRODUCTS_BASE_URL)

		await page.waitForSelector('.item-cards-grid').then(async () => {
			const ids = await page.$$eval('.item-card', products =>
				products.reduce((res, product) => [
					...res,
					product.getAttribute('data-product-id'),
				], []))

			const productBlocks = await page.$$('.item-card')

			for (let i = 0; i < productBlocks.length; i++) {
				const nameSelector = await productBlocks[i].$('.item-card__name-link')
				const priceSelector = await productBlocks[i].$('.item-card__prices-price')

				const productInfo = {
					id: ids[i],
					name: await getPropertyOfProduct(nameSelector, 'innerText'),
					price: (await getPropertyOfProduct(priceSelector, 'innerText')),
				}
				products.push(productInfo)
			}
		})

		await browser.close()

		res.json({ data: products, })
	} catch (err) {
		console.log('Error in parse:', err.message)
		res.json({ error: err.message, })
	}
})

export const dataRouter = router
