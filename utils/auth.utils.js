import jwt from 'jsonwebtoken'
import config from 'config'

export function authenticateToken (req, res, next) {
	const token = req.headers?.authorization
	if (token == null) return res.status(401).json({ message: 'Token is empty', })

	jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
		if (error) return res.status(403).json({ message: 'Token is unverified!', })
		req.user = decoded
		next()
	})
}
