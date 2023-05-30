import { Router } from 'express'
import { getKaspiTop, getKaspiTopExtended, kaspiSearchPost, productInfoGet } from './kaspi.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/productInfo', authenticateToken, productInfoGet) // /api/kaspi/productInfo?url=string
router.post('/search', authenticateToken, kaspiSearchPost) // /api/kaspi/search
router.get('/top', getKaspiTop) // /api/kaspi/top
router.get('/top/extended', getKaspiTopExtended) // /api/kaspi/top/extended

export const kaspiRouter = router
