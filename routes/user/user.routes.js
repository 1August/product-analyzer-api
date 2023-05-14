import { Router } from 'express'
import { userChecksGet, userIdChecksGet, userPredict } from './user.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/', authenticateToken, userIdChecksGet) // /api/user/:id/checks
router.get('/checks', authenticateToken, userChecksGet) // /api/user/checks
router.get('/predict', authenticateToken, userPredict) // /api/user/predict

export const userRouter = router
