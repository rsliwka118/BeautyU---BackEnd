import * as express from "express";

import * as SalonController from "../../controllers/Salon/salonController";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";

var Router = express.Router();

//Add new salon
Router.post("/addSalon", authenticateToken, SalonController.addSalon)

//Update salon

//Delete salon

//Get all salons

//Get salon by ID

export { Router as SalonRoutes };