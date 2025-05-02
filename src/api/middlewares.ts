import type { 
    MiddlewaresConfig,
  } from "@medusajs/medusa"
  import cors from "cors"

  export const config: MiddlewaresConfig = {
    routes: [
      {
        matcher: "admin/*",
        middlewares: [
          cors({
            origin: "*",
            credentials: true,
          }),
        ],
      },
    ],
  }