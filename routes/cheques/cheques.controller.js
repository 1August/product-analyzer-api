import { Cheque } from '../../models/Cheque.js'
import { getProviderName } from '../../utils/providers.utils.js'
import { scrapCheque } from '../../utils/puppeteer.utils.js'
import { User } from '../../models/User.js'
import { Product } from '../../models/Product.js'

export const chequeGet = async (req, res) => {
	try {
		const chequeId = req.params.id
		const cheque = await Cheque.findOne({ chequeId, })

		if (!cheque) return res.json({ message: 'Not found!', })
		res.json({ data: cheque, })
	} catch (error) {
		console.log(error.message)
		res.status(200).status(503).json({ data: error, })
	}
}

export const chequePost = async (req, res) => {
	try {
		const user = req.user
		const cheque = req.body.cheque

		const foundUser = await User.findById(user.userId)
		const candidateCheque = await Cheque.findOne({ chequeId: cheque.chequeId, })
		if (candidateCheque) return res.status(402).json({ message: 'This cheque exists!', })

		for (let i = 0; i < cheque.chequeRows.length; i++) {
			const newProduct = new Product(cheque.chequeRows[i])
			cheque.chequeRows[i] = newProduct
			await newProduct.save()
		}
		const newCheque = new Cheque(cheque)
		const savedCheque = await newCheque.save()

		foundUser.cheques.push(savedCheque._id)
		await foundUser.save()

		res.status(201).json({ data: 'Created', })
	} catch (error) {
		console.log(error.message)
		res.status(503).json({ message: error, })
	}
}

export const chequeScanPost = async (req, res) => {
	try {
		const { url, } = req.body

		const name = getProviderName(url)
		const { chequeId, productList, total, date, } = await scrapCheque(name, url)
		const candidate = await Cheque.findOne({ chequeId, })
		if (candidate) {
			return res.status(400).json({ message: 'This cheque exists in history', })
		}
		const scannedCheque = { chequeId, chequeRows: productList, total, date, }
		res.status(200).json({ data: scannedCheque, })
	} catch (error) {
		console.log(error)
		res.status(503).json({ message: error, })
	}
}
