import { scrapKaspiProductPage } from '../../utils/scrap/kaspi.scrap.js'
import { getHref, getInnerText, getSrc } from '../../utils/puppeteer.utils.js'
import { browser } from '../../index.js'
import { TOP_PRODUCTS_BASE_URL } from '../../constants/kaspi.constants.js'
import { getDigitsFromString, removeNewLineFromString, trimBoth } from '../../utils/string.utils.js'

export const productInfoGet = async (req, res) => {
	try {
		const url = req.query.url

		const product = await scrapKaspiProductPage(url)

		res.status(200).json({ data: product, })
	} catch (error) {
		console.log(error)
		res.status(503).json({ data: error, })
	}
}

export const kaspiSearchPost = async (req, res) => {
	try {
		const { query, } = req.body

		const page = await browser.newPage()
		const url = `https://kaspi.kz/shop/search/?text=${query}`
		await page.goto(url)

		await page.waitForSelector('.item-cards-grid__cards')
		await page.waitForSelector('.item-cards-grid__cards .item-card')
		await page.waitForSelector('.item-card__name-link')

		const foundProducts = await page.$$('.item-cards-grid__cards .item-card')

		const products = []
		for (let i = 0; i < foundProducts.length; i++) {
			const product = {
				id: await page.$eval(`.item-cards-grid__cards .item-card:nth-of-type(${i + 1})`, prod => prod.getAttribute('data-product-id')),
				imgLink: await getSrc(await foundProducts[i].$('.item-card__image')),
				name: await getInnerText(await foundProducts[i].$('.item-card__name-link')),
				price: getDigitsFromString(await getInnerText(await foundProducts[i].$('.item-card__prices-price'))),
				url: await getHref(await foundProducts[i].$('.item-card__image-wrapper')),
			}

			products.push(product)
		}

		await page.close()
		res.status(200).json({ data: products, })
	} catch (error) {
		res.status(503).json({ data: error, })
	}
}

export const getKaspiTop = async (req, res) => {
	try {
		const page = await browser.newPage()

		await page.goto(TOP_PRODUCTS_BASE_URL)

		await page.waitForSelector('.item-cards-grid')

		await page.waitForSelector('.item-card:nth-of-type(12)', {
			visible: true,
		})
		const productBlocks = await page.$$('.item-card')

		const products = []
		for (let i = 0; i < productBlocks.length; i++) {
			const idSelector = await page.$eval(`.item-card:nth-of-type(${i + 1})`, prod => {
				return prod.getAttribute('data-product-id')
			})
			const nameSelector = await productBlocks[i].$('.item-card__name-link')
			const priceSelector = await productBlocks[i].$('.item-card__prices-price')
			const linkSelector = await productBlocks[i].$('.item-card__image-wrapper')
			const imageSelector = await productBlocks[i].$('.item-card__image')

			const productInfo = {
				id: idSelector,
				name: await getInnerText(nameSelector),
				price: trimBoth(removeNewLineFromString(getDigitsFromString(await getInnerText(priceSelector)))),
				url: await getHref(linkSelector),
				imgLink: await getSrc(imageSelector),
			}

			products.push(productInfo)
		}

		await page.close()

		res.status(200).json({ data: products, })
	} catch (error) {
		console.log('Error in parse:', error.message)
		res.status(503).json({ data: error, })
	}
}

export const getKaspiTopExtended = async (req, res) => {
	try {
		const page = await browser.newPage()

		const products = []
		for (let i = 1; i <= 2; i++) {
			await page.goto(TOP_PRODUCTS_BASE_URL + `?page=${i}`)

			await page.waitForSelector('.item-cards-grid')

			await page.waitForSelector('.item-card:nth-of-type(12)', {
				visible: true,
			})
			const productBlocks = await page.$$('.item-card')

			for (let i = 0; i < productBlocks.length; i++) {
				const idSelector = await page.$eval(`.item-card:nth-of-type(${i + 1})`, prod => {
					return prod.getAttribute('data-product-id')
				})
				const nameSelector = await productBlocks[i].$('.item-card__name-link')
				const priceSelector = await productBlocks[i].$('.item-card__prices-price')
				const linkSelector = await productBlocks[i].$('.item-card__image-wrapper')
				const imageSelector = await productBlocks[i].$('.item-card__image')

				const productInfo = {
					id: idSelector,
					name: await getInnerText(nameSelector),
					price: trimBoth(removeNewLineFromString(getDigitsFromString(await getInnerText(priceSelector)))),
					url: await getHref(linkSelector),
					imgLink: await getSrc(imageSelector),
				}

				products.push(productInfo)
			}
		}

		await page.close()

		res.status(200).json({ data: products, })
	} catch (error) {
		console.log('Error in parse:', error.message)
		res.status(503).json({ data: error, })
	}
}
