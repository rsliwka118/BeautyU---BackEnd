import { check } from "express-validator";

import * as express from "express";
import * as AuthController from "../controllers/authController";

import sessionChecker from "../middlewares/authenticateToken.middlewares";
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

//Logout
Router.post("/logout", AuthController.logout);

export { Router as LoginRoutes };
