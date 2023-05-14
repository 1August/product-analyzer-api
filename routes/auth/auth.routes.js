import { Router } from 'express'
import { apiAuthSignin, apiAuthSigninToken, apiAuthSignup } from './auth.controller.js'
import { apiAuthSigninHandlers, apiAuthSignupHandlers } from './auth.handlers.js'

const router = Router()

router.post('/signup', apiAuthSignupHandlers, apiAuthSignup) // /api/auth/signup
router.post('/signin', apiAuthSigninHandlers, apiAuthSignin) // /api/auth/signin
router.post('/signin/token', apiAuthSigninToken) // /api/auth/signin/token

export const authRouter = router
