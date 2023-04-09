import {Schema, model} from 'mongoose'

const schema = new Schema({
	productId: { type: String, required: true, unique: true, }, // got from market API
	name: { type: String, required: true, },
	price: { type: Number, required: true, },
})

export const Product = model('Product', schema)
