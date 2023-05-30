import { Router } from 'express'
import { authenticateToken } from '../../../utils/auth.utils.js'
import { getSmallCatalog } from './small.controller.js'

const router = Router()

router.get('/catalog', authenticateToken, getSmallCatalog) // /api/supermarket/small/catalog

export const smallRouter = router
