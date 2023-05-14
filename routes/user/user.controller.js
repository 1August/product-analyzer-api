import { User } from '../../models/User.js'
import { Check } from '../../models/Check.js'
import { initialTestData } from '../../constants/ml.constants.js'
import { linearRegression, linearRegressionLine } from 'simple-statistics'
import {
	findCommonProductName,
	findMostFrequentStrings,
	getCombinations,
	getMostFrequencyWord
} from '../../utils/nlp.utils.js'
import natural from 'natural'

export const userIdChecksGet = async (req, res) => {
	try {
		const user = req.user
		const findUser = await User.findById(user.userId)

		// TODO: Check for 404 status in front
		if (!findUser) return res.sendStatus(404)
		res.json({ data: findUser.checks, })
	} catch (error) {
		console.log(error.message)
		res.json({ message: error.message, })
	}
}

export const userChecksGet = async (req, res) => {
	try {
		const user = req.user
		const userWithData = await User.findById(user.userId)
		const checkIds = userWithData.checks
		const checks = await Check.find({ id: { $in: checkIds, }, }).sort('date')

		res.json({ data: checks, })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: error.message, })
	}
}

export const userPredict = async (req, res) => {
	try {
		const user = req.user
		const userChecks = await User.find({ id: user.userId, }, 'checks')
		const checks = await Check.find({ id: { $in: userChecks, }, }).sort('date')

		const productsWithDates = checks.reduce((acc, check) => {
			const productsWithDate = check.checkRows.reduce((res, product) => ({...res, [product.name]: check.date, }), {})

			return {...acc, ...productsWithDate,}
		}, {})
		const productNames = checks.reduce((names, check) => {
			check.checkRows.forEach(product => {
				names.push(product.name)
			})

			return names
		}, [])
		const productCombinations = getCombinations(productNames)
		// console.log({ productCombinations })
		const productCombinationsLength = productCombinations.reduce((acc, arr) => [...acc, arr.length,], [])
		const sqrtProductCombinations = Math.sqrt(Math.max(...productCombinationsLength))
		const filteredProductCombinations = productCombinations.filter(arr => arr.length > sqrtProductCombinations)

		const frequentStrings = []
		for (const productArr of filteredProductCombinations) {
			const mostFrequentStrings = findMostFrequentStrings(productArr)
			for (const frequentString of mostFrequentStrings) {
				if (frequentStrings.includes(frequentString)) continue
				frequentStrings.push(frequentString)
			}
		}
		const mostFrequencyWord = getMostFrequencyWord(frequentStrings)
		const productsIncludesMostFreqWord = productNames.filter(name => name.includes(mostFrequencyWord))

		const productsWithManyDates = {}
		for (const [productName, date,] of Object.entries(productsWithDates)) {
			const productNameFromMostFreqWordIndex = productsIncludesMostFreqWord.findIndex(word => word === productName)
			const key = productNameFromMostFreqWordIndex === -1 ? productName : mostFrequencyWord

			const foundDates = productsWithManyDates[key]
			const filteredDates = foundDates?.filter(foundDate => foundDate !== date)
			const dates = filteredDates == null ? [date,] : [...filteredDates, date,]

			productsWithManyDates[key] = dates
		}
		// console.log({ productsWithManyDates, })
		/*
			productsWithManyDates: {
				'ВОДА A`SU 8л НЕГАЗИРОВАННАЯ': [ 2022-12-16T09:20:00.000Z ],
				'СЫРОК ТВОРОЖНЫЙ FOODMASTER ДОЛЬЧЕ 36гр МАНГО МАРАК': [ 2022-12-16T09:20:00.000Z ],
				'ШОКОЛАДНЫЙ': [ 2022-12-16T09:20:00.000Z ],
				'КОНФЕТЫ MARS 45ГР М M АРАХИС': [ 2022-12-16T09:20:00.000Z ],
				'2438626 КЛАБ СЭНДВИЧ С КУРИНЫМ РУЛЕТОМ 200Г': [ 2023-05-09T08:27:00.000Z ],
				'4870206961018 МЫЛО SULU ЖАСМИН ТУАЛЕТНОЕ 85ГР ФЛ/П': [ 2023-05-09T08:27:00.000Z ],
				'5449000236029 НАПИТОК ЧАЙ FUSE TEA ЛАЙМ МЯТА 0,5Л П/Б': [ 2023-05-09T08:27:00.000Z ],
				'4870207190233 ГЕЛЬ AKMASEPT Д/РУК АНТИМИКРОБНЫЙ MITY CHOCOLATE 50МЛ ФЛ': [ 2023-05-09T08:27:00.000Z ],
				'4607036872432 СТАКАНЫ PARTY ПЛАСТИКОВЫЕ БЕЛ 200МЛ 12ШТ ПЛЕНКА': [ 2023-05-09T08:27:00.000Z ],
				'2034342100010 ПАКЕТ ПЛАТНЫЙ MAGNUM 30*50СМ': [ 2023-05-09T08:27:00.000Z ]
			}
		 */

		/*x
			TODO: Get last buy date from DB and make timeDiff. Save all dates in DB (=== Checks date)
		 */
		const testData = [...initialTestData,]
		// Data of user
		for (let i = 0; i < checks.length - 1; i++) {
			const prevDate = new Date(checks[i].date).getTime()
			const nextDate = new Date(checks[i + 1].date).getTime()
			const newData = [prevDate, nextDate,]
			testData.push(newData)
		}

		const predict = linearRegression(testData)

		const now = Date.now()
		const line = linearRegressionLine(predict)
		const predicted = line(now)

		res.status(200).json({ data: predicted, })
	} catch (error) {
		console.log(error)
		res.status(400).json({ message: error.message, })
	}
}
