import natural from 'natural'
/*

	TODO:
		Create object
			{
				productName: buy date
			}
		Categorize products by name with NLP:
			['Product 1', 'Product 2', 'Product 3', 'Product 4']
		Make object with name and dates
			{
				'Product 1': [date1, date2, date3]
				'Product 2': [date1, date2]
				'Product 3': [date1, date2, date3, date4, date5]
			}
		Sort by date ascending
			products.sort((a, b) => a > b)
		Predict each product date
			product: [
				[date1, date2],
				[date2, date3],
				[date3, date4],
				[date4, date5],
			]
			const productsWithPrediction = linearRegression(product)
		Send to front
			res.json({ data: productsWithPrediction })
 */

export function findCommonProductName(products) {
	if (products.length === 0) {
		return ''
	}

	products.sort()

	// Находим LCP для первой и последней строки в списке
	const first = products[0]
	const last = products[products.length - 1]
	let lcp = ''

	for (let i = 0; i < first.length; i++) {
		if (first[i] === last[i]) {
			lcp += first[i]
		} else {
			break
		}
	}

	return lcp.trim()
}

// export function getCombinations(arr) {
// 	const result = [[],]
//
// 	for (let i = 0; i < arr.length; i++)
// 		for (let j = 0; j < result.length; j++)
// 			result.push([...result[j], arr[i],])
//
// 	return result.slice(1)
// }

export function getCombinations(arr) {
	const combinations = []
	const n = arr.length

	for (let i = 0; i < (1 << n); i++) {
		const subset = []
		for (let j = 0; j < n; j++) {
			if (i & (1 << j)) {
				subset.push(arr[j])
			}
		}
		combinations.push(subset)
	}

	return combinations
}

export function findMostFrequentStrings(strings) {
	const frequency = {}
	const tokenizer = new natural.WordTokenizer()

	// считаем частоту встречаемости слов в каждой строке
	strings.forEach((str) => {
		tokenizer.tokenize(str).forEach((word) => {
			if (word in frequency) {
				frequency[word]++
			} else {
				frequency[word] = 1
			}
		})
	})

	// находим самые часто встречаемые слова
	let mostFrequent = []
	let maxFrequency = 0
	for (let word in frequency) {
		if (frequency[word] > maxFrequency) {
			mostFrequent = [word,]
			maxFrequency = frequency[word]
		} else if (frequency[word] === maxFrequency) {
			mostFrequent.push(word)
		}
	}

	// возвращаем самые часто встречаемые строки
	const result = []
	strings.forEach((str) => {
		const words = tokenizer.tokenize(str)
		const count = words.filter((word) => mostFrequent.includes(word)).length
		if (count === maxFrequency) {
			result.push(str)
		}
	})

	return result
}


export function getMostFrequencyWord (arr) {
	const tokenizer = new natural.WordTokenizer()

	const freqMap = new Map()
	for (const item of arr) {
		const words = tokenizer.tokenize(item)
		for (const word of words) {
			const count = freqMap.get(word) || 0
			freqMap.set(word, count + 1)
		}
	}

	// Поиск наиболее частотного слова
	let mostFreqWord = ''
	let maxCount = 0
	for (const [word, count,] of freqMap) {
		if (count > maxCount) {
			mostFreqWord = word
			maxCount = count
		}
	}

	return mostFreqWord
}
