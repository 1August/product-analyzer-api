import { magnumRouter } from './supermarket/magnum/magnum.routes.js'
import { Router } from 'express'

const router = Router()

router.use('/magnum', magnumRouter) // /api/supermarket/magnum
// router.use('/galmart', galmartRouter) // /api/supermarket/galmart
// router.use('/small', smallRouter) // /api/supermarket/small

export const supermarketRouter = router



// // api/supermarket/
// router.get('/', supermarketGet)
// router.post('/', supermarketPost)
// router.delete('/', supermarketDelete)
//
// // api/supermarket/product
// router.get('/product', supermarketProductGet)
// router.post('/product', supermarketProductPost)
// router.delete('/product', supermarketProductDelete)
//
