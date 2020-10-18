//Application server

import "reflect-metadata"

import * as Express from "express"

import { createConnection } from "typeorm"
import { UserRoutes } from "./routes/user.routes"

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(UserRoutes)

createConnection()
  .then(async (connection) => {
    app.listen(4000)
    console.log("Application server is up and running on port 4000")
  })
  .catch((error) => console.log(error))
