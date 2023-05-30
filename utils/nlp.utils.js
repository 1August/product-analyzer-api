import natural from 'natural'

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

	// count frequency of words
	strings.forEach((str) => {
		tokenizer.tokenize(str).forEach((word) => {
			if (word in frequency) {
				frequency[word]++
			} else {
				frequency[word] = 1
			}
		})
	})

	// find most frequent words
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

	// group all most frequent words
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


export function getMostFrequencyWord(arr) {
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


function longestCommonSubsequence(s1, s2) {
	const m = s1.length
	const n = s2.length
	const lengths = Array.from(Array(m + 1), () => Array(n + 1).fill(0))

	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			if (s1[i - 1] === s2[j - 1]) {
				lengths[i][j] = lengths[i - 1][j - 1] + 1
			} else {
				lengths[i][j] = Math.max(lengths[i - 1][j], lengths[i][j - 1])
			}
		}
	}

	let i = m
	let j = n
	const commonSubsequence = []
	while (i > 0 && j > 0) {
		if (s1[i - 1] === s2[j - 1]) {
			commonSubsequence.push(s1[i - 1])
			i--
			j--
		} else if (lengths[i - 1][j] > lengths[i][j - 1]) {
			i--
		} else {
			j--
		}
	}

	return commonSubsequence.reverse().join('')
}

export function extractProductNames(receipt) {
	const productNames = []
	const combinedReceipt = receipt.join('').toLowerCase()
	for (const item of receipt) {
		productNames.push(longestCommonSubsequence(item.toLowerCase(), combinedReceipt))
	}
	return productNames
}
