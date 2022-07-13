import { createReactQueryHooks } from "@trpc/react"
import { AppRouter } from "../server/routes/app.router"

export const trpc = createReactQueryHooks<AppRouter>()
