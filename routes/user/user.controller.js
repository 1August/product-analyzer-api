import { User } from '../../models/User.js'
import { Cheque } from '../../models/Cheque.js'
import { initialTestData } from '../../constants/ml.constants.js'
import { linearRegression, linearRegressionLine } from 'simple-statistics'
import { Product } from '../../models/Product.js'

// export const userChequesIdGet = async (req, res) => {
// 	try {
// 		const user = req.user
// 		const findUser = await User.findById(user.userId)
// 		const cheques = await Cheque.find({ id: { $in: findUser.cheques,},}, 'date')
// 		console.log({ cheques, })
//
// 		res.status(200).json({ data: cheques, })
// 	} catch (error) {
// 		console.log(error.message)
// 		res.status(503).json({ message: error, })
// 	}
// }

export const userChequesGet = async (req, res) => {
	try {
		const user = req.user
		const foundUser = await User.findById(user.userId)
		const chequeIds = foundUser.cheques
		const cheques = await Cheque.aggregate([
			{ $match: { _id: { $in: chequeIds, }, }, },
			{
				$lookup: {
					from: 'products', // The name of the 'products' collection (pluralized model name)
					localField: 'chequeRows',
					foreignField: '_id',
					as: 'chequeRows',
				},
			},
		])

		res.status(200).json({ data: cheques, })
	} catch (error) {
		console.log(error)
		res.status(503).json({ message: error, })
	}
}

export const userPredict = async (req, res) => {
	try {
		const user = req.user
		const foundUser = await User.findById(user.userId)
		const userCheques = foundUser.cheques
		const cheques = await Cheque.aggregate([
			{ $match: { _id: { $in: userCheques, }, }, },
			{
				$lookup: {
					from: 'products', // The name of the 'products' collection (pluralized model name)
					localField: 'chequeRows',
					foreignField: '_id',
					as: 'chequeRows',
				},
			},
		])

		const productsWithDates = cheques.reduce((acc, cheque) => {
			const productsWithDate = cheque.chequeRows
				.reduce((res, product) => ({ ...res, [product.name]: [cheque.date,], }), {})

			return { ...acc, ...productsWithDate, }
		}, {})
		// const productNames = cheques.reduce((names, cheque) => {
		// 	cheque.chequeRows.forEach(product => {
		// 		names.push(product.name)
		// 	})
		//
		// 	return names
		// }, [])
		// const productCombinations = getCombinations(productNames)
		// // console.log({ productCombinations })
		// const productCombinationsLength = productCombinations.reduce((acc, arr) => [...acc, arr.length,], [])
		// const sqrtProductCombinations = Math.sqrt(Math.max(...productCombinationsLength))
		// const filteredProductCombinations = productCombinations.filter(arr => arr.length > sqrtProductCombinations)
		//
		// const frequentStrings = []
		// for (const productArr of filteredProductCombinations) {
		// 	const mostFrequentStrings = findMostFrequentStrings(productArr)
		// 	for (const frequentString of mostFrequentStrings) {
		// 		if (frequentStrings.includes(frequentString)) continue
		// 		frequentStrings.push(frequentString)
		// 	}
		// }
		// const mostFrequencyWord = getMostFrequencyWord(frequentStrings)
		// const productsIncludesMostFreqWord = productNames.filter(name => name.includes(mostFrequencyWord))
		// const productsIncludesMostFreqWord = extractProductNames(productNames)
		// console.log({ productsIncludesMostFreqWord, })
		/*
		[
			'пакет smallskif - small',
			'гречка царс павл 3кг - царская павл',
			'яйцо с1 30 шт - курочка ряба',
			'охл.подлож.филе - кус-вкус',
			'прованс.100гр верт. - 3 желания',
			'туал бум альпеш 10шт - альпеш',
			'рис ак ниет 1кг - ак ниет кг',
			'губкапос 2038 3шт - santex',
			'кефир 25 1 л ppac - natige',
			'snickers белый 81 - mars батончики',
			'лепешка тандыр - toqnan',
			'грунт универ.5л - селигер агро',
			'петрушка - .',
			'картофель 1сорт - .',
			'whiskas 75 паштутка - whiskas',
			'whiskas 75 рагу кур - whiskas',
			'whiskas 75 куринд п - whiskas',
			'печ.какао ваниль 95 - oreo',
			'печ.какао ваниль 41 - oreo',
			'вода a`su 8л негазированная',
			'сырок творожный foodmaster дольче 36гр манго марак',
			'шоколадный батончик mars 40гр snickers криспер',
			'конфеты mars 45гр м m арахис',
			'шоколадный батончик mars 82гр twix xtra',
			'шоколадный батончик nestle 58гр kitkat king size',
			'orange',
			'apple',
			'вода asu минер б/газ stil 1000мл пл/бут',
			'вода galmart пит б/газ 500мл',
			'2438626 клаб сэндвич с куриным рулетом 200г',
			'4870206961018 мыло sulu жасмин туалетное 85гр фл/п',
			'5449000236029 напиток чай fuse tea лайм мята 0,5л п/б',
			'4870207190233 гель akmasept д/рук антимикробный mity chocolate 50мл фл',
			'4607036872432 стаканы party пластиковые бел 200мл 12шт пленка',
			'2034342100010 пакет платный magnum 30*50см',
			'антиперспирант ролик nivea невидимый extra черн/',
			'пакет майка galmart с логотипом 30х55 (29*55)',
			'пакет',
			'яблоко',
			'йогурт',
			'шоколад ',
			'мороженое ',
			'obit'
		]
		 */
		// const productsWithManyDates = {}
		// Object.entries(productsWithDates).forEach(([key, value,], i, array) => {
		// 	const newName = productsIncludesMostFreqWord[i]
		// 	const prevDatesWithSameNewName = array.find(([key,]) => key === newName) ?? []
		//
		// 	productsWithManyDates[newName] = [...prevDatesWithSameNewName, value,]
		// })
		// for (const [productName, date,] of Object.entries(productsWithDates)) {
		// 	const productNameFromMostFreqWordIndex = productsIncludesMostFreqWord.findIndex(word => word === productName)
		// 	const key = productNameFromMostFreqWordIndex === -1 ? productName : mostFrequencyWord
		//
		// 	const foundDates = productsWithManyDates[key]
		// 	const filteredDates = foundDates?.filter(foundDate => foundDate !== date)
		// 	const dates = filteredDates == null ? [date,] : [...filteredDates, date,]
		//
		// 	productsWithManyDates[key] = dates
		// }
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
			TODO: Get last buy date from DB and make timeDiff. Save all dates in DB (=== Cheques date)
		 */
		const productsWithPrediction = []
		for (const key in productsWithDates) {
			const now = new Date().getTime()

			const dates = productsWithDates[key].sort((a, b) => a.getTime() - b.getTime())
			const pairDates = [[dates[0].getTime(), now,],]
			// const pairDates = dates.length === 1 ? [[dates[0].getTime(), now,],] : []
			// for (let i = 0; i < dates.length - 1; i++) {
			// 	const prevDate = dates[i].getTime()
			// 	const nextDate = dates[i + 1].getTime()
			// 	pairDates.push([prevDate, nextDate,])
			// }

			const predict = linearRegression([...initialTestData, ...pairDates,])
			const line = linearRegressionLine(predict)
			const predicted = line(dates.at(-1))

			const product = {
				name: key,
				predictedDate: new Date(Math.round(predicted)),
			}
			productsWithPrediction.push(product)
		}

		res.status(200).json({ data: productsWithPrediction, })
	} catch (error) {
		console.log(error)
		res.status(503).json({ message: error, })
	}
}

export async function userLastChequeGet(req, res) {
	try {
		const user = req.user
		const userWithData = await User.findById(user.userId)
		const chequeIds = userWithData.cheques
		const cheques = await Cheque.find({ id: { $in: chequeIds, }, }).sort('date')
		const lastCheque = cheques.at(-1)

		const products = await Product.find({ _id: { $in: lastCheque.chequeRows, }, })

		res.status(200).json({ data: { ...lastCheque, chequeRows: products, }, })
	} catch (error) {
		console.log(error)
		res.status(503).json({ message: error, })
	}
}
