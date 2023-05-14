import jwt from 'jsonwebtoken'
import config from 'config'
import { Check } from '../../models/Check.js'
import { getProviderName } from '../../utils/providers.utils.js'
import { scrapCheck } from '../../utils/puppeteer.utils.js'
import { User } from '../../models/User.js'

export const checkGet = async (req, res) => {
	try {
		const checkId = req.params.id
		const check = await Check.findOne({ checkId, })

		if (!check) return res.json({ message: 'Not found!', })
		res.json({ data: check, })
	} catch (error) {
		console.log(error.message)
		res.json({ message: error.message, })
	}
}

export const checkPost = async (req, res) => {
	try {
		const user = req.user
		const check = req.body.check

		const foundUser = await User.findById(user.userId)
		const candidateCheck = await Check.findOne({ checkId: check.checkId, })
		if (candidateCheck) return res.status(402).json({ message: 'This check exists!', })

		const newCheck = new Check(check)
		const savedCheck = await newCheck.save()

		foundUser.checks.push(savedCheck._id)
		await foundUser.save()

		res.sendStatus(201)
	} catch (error) {
		console.log(error.message)
		res.json({ message: error.message, })
	}
}

export const checkScanPost = async (req, res) => {
	try {
		const { url, } = req.body
		if (!req.headers.authorization) return res.status(401).json({ error: 'Not Authorized', })
		const token = req.headers.authorization
		const user = jwt.verify(token, config.get('jwtSecret'))
		if (!user) return res.status(400).json({ message: 'User is not verified!', })

		const name = getProviderName(url)
		const { checkId, productList, total, date, } = await scrapCheck(name, url)
		const candidate = await Check.findOne({ checkId, })
		if (candidate) {
			return res.status(400).json({ message: 'This check exists in history', })
		}
		const scannedCheck = { checkId, checkRows: productList, total, date, }
		res.status(200).json({ data: scannedCheck, })
	} catch (error) {
		console.log(error)
		res.json({ message: error.message, })
	}
}
