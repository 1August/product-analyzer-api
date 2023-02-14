import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	name: { type: String, required: true, unique: true, },
	baseUrl: { type: String, required: true, unique: true, },
	productsPageUrl: { type: String, required: true, unique: true, },
	products: { type: Types.ObjectId, ref: 'Product', },
})

export const Supermarket = model('Supermarket', schema)