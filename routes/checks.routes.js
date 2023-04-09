import { Router } from 'express'
import { Check } from '../models/Check.js'
import { getInnerText, getPage } from '../utils/puppeteer.utils.js'
import { MULTIPLY_CHAR } from '../constants/constants.js'
import { getProviderName } from '../utils/utils.js'
import { KAZAKHTELECOM, TTC } from '../constants/providers.constants.js'
import { User } from '../models/User.js'
import jwt from 'jsonwebtoken'
import config from 'config'

const router = Router()

async function scrapCheck(name, url) {
	const page = await getPage(url)

	if (name === KAZAKHTELECOM) {
		await page.waitForSelector('.ticket-columns.ticket-items')

		const checkId = Number(await page.$eval('.col-md-12.text-center > p > span:nth-of-type(2)', id => id.innerText))
		const productList = await page.$$eval('.ticket-columns.ticket-items', products => {
			return products.reduce((res, product) => {
				const productInfo = {
					name: product.querySelector('div:nth-child(2)').innerText,
					cost: product.querySelector('div:nth-child(4)').innerText.split(',')[0].replace(/\s/g, ''),
					number: product.querySelector('div:nth-child(5)').innerText,
					overall: product.querySelector('div:nth-child(7)').innerText.split(',')[0].replace(/\s/g, ''),
				}

				return [...res, productInfo,]
			}, [])
		})
		let total = await page.$eval('.row.total-sum > .text-right', total => total.innerText.substring(0, total.innerText.indexOf(',')).replace(/\D/g, ''))
		const awaitedDate = await page.$eval('.col-md-12.text-center > p',
			row => {
				// row = DD.MM.YYYY / HH:MM
				const fullDate = row.innerText.split('\n').at(-1)

				const date = fullDate.split('/')[0]
				const time = fullDate.split('/')[1]

				const day = date.split('.')[0]
				const month = date.split('.')[1] - 1
				const year = date.split('.')[2]

				const hour = time.split(':')[0]
				const minute = time.split(':')[1]
				const second = '00'
				return [year, month, day, hour, minute, second,]
			}
		)
		const date = new Date(...awaitedDate)
		return { checkId, productList, total, date, }
	}
	if (name === TTC) {
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
	return
}

// /api/checks
router.get('/', async (req, res) => {
	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ error: 'Not Authorized', })
		}
		const token = req.headers.authorization
		const user = jwt.verify(token, config.get('jwtSecret'))
		const findUser = await User.findById(user.userId)

		res.json({ data: findUser.checks, })
	} catch (error) {
		console.log(error.message)
		res.json({ message: error.message, })
	}
})

// /api/checks/:id
router.get('/:id', async (req, res) => {
	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ error: 'Not Authorized', })
		}
		const token = req.headers.authorization
		const checkId = req.params.id
		const user = jwt.verify(token, config.get('jwtSecret'))
		if (!user) return res.json({ message: 'User unverified!', })
		const check = await Check.findById(checkId)
		if (!check) return res.json({ message: 'Not found!', })
		res.json({ data: check, })
	} catch (error) {
		console.log(error.message)
		res.json({ message: error.message, })
	}
})

// /api/checks/scan
router.post('/scan', async (req, res) => {
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
})

// /api/checks/save
router.post('/save', async (req, res) => {
	// TODO: Check {check}s
	try {
		const { check, } = req.body
		if (!req.headers.authorization) return res.status(401).json({ error: 'Not Authorized', })

		const token = req.headers.authorization
		const user = jwt.verify(token, config.get('jwtSecret'))
		const foundUser = await User.findById(user.userId)

		const candidate = await Check.findOne({ checkId: check.checkId, })
		if (candidate) {
			console.log('Found candidate:', candidate)
			return res.status(404).json({ message: 'This check exists in history', })
		}

		const newCheck = new Check(check)
		const savedCheck = await newCheck.save()

		foundUser.checks.push(savedCheck._id)
		await foundUser.save()

		res.status(201).json({ message: 'Success!', })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: error.message, })
	}
})

// Analyze ------------------------------------------------------------------

// /api/checks/predict
router.post('/predict', async (req, res) => {
	try {
		if (!req.headers.authorization) return res.status(401).json({ error: 'Not Authorized', })

		const token = req.headers.authorization
		const user = jwt.verify(token, config.get('jwtSecret'))
		const userChecks = await User.find({ id: user.userId, }, 'checks')
		const checks = await Check.find({ id: { $in: userChecks, },}, 'date').sort('date')

		res.status(200).json({ data: checks, })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: error.message, })
	}
})

export const checksRouter = router

