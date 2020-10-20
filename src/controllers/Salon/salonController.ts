import { getRepository } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { SalonLocation } from "../../entity/Salon/SalonLocation";
import { SalonService } from "../../entity/Salon/SalonService";
import { User } from "../../entity/User/User"

function checkAccountType(user) {
    if(user.accountType === "Client") return 0;
    if(user.accountType === "Salon") return 1;
}

//Add new salon with location
export async function addSalon(req, res) {
    let RepositoryUsers = getRepository(User)
    let RepositorySalons = getRepository(Salon)
    let RepositorySalonLocation = getRepository(SalonLocation)
    
    const user = await RepositoryUsers.findOne(req.user.id)

    try {
      if (checkAccountType(user)) {

        //Location
        let NewLocation = new SalonLocation()
        NewLocation.city = req.body.city,
        NewLocation.code = req.body.code,
        NewLocation.street = req.body.street,
        NewLocation.houseNumber = req.body.houseNumber,
        NewLocation.apartmentNumber = req.body.apartmentNumber
        await RepositorySalonLocation.save(NewLocation)

        //Salon
        let NewSalon = new Salon()
        NewSalon.ownerID = user.id,
        NewSalon.name = req.body.name,
        NewSalon.type = req.body.type,
        NewSalon.describe = req.body.describe,
        NewSalon.hours = req.body.hours,
        NewSalon.location = NewLocation

        await RepositorySalons.save(NewSalon)
        console.dir(NewSalon)
        res.send("Successfuly added new salon for " + user.firstName + "!")

        return res.status(200)
    } else {
        return res.status(400).send("access denied ( route for salon account )")
      }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }