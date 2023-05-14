import { Router } from 'express'
import { kaspiSearchPost, productInfoGet } from './kaspi.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/productInfo', authenticateToken, productInfoGet) // /api/kaspi/productInfo?url=qwe
// router.post('/' ) // /api/checks
// router.post('/scan' ) // /api/checks/scan

// /api/kaspi/search
router.post('/search', authenticateToken, kaspiSearchPost)

export const kaspiRouter = router
