import { check } from "express-validator";

import * as express from "express";
import * as AuthController from "../../controllers/User/authController";

import UserInputMiddleware from "../../middlewares/input.middlewares";


var Router = express.Router();

//Register
Router.post(
  "/register",
  [
    check("firstName", "Incorrect firstName").trim().isLength({ min: 1 }),
    check("lastName", "Incorrect lastName").trim().isLength({ min: 1 }),
    check("email", "Incorrect email").isEmail(),
    check("password", "Incorrect password").isLength({ min: 8 }).matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
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
