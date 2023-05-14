import * as bodyParser from 'express'
import express from 'express'
import cors from 'cors'

export function configApp (app){
	app.use(bodyParser.urlencoded({ extended: true, }))
	app.use(express.json({ extended: true, }))
	app.use(cors())
}
