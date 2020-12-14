//Application server

import "reflect-metadata"

import * as Express from "express"

import { createConnection } from "typeorm"
import { UserRoutes } from "./routes/User/user.routes"
import { SalonRoutes } from "./routes/Salon/salon.routes"
import { VisitsRoutes } from "./routes/Visits/visits.routes"

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(UserRoutes)
app.use(SalonRoutes)
app.use(VisitsRoutes)

createConnection()
  .then(async (connection) => {
    app.listen(4000)
    console.log("Application server is up and running on port 4000")
  })
  .catch((error) => console.log(error))
