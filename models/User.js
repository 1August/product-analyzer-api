import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	name: {type: String, required: true,},
	email: {type: String, required: true, unique: true,},
	password: {type: String, required: true,},
	cheques: [{ type: Types.ObjectId, ref: 'Cheque', },],

})

export const User = model('User', schema)
