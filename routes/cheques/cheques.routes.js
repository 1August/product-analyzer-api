import { Router } from 'express'
import { chequeGet, chequePost, chequeScanPost } from './cheques.controller.js'
import { authenticateToken } from '../../utils/auth.utils.js'

const router = Router()

router.get('/:id', authenticateToken, chequeGet) // /api/cheques/:id
router.post('/', authenticateToken, chequePost) // /api/cheques
router.post('/scan', authenticateToken, chequeScanPost) // /api/cheques/scan

export const chequesRouter = router

