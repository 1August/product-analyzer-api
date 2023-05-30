// import { Supermarket } from '../../models/Supermarket.js'
// import { Product } from '../../models/Product.js'
//
// export const supermarketGet = async (req, res) => {
// 	try {
// 		const name = req.query.supermarket
// 		const market = await Supermarket.findOne({ name, })
//
// 		res.status(200).json({ data: market, })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
// export const supermarketPost = async (req, res) => {
// 	try {
// 		// name, baseUrl, productsPageUrl, products?
// 		const { supermarket, } = req.body
//
// 		const candidate = await Supermarket.findOne({ name: supermarket.name.toLowerCase(), })
// 		if (candidate)
// 			return res.status(400).json('Supermarket with this name already exists.')
//
// 		const market = new Supermarket({ ...supermarket, name: supermarket.name.toLowerCase(), })
// 		await market.save()
//
// 		res.status(201).json({ data: 'Created', })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
// export const supermarketDelete = async (req, res) => {
// 	try {
// 		const name = req.query.name
//
// 		await Supermarket.findOneAndDelete({ name: name.toLowerCase(), })
//
// 		res.status(200).json({ message: 'Deleted', })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
//
// export const supermarketProductGet = async (req, res) => {
// 	try {
// 		// Need to replace whitespaces by %20 in frontend
// 		const name = req.query.name
//
// 		const product = await Product.findOne({ name: name.toLowerCase(), })
//
// 		res.status(200).json({ data: product, })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
// export const supermarketProductPost = async (req, res) => {
// 	try {
// 		// product: {id, name, price}
// 		const { supermarketName, product, } = req.body
//
// 		const candidate = await Product.findOne({ productId: product.id, })
// 		if (candidate)
// 			return res.status(400).json('Product with this name or id already exists.')
//
// 		const newProduct = new Product({ ...product, productId: product.id, name: product.name.toLowerCase(), })
// 		await newProduct.save()
//
// 		await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $push: { products: newProduct.id, }, })
//
// 		res.status(201).json({ message: `Product ${product.id} inserted into ${supermarketName.toLowerCase()} collection`, })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
//
// export const supermarketProductDelete = async (req, res) => {
// 	try {
// 		// NOTE: Need to replace whitespaces by %20 in frontend
// 		const { supermarketName, product, } = req.body
//
// 		await Supermarket.findOneAndUpdate({ name: supermarketName.toLowerCase(), }, { $unset: { products: product.id, }, })
// 		await Product.findByIdAndDelete(product.id)
//
// 		res.status(200).json({ message: 'Deleted', })
// 	} catch (error) {
// 		res.status(503).json({ data: error, })
// 	}
// }
