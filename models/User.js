import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	email: {type: String, required: true, unique: true,},
	password: {type: String, required: true,},
	checks: [{ type: Types.ObjectId, ref: 'Check', },],
    // links: [{type: Types.ObjectId, ref: 'Link'}]
})

export const User = model('User', schema)
