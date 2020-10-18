import { check } from "express-validator";

import * as express from "express";
import * as AuthController from "../../controllers/authServer/authController";

import sessionChecker from "../../middlewares/authServer/authenticateToken.middlewares";
import UserInputMiddleware from "../../middlewares/authServer/input.middlewares";
import authenticateToken from "../../middlewares/authServer/authenticateToken.middlewares";

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

//Token test
Router.post("/dashboard", authenticateToken, AuthController.test);

export { Router as LoginRoutes };
