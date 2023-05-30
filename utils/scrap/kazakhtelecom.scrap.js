export async function kazakhtelecomScrap (page) {
	await page.waitForSelector('.ticket-columns.ticket-items')

	const chequeId = Number(await page.$eval('.col-md-12.text-center > p > span:nth-of-type(2)', id => id.innerText))
	const productList = await page.$$eval('.ticket-columns.ticket-items', products => {
		return products.reduce((res, product) => {
			const productInfo = {
				name: product.querySelector('div:nth-child(2)').innerText,
				cost: product.querySelector('div:nth-child(4)').innerText.split(',')[0].replace(/\s/g, ''),
				count: product.querySelector('div:nth-child(5)').innerText,
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
	return { chequeId, productList, total, date, }
}
