import {Schema, model} from 'mongoose'

const product = new Schema({
	name: { type: String, required: true, },
	cost: { type: Number, required: true, },
	count: { type: Number, required: true, default: 1,},
	overall: { type: Number, required: true, },
})

export const Product = model('Product', product)
