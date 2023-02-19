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
		check('email', 'Incorrect email').isEmail(),
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

			const candidate = await User.findOne({email: email.trim(),})
			if (candidate)
				return res.status(400).json('User with this email already exists.')

			const hashedPassword = await bcrypt.hash(password, 12)
			const user = new User({email: email.trim(), password: hashedPassword,})

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
		check('email', 'Please, enter correct email').normalizeEmail().isEmail(),
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

			const user = await User.findOne({email: email.trim(),})
			if (!user)
				return res.status(400).json({message: 'User do not found',})

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch)
				return res.status(400).json({message: 'Incorrect password. Try again.',})

			const responseData = {
				userId: user.id,
			}
			const token = jwt.sign(responseData, config.get('jwtSecret'), {expiresIn: '1h',})

			res.json({token,})
		} catch (e) {
			res.status(500).json({message: `Error in auth.routes. ${e.message}`,})
		}
	}
)


/////////////////////////////////////////////////////////////////////////////////////
// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//     apiKey: config.get('OPENAI_API_KEY'),
// });
//
// router.get('/openai', async (req, res) => {
//     const openai = new OpenAIApi(configuration);
//     const response = await openai.createCompletion({
//         model: "text-davinci-002",
//         prompt: "Hello world",
//     }, {
//         headers: {
//             'Authorization': `Bearer ${config.get('OPENAI_API_KEY')}`
//         }
//     });
//
//     res.message(response)
// })
/////////////////////////////////////////////////////////////////////////////////////
//
// import {ChatGPTAPIBrowser, getOpenAIAuth, ChatGPTAPI} from 'chatgpt'
//
// // import GPT3 from 'node-gpt3'
// //
// // import { getCompletion } from "gpt3";
//
// router.get('/chatgpt', async (req, res) => {
//     // console.log('REQUEST!')
//     //
//     const [email, password] = ['boktaban@gmail.com', 'Giant_Tuzik2002']
//
//
//     const api = new ChatGPTAPIBrowser({email, password})
//     // const openAIAuth = await getOpenAIAuth({
//     //     email,
//     //     password,
//     //     isGoogleLogin: true
//     // })
//     //
//     // const api = new ChatGPTAPI({ ...openAIAuth })
//     await api.initSession()
//
//     // send a message and wait for the response
//     const result = await api.sendMessage('Write a python version of bubble sort.')
//
//     // result.response is a markdown-formatted string
//     console.log(result.response)
//
//
//     // const result = await getCompletion("Evaluate 2*2?", {}, {
//     //     openAISecretKey: config.get('OPENAI_API_KEY')
//     // });
//
//     res.json({response: result})
// })

/////////////////////////////////////////////////////////////////////////////////////

export const authRouter = router