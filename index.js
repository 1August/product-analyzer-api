import express from 'express'
import config from 'config'
import { mongooseConnect } from './utils/mongoose.utils.js'
import { configApp } from './config/config.js'
import { setRoutes } from './routes/routes.js'
import { launch } from 'puppeteer'
import { chromeOptions } from './constants/chrome.constants.js'

const app = express()

const PORT = config.get('port') || 5000

configApp(app)
setRoutes(app)

await mongooseConnect()
export const browser = await launch({
	headless: true,
	product: 'chrome',
	waitForInitialPage: true,
	args: [`--window-size=${chromeOptions.width},${chromeOptions.height}`,],
	defaultViewport: {
		width: chromeOptions.width,
		height: chromeOptions.height,
	},
})

const start = async () => {
	try {
		app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
	} catch (e) {
		console.error('Server error:', e.message)
		process.exit(1)
	}
}

start()
