//Authentication server

import * as dotenv from "dotenv"
dotenv.config({ path: ".env" })

import "reflect-metadata"

import * as Express from "express"

import { createConnection } from "typeorm"
import { LoginRoutes } from "./routes/auth.routes"

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(LoginRoutes)

createConnection()
  .then(async (connection) => {
    app.listen(3000)
    console.log("Authentication server is up and running on port 3000")
  })
  .catch((error) => console.log(error))
