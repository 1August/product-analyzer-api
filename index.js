import express, * as bodyParser from 'express'
import config from 'config'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js'
import { supermarketRouter } from './routes/supermarket.routes.js'
import { dataRouter } from './routes/data.routes.js'
import { checksRouter } from './routes/checks.routes.js'
import { mongooseConnect } from './utils/mongoose.utils.js'

const app = express()

app.use(bodyParser.urlencoded({ extended: true, }))
app.use(express.json({ extended: true, }))
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/supermarket', supermarketRouter)
app.use('/api/data', dataRouter)
app.use('/api/checks', checksRouter)

const PORT = config.get('port') || 5000

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
