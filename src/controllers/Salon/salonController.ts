import { createHmac } from "crypto";
import { getRepository } from "typeorm"
import { Salon } from "../../entity/Salon/Salon"
import { SalonLocation } from "../../entity/Salon/SalonLocation";
import { SalonService } from "../../entity/Salon/SalonService";
import { User } from "../../entity/User/User"

//Check type of user account
function checkAccountType(user) {
    if(user.accountType === "Client") return 0;
    if(user.accountType === "Salon") return 1;
}

//Check if parameter is equal null ( for update functions )
function checkEmpty(param, existingItem){
  if(param === "") return existingItem
  else return param
}

//Add new salon
export async function addSalon(req, res) {
    let RepositoryUsers = getRepository(User)
    let RepositorySalons = getRepository(Salon)
    let RepositorySalonLocation = getRepository(SalonLocation)
    
    const user = await RepositoryUsers.findOne(req.user.id)

    try {
      if (checkAccountType(user)) {

        //Add Location
        let NewLocation = new SalonLocation()
        NewLocation.city = req.body.city,
        NewLocation.code = req.body.code,
        NewLocation.street = req.body.street,
        NewLocation.houseNumber = req.body.houseNumber,
        NewLocation.apartmentNumber = req.body.apartmentNumber
        await RepositorySalonLocation.save(NewLocation)

        //Add Salon
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

//Update salon
export async function updateSalon(req, res) {
  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonLocation = getRepository(SalonLocation)
  
  const user = await RepositoryUsers.findOne(req.user.id)
  const salonExist = await RepositorySalon.findOne(req.params.id)
  const locationExist = await RepositorySalonLocation.findOne(salonExist.location)

  try {
    if (salonExist == null) return res.status(404).send("No salon found")
    if (checkAccountType(user)) {

      //Update Location
      await RepositorySalonLocation.update(locationExist.id,
        {
          city: checkEmpty(req.body.city, locationExist.city),
          code: checkEmpty(req.body.code, locationExist.code),
          street: checkEmpty(req.body.street, locationExist.street),
          houseNumber: checkEmpty(req.body.houseNumber, locationExist.houseNumber),
          apartmentNumber: checkEmpty(req.body.apartmentNumber, locationExist.houseNumber)
        }
      )

      //Update Salon
      await RepositorySalon.update(req.params.id,
        {
          name: checkEmpty(req.body.name, salonExist.name),
          type: checkEmpty(req.body.type, salonExist.type),
          describe: checkEmpty(req.body.describe, salonExist.describe),
          hours: checkEmpty(req.body.hours, salonExist.hours)
        }
      )

      res.send("Successfuly updated salon for " + user.firstName + "!")

      return res.status(200)
  } else {
      return res.status(400).send("access denied ( route for salon account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Delete salon
export async function deleteSalon(req, res) {

  let RepositoryUsers = getRepository(User)
  let RepositorySalon = getRepository(Salon)
  let RepositorySalonLocation = getRepository(SalonLocation)

  try {
    const user = await RepositoryUsers.findOne(req.user.id)
    console.log(req.user.id)
    const salonExist = await RepositorySalon.findOne(req.params.id)
    
    //Check if salon exist
    if (salonExist == null) return res.status(404).send("No salon found")

    //Check if owners password is correct
    if (user.password === createHmac("sha1", req.body.password).digest("hex")) {
      const locationExist = await RepositorySalonLocation.findOne(salonExist.location)

      await RepositorySalon.delete(salonExist);
      await RepositorySalonLocation.delete(locationExist);

      res.send("Successfully deleted salon " + salonExist.name +  "( id: "+ salonExist.id + ")")
      return res.status(204)
    } else {
      return res.status(401).send("The correct password is required to delete the salon")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Add new salon service

//Update salon service

//Delete salon service

//Add salon review

//Get all salons

//Get salon by ID