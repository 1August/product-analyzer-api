import { Supermarket } from '../../models/Supermarket.js'
import { Product } from '../../models/Product.js'
import { launch } from 'puppeteer'
import { getInnerText } from '../../utils/puppeteer.utils.js'

export const supermarketGet = async (req, res) => {
	const name = req.query.supermarket
	const market = await Supermarket.findOne({ name, })

	res.json({ market, })
}
export const supermarketPost = async (req, res) => {
	// name, baseUrl, productsPageUrl, products?
	const { supermarket, } = req.body

	const candidate = await Supermarket.findOne({ name: supermarket.name.toLowerCase(), })
	if (candidate)
		return res.status(400).json('Supermarket with this name already exists.')

	const market = new Supermarket({ ...supermarket, name: supermarket.name.toLowerCase(), })
	await market.save()

	res.json({ message: 'Supermarket created!', })
}
export const supermarketDelete = async (req, res) => {
	const name = req.query.name

	await Supermarket.findOneAndDelete({ name: name.toLowerCase(), })

	res.json({ message: `Supermarket ${name.toLowerCase()} deleted!`, })
}

export const supermarketProductGet = async (req, res) => {
	// Need to replace whitespaces by %20 in frontend
	const name = req.query.name

	const product = await Product.findOne({ name: name.toLowerCase(), })

	res.json({ product, })
}
export const supermarketProductPost = async (req, res) => {
	// product: {id, name, price}
	const { supermarketName, product, } = req.body

	const candidate = await Product.findOne({ productId: product.id, })
	if (candidate)
		return res.status(400).json('Product with this name or id already exists.')

	const newProduct = new Product({ ...product, productId: product.id, name: product.name.toLowerCase(), })
	await newProduct.save()

	await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $push: { products: newProduct.id, }, })

	res.json({ message: `Product ${product.id} inserted into ${supermarketName.toLowerCase()} collection`, })
}

export const supermarketProductDelete = async (req, res) => {
	// NOTE: Need to replace whitespaces by %20 in frontend
	const { supermarketName, product, } = req.body

	await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $unset: { products: product.id, }, })
	await Product.findByIdAndDelete(product.id)

	res.json({ message: 'Product deleted', })
}
