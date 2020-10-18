//Authentication server

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import "reflect-metadata";

import * as Express from "express";

import { createConnection } from "typeorm";
import { UserRoutes } from "./routes/authServer/user.routes";
import { LoginRoutes } from "./routes/authServer/auth.routes";

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));


app.use(UserRoutes);
app.use(LoginRoutes);

createConnection()
  .then(async (connection) => {
    app.listen(1337);
    console.log("Express application is up and running on port 1337");
  })
  .catch((error) => console.log(error));
