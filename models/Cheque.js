import { model, Schema, Types } from 'mongoose'

// TODO: Change saving cheque in controller chequeRows link with Product.js ref
// chequeRows: [{type: Types.ObjectId, ref: 'Product',},],

const cheque = new Schema({
	chequeId: { type: Number, required: true, unique: true, }, // got from cheque id
	chequeRows: [{type: Types.ObjectId, ref: 'Product',},],
	// chequeRows: [{
	// 	name: { type: String, required: true, },
	// 	cost: { type: Number, required: true, },
	// 	count: { type: Number, required: true, default: 1, },
	// 	overall: { type: Number, required: true, },
	// },],
	total: { type: Number, required: true, },
	date: { type: Date, required: true, },
	url: { type: String, required: true, },
})

export const Cheque = model('Cheque', cheque)
