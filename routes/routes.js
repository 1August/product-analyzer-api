import { authRouter } from './auth/auth.routes.js'
import { supermarketRouter } from './supermarket/supermarket.routes.js'
import { chequesRouter } from './cheques/cheques.routes.js'
import { userRouter } from './user/user.routes.js'
import { kaspiRouter } from './kaspi/kaspi.routes.js'

export function setRoutes (app){
	app.use('/api/auth', authRouter)
	app.use('/api/user', userRouter)
	app.use('/api/kaspi', kaspiRouter)
	app.use('/api/supermarket', supermarketRouter)
	app.use('/api/cheques', chequesRouter)
}
