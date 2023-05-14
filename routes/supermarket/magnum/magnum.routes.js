import { Router } from 'express'
import { getMagnumAllStocks, getMagnumCatalog, sendMagnumEffectiveStocks } from '../../../utils/scrap/magnum.scrap.js'
import { authenticateToken } from '../../../utils/auth.utils.js'

const router = Router()

// router.get('/', authenticateToken, getMagnumProducts) // /api/supermarket/magnum/

// /api/supermarket/magnum/catalog
router.get('/catalog', authenticateToken, getMagnumCatalog)

// /api/supermarket/magnum/stocks
router.get('/stocks', authenticateToken, getMagnumAllStocks)

// /api/supermarket/magnum/stocks/effective
router.get('/stocks/effective', authenticateToken, sendMagnumEffectiveStocks)

export const magnumRouter = router
