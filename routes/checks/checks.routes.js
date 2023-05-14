import { Router } from 'express'
import { checkGet, checkPost, checkScanPost } from './checks.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/:id', authenticateToken, checkGet) // /api/checks/:id
router.post('/', authenticateToken, checkPost) // /api/checks
router.post('/scan', checkScanPost) // /api/checks/scan

export const checksRouter = router

