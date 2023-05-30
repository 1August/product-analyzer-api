import { validationResult } from 'express-validator'
import { User } from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

export const apiAuthSignup = async (req, res) => {
	try {
		const { name, email, password, } = req.body

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Incorrect data to register',
			})
		}

		const candidate = await User.findOne({ email: email.trimEnd(), })
		if (candidate)
			return res.status(400).json('User with this email already exists.')

		const hashedPassword = await bcrypt.hash(password, 12)
		const user = new User({ name: name.trim().trimEnd(), email: email.trimEnd(), password: hashedPassword, })

		await user.save()

		res.status(201).json({ message: 'Created', })
	} catch (error) {
		res.status(503).json({ data: error, })
	}
}
export const apiAuthSignin = async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(404).json({
				errors: errors.array(),
				message: 'Incorrect data to login',
			})
		}
		const { email, password, } = req.body

		const user = await User.findOne({ email, })
		if (!user)
			return res.status(404).json({ message: 'User do not found', })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch)
			return res.status(404).json({ message: 'Incorrect password. Try again.', })

		const responseData = {
			userId: user._id,
			name: user.name,
			email,
		}
		const token = jwt.sign(responseData, config.get('jwtSecret'), { expiresIn: '30d', })

		res.json({ data: token, })
	} catch (error) {
		res.status(503).json({ data: error, })
	}
}
