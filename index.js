import express from 'express'
import config from 'config'
import mongoose from 'mongoose'
import cors from 'cors'
import { authRouter } from './routes/auth.routes.js'
import * as bodyParser from 'express'
import { supermarketRouter } from './routes/supermarket.routes.js'
import { dataRouter } from './routes/data.routes.js'
import { checksRouter } from './routes/checks.routes.js'
const app = express()

app.use(bodyParser.urlencoded({extended: true,}))
app.use(express.json({extended: true,}))
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/supermarket', supermarketRouter)
app.use('/api/data', dataRouter)
app.use('/api/checks', checksRouter)

const PORT  = config.get('port') || 5000

const start = async () => {
	try{
		await mongoose.connect(config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		app.listen(PORT, () => console.log(`App has been started on port https://localhost:${PORT}`))
	}catch (e){
		console.error('Server error:', e.message)
		process.exit(1)
	}
}

start()