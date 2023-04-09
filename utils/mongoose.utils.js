import mongoose from 'mongoose'
import config from 'config'

export async function mongooseConnect(options) {
	await mongoose.connect(config.get('mongoUri'), options || {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
}
