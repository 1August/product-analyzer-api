import { Router } from 'express'
import { userChequesGet, userLastChequeGet, userPredict } from './user.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/cheques', authenticateToken, userChequesGet) // /api/user/cheques
router.get('/cheques/last', authenticateToken, userLastChequeGet) // /api/user/cheques/last
router.get('/predict', authenticateToken, userPredict) // /api/user/predict

export const userRouter = router
