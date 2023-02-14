import { Router } from 'express'
import puppeteer from 'puppeteer';
import { Product } from '../models/Product.js';
import { Supermarket } from '../models/Supermarket.js';
const router = Router()

// /api/data/scrapProducts
router.get('/scrapProducts', async (req, res) => {
    const { supermarketName } = req.body

    const market = supermarkets.find(market => market.name.toLowerCase() === supermarketName.toLowerCase())

    const products = new Map()

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(market.salesPageUrl)

        async function getPropertyOfProduct(product, propName) {
            return (await product.getProperty(propName)).jsonValue()
        }

        async function getTextOfProduct(product, selector) {
            const productPromise = await getPropertyOfProduct(await product.$(selector), 'innerText')
            const productContent = await productPromise
            return productContent
        }

        async function getInfoOfProduct(product) {
            // Should be like a Product model in mongodb/mongoose
            const productId = await getPropertyOfProduct(product, 'href')
            const productName = await getTextOfProduct(product, '.product-block__descr')
            const productPrice = await getTextOfProduct(product, '.product-block__price')

            const productInfo = {
                id: productId.substring(productId.lastIndexOf('/') + 1, productId.indexOf('?')),
                name: productName,
                price: productPrice
            }

            return productInfo
        }

        await page.waitForSelector('.product-block').then(async () => {
            const productBlocks = await page.$$('.page-catalog__products .product-block')
            for (const i in productBlocks){
                const productInfo = await getInfoOfProduct(productBlocks[i])
                products.set(productInfo.id, productInfo)
            }
        })

        await browser.close();
    } catch (err) {
        console.log('Error in parse:', err.message)
    }

    console.log(products)
    res.json({ message: 'Success!' })
})

export const dataRouter = router