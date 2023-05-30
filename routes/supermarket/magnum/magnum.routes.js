import { Router } from 'express'
import { authenticateToken } from '../../../utils/auth.utils.js'
import { getMagnumCatalog, sendMagnumEffectiveStocks } from './magnum.controller.js'

const router = Router()

router.get('/catalog', authenticateToken, getMagnumCatalog) // /api/supermarket/magnum/catalog
router.get('/stocks/effective', authenticateToken, sendMagnumEffectiveStocks) // /api/supermarket/magnum/stocks/effective

export const magnumRouter = router
