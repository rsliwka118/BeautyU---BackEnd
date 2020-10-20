import { check } from "express-validator";
import * as express from "express";

import * as SalonController from "../../controllers/Salon/salonController";
import authenticateToken from "../../middlewares/authenticateToken.middlewares";
import CheckInputMiddleware from "../../middlewares/input.middlewares";

var Router = express.Router();

//Add new salon
Router.post("/addSalon",
  [
    check("name", "Salon name must contain minimum 5 and maximum 50 characters").trim().isLength({ min: 5, max: 50 }),
    check("type", "Incorrect salon type. Must be Hairdresser, Barber, Massager, Beautician, Nails, Depilation")
    .isIn(['Hairdresser', 'Barber', 'Massager', 'Beautician', 'Nails', 'Depilation']),
    check("describe", "Salon describe can be up to 250 characters long").trim().isLength({ max: 250 }),
    check("hours", "Hours can not be empty").not().isEmpty(),
    check("City", "City can not be empty").not().isEmpty(),
    check("Code", "Code can not be empty").not().isEmpty(),
    check("Street", "Street can not be empty").not().isEmpty(),
    check("houseNumber", "Number can not be empty").not().isEmpty(),

  ], 
  CheckInputMiddleware, authenticateToken, SalonController.addSalon)

//Update salon

//Delete salon

//Get all salons

//Get salon by ID

export { Router as SalonRoutes };