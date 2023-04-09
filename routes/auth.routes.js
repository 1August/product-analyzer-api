import {Router} from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import {check, validationResult} from 'express-validator'

import {User} from '../models/User.js'

const router = Router()

// /api/auth/signup
router.post(
	'/signup',
	[
		check('email', 'Incorrect email').trim().isEmail(),
		check('password', 'Minimal length should be 6').isLength({min: 6,}),
	],
	async (req, res) => {
		const {email, password,} = req.body

		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data to register',
				})
			}

			const candidate = await User.findOne({email: email.trimEnd(),})
			if (candidate)
				return res.status(400).json('User with this email already exists.')

			const hashedPassword = await bcrypt.hash(password, 12)
			const user = new User({email: email.trimEnd(), password: hashedPassword,})

			await user.save()

			res.status(201).json({message: 'User created.',})
		} catch (e) {
			res.status(500).json({message: 'Error in auth.routes',})
		}
	}
)

// /api/auth/signin
router.post(
	'/signin',
	[
		check('email', 'Please, enter correct email').trim().normalizeEmail().isEmail(),
		check('password', 'Enter password').exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Incorrect data to login',
				})
			}
			const {email, password,} = req.body

			const user = await User.findOne({email: email.trimEnd(),})
			if (!user)
				return res.status(400).json({message: 'User do not found',})

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch)
				return res.status(400).json({message: 'Incorrect password. Try again.',})

			const responseData = {
				userId: user._id,
				email,
			}
			const token = jwt.sign(responseData, config.get('jwtSecret'), {expiresIn: '1d',})

			res.json({data: token,})
		} catch (e) {
			res.status(500).json({message: `Error in auth.routes. ${e.message}`,})
		}
	}
)

// /api/auth/signin/token
router.post(
	'/signin/token', async (req, res) => {
		try {
			if (!req.headers.authorization) {
				return res.status(401).json({ error: 'Not Authorized', })
			}

			const token = req.headers.authorization
			const user = jwt.verify(token, config.get('jwtSecret'))

			const candidate = await User.findById(user.userId)
			if (!candidate) return res.json({message: 'User not found!',})

			const responseData = {
				userId: candidate._id,
				email: candidate.email,
			}
			const newToken = jwt.sign(responseData, config.get('jwtSecret'), {expiresIn: '1d',})
			res.json({ data: newToken, })
		} catch (e) {
			res.status(500).json({message: `Error in auth.routes. ${e.message}`,})
		}
	}
)

export const authRouter = router
