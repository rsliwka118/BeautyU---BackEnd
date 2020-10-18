//Application server

import * as dotenv from "dotenv"
dotenv.config({ path: ".env" })

import "reflect-metadata"

import * as Express from "express"

import { createConnection } from "typeorm"
import { UserRoutes } from "./routes/user.routes"
import { LoginRoutes } from "./routes/auth.routes"

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))


app.use(UserRoutes)
app.use(LoginRoutes)

createConnection()
  .then(async (connection) => {
    app.listen(4000)
    console.log("Application server is up and running on port 4000")
  })
  .catch((error) => console.log(error))
