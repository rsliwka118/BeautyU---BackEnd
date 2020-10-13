import * as express from "express";
import {check} from "express-validator";

import * as UserController from "../controllers/userController";
import UserInputMiddleware from "../middlewares/input.middlewares";

var Router = express.Router();

Router.post('/users', [

    check('firstName').trim().isLength({ min:1 }),
    check('lastName').trim().isLength({ min:1 }),
    check('email').isEmail(),
    check('password').trim().isLength({ min:1 }),
    
], UserInputMiddleware, UserController.userSaveAction);

Router.get('/users', UserController.usersGetAction);

Router.get('/users/:id', UserController.userGetByIdAction);

export {Router as UserRoutes};