import { check } from "express-validator";

import * as express from "express";
import * as AuthController from "../../controllers/User/authController";

import CheckInputMiddleware from "../../middlewares/input.middlewares";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";
import { RelationCountAttribute } from "typeorm/query-builder/relation-count/RelationCountAttribute";

var Router = express.Router();
//Get details
Router.post("/details", authenticateToken, AuthController.details)

//Set account
Router.post("/settings/:id", authenticateToken, AuthController.settings)

//Register
Router.post("/register",
  [
    check("data.firstName", "Incorrect firstName").trim().isLength({ min: 1, max: 50 }),
    check("data.lastName", "Incorrect lastName").trim().isLength({ min: 1, max: 50 }),
    check("data.email", "Incorrect email").isEmail(),
    check("data.password", "Incorrect password (8-20 characters)").isLength({ min: 8, max: 20 }).matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
  ],
  CheckInputMiddleware, AuthController.register);

//Login
Router.post("/login", AuthController.login);

//Get refreshed token
Router.post("/token", AuthController.refreshToken);

//Logout
Router.delete("/logout", AuthController.logout);

//CheckToken
Router.get("/checktoken", authenticateToken, AuthController.checkToken)

export { Router as LoginRoutes };
