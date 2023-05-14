import jwt from 'jsonwebtoken'
import config from 'config'

export function authenticateToken (req, res, next) {
	const token = req.headers?.authorization
	if (token == null) return res.sendStatus(401)

	jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
		if (error) return res.sendStatus(403)
		req.user = decoded
		next()
	})
}
