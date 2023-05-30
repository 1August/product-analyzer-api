import { Router } from 'express'
import { authenticateToken } from '../../../utils/auth.utils.js'
import { getGalmartCatalog } from './galmart.controller.js'

const router = Router()

router.get('/catalog', authenticateToken, getGalmartCatalog) // /api/supermarket/galmart/catalog

export const galmartRouter = router
