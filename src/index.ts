import "reflect-metadata";

import * as Express from "express";
import * as ExpressSession from 'express-session';

import {createConnection} from "typeorm";
import {UserRoutes} from "./routes/user.routes";
import {LoginRoutes} from "./routes/auth.routes";

const app = Express();

const MemoryStore = ExpressSession.MemoryStore,
sessionStore = new MemoryStore();

app.use(Express.json());
app.use(Express.urlencoded({extended: true}));

app.use(ExpressSession(
    {
        store: sessionStore,
        name:"beautyu",
        secret: 'uytuaeb#@!',
        proxy: true,
        saveUninitialized: false,
        resave: false,
        cookie:
        {
            exprises: 3600000 
        }
    }
));

app.use(UserRoutes);
app.use(LoginRoutes);

createConnection().then(async connection => {
    
    app.listen(1337);
    console.log("Express application is up and running on port 1337");

}).catch(error => console.log(error));
