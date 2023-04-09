import { Schema, model } from 'mongoose'

const check = new Schema({
	checkId: { type: Number, required: true, unique: true, }, // got from check id
	checkRows: [{
		name: { type: String, required: true, },
		cost: { type: Number, required: true, },
		count: { type: Number, required: true, default: 1,},
		overall: { type: Number, required: true, },
	},],
	total: { type: Number, required: true, },
	date: { type: Date, required: true, },
})

export const Check = model('Check', check)
