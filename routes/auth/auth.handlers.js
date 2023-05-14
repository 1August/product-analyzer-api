import { check } from 'express-validator'

export const apiAuthSignupHandlers = [
	check('email', 'Incorrect email').trim().isEmail(),
	check('password', 'Minimal length should be 6').isLength({min: 6,}),
]

export const apiAuthSigninHandlers = [
	check('email', 'Please, enter correct email').trim().normalizeEmail().isEmail(),
	check('password', 'Enter password').exists(),
]
