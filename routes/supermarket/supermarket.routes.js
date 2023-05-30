import { magnumRouter } from './magnum/magnum.routes.js'
import { Router } from 'express'
import { galmartRouter } from './galmart/galmart.routes.js'
import { smallRouter } from './small/small.routes.js'

const router = Router()

router.use('/magnum', magnumRouter) // /api/supermarket/magnum
router.use('/galmart', galmartRouter) // /api/supermarket/galmart
router.use('/small', smallRouter) // /api/supermarket/small

export const supermarketRouter = router
