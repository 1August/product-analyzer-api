import express from 'express'
import cors from 'cors'

export function configApp (app){
	app.use(express.urlencoded({ extended: true, }))
	app.use(express.json({ extended: true, }))
	app.use(cors())

	// Magnum ssl sertificate remove
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

	// 304 response cancel
	app.disable('etag')
}
