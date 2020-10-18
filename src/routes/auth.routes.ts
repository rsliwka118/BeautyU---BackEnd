import { check } from "express-validator";

import * as express from "express";
import * as AuthController from "../controllers/authController";

import UserInputMiddleware from "../middlewares/input.middlewares";


var Router = express.Router();

//Register
Router.post(
  "/register",
  [
    check("firstName").trim().isLength({ min: 1 }),
    check("lastName").trim().isLength({ min: 1 }),
    check("email").isEmail(),
    check("password").trim().isLength({ min: 1 }),
  ],
  UserInputMiddleware,
  AuthController.register
);

//Login
Router.post("/login", AuthController.login);

//Get refreshed token
Router.post("/token", AuthController.refreshToken);

//Logout
Router.delete("/logout", AuthController.logout);


export { Router as LoginRoutes };
