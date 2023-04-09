import { Router } from 'express'
import { Supermarket } from '../models/Supermarket.js'
import { Product } from '../models/Product.js'
import puppeteer from 'puppeteer'

const router = Router()

// api/supermarket/
router.get('/', async (req, res) => {
	const name = req.query.supermarket
	const market = await Supermarket.findOne({ name, })

	res.json({ market, })
})

// api/supermarket/
router.post('/', async (req, res) => {
	// name, baseUrl, productsPageUrl, products?
	const { supermarket, } = req.body

	const candidate = await Supermarket.findOne({ name: supermarket.name.toLowerCase(), })
	if (candidate)
		return res.status(400).json('Supermarket with this name already exists.')

	const market = new Supermarket({ ...supermarket, name: supermarket.name.toLowerCase(), })
	await market.save()

	res.json({ message: 'Supermarket created!', })
})

// api/supermarket/
router.delete('/', async (req, res) => {
	const name = req.query.name

	await Supermarket.findOneAndDelete({ name: name.toLowerCase(), })

	res.json({ message: `Supermarket ${name.toLowerCase()} deleted!`, })
})

// api/supermarket/product
router.get('/product', async (req, res) => {
	// Need to replace whitespaces by %20 in frontend
	const name = req.query.name

	const product = await Product.findOne({ name: name.toLowerCase(), })

	res.json({ product, })
})

// api/supermarket/product
router.post('/product', async (req, res) => {
	// product: {id, name, price}
	const { supermarketName, product, } = req.body

	const candidate = await Product.findOne({ productId: product.id, })
	if (candidate)
		return res.status(400).json('Product with this name or id already exists.')

	const newProduct = new Product({ ...product, productId: product.id, name: product.name.toLowerCase(), })
	await newProduct.save()

	await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $push: { products: newProduct.id, }, })

	res.json({ message: `Product ${product.id} inserted into ${supermarketName.toLowerCase()} collection`, })
})

// api/supermarket/product
router.delete('/product', async (req, res) => {
	// NOTE: Need to replace whitespaces by %20 in frontend
	const { supermarketName, product, } = req.body

	await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $unset: { products: product.id, }, })
	await Product.findByIdAndDelete(product.id)

	res.json({ message: 'Product deleted', })
})

async function getInnerText(element) {
	return await (await (
		await element)
		.getProperty('innerText'))
		.jsonValue()
}

// /api/supermarket/search
router.post('/search', async (req, res) => {
	const { query, } = req.body

	const baseUrl = 'https://kaspi.kz'
	const url = new URL(`/shop/search/?text=${query}`, baseUrl)

	const browser = await puppeteer.launch()
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

	return res.json({ data: products, })
})

export const supermarketRouter = router
