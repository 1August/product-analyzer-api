import express from 'express'
import config from 'config'
import { mongooseConnect } from './utils/mongoose.utils.js'
import { configApp } from './config/config.js'
import { setRoutes } from './routes/routes.js'

const app = express()

const PORT = config.get('port') || 5000

configApp(app)
setRoutes(app)

const start = async () => {
	try {
		await mongooseConnect()
		app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
	} catch (e) {
		console.error('Server error:', e.message)
		process.exit(1)
	}
}

start()
