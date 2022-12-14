import { Router, json } from "express"
import cors from "cors"
import morgan from "morgan"
import compression from "compression"
import { isProduction } from "@config/app"
import { authenticatedMiddleware } from "../middlewares"
import publicRoutes from "./public.routes"
import privateRoutes from "./private.routes"

export default () => {
	const router = Router()
	const api = Router()

	api.use(json())
	api.use(cors())
	api.use(compression())
	api.use(
		morgan("combined", {
			skip: (_: any, res: any) =>
				isProduction() ? res.statusCode < 400 : false,
		}),
	)

	api.use(publicRoutes())
	api.use(authenticatedMiddleware(), privateRoutes())

	router.use("/api/v1", api)

	return router
}
