import {check} from "express-validator";

import * as express from "express";
import * as LoginController from "../controllers/loginController";
import * as RegisterController from "../controllers/registerController";

import sessionChecker from "../middlewares/sessionChecker";
import UserInputMiddleware from "../middlewares/input.middlewares";

var Router = express.Router();

Router.post('/register', [

    check('firstName').trim().isLength({ min:1 }),
    check('lastName').trim().isLength({ min:1 }),
    check('email').isEmail(),
    check('password').trim().isLength({ min:1 }),
    
], UserInputMiddleware, RegisterController.userSaveAction);

Router.post('/login', sessionChecker, LoginController.login);

Router.post('/logout', LoginController.logout);

export {Router as LoginRoutes};
