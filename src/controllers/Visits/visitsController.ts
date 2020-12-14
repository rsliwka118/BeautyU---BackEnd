import { getManager, getRepository } from "typeorm"
import { User } from "../../entity/User/User"
import { createHmac } from "crypto"
import * as jwt from "jsonwebtoken"
import { Token } from "../../entity/User/Token"
import { UserRoutes } from "../../routes/User/user.routes"
import { SalonFav } from "../../entity/Salon/SalonFav"
import { Salon } from "../../entity/Salon/Salon"
import { SalonLocation } from "../../entity/Salon/SalonLocation"
import { Visit } from "../../entity/Visits/Visits"

function checkAccountType(user) {
    if(user.accountType === "Client") return 0
    if(user.accountType === "Salon") return 1
}

//Add new visit
export async function addVisit(req, res) {
    try {
      let RepositoryUsers = getRepository(User)
      let RepositorySalon = getRepository(Salon)
      let RepositoryVisits = getRepository(Visit)
    
      const user = await RepositoryUsers.findOne(req.user.id)
      const salon = await RepositorySalon.findOne(req.params.id)
  
      if (salon == null) return res.status(404).send("No salon found")
      if (!checkAccountType(user)) {
  
        //Add Review
        let NewVisit = new Visit()
        NewVisit.userID = user.id,
        NewVisit.salonID = salon.id,
        NewVisit.serviceID = req.body.data.serviceID,
        NewVisit.date = req.body.data.date,
        NewVisit.info = req.body.data.info
  
        await RepositoryVisits.save(NewVisit)
  
        console.dir(NewVisit)
  
        return res.status(200).send("Successfuly added new visit for " + salon.name + " by " + user.firstName + "!")
    } else {
        return res.status(400).send("access denied ( route for client account )")
      }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }

//Get available date
export async function getAvailableDate(req, res) {

  let Repository = getRepository(User)
  let user = await Repository.findOne({ where: { id: req.body.data.userID } })
  
  try {
    if (user != null) {

      const favorites = await getManager()
      .createQueryBuilder(SalonFav, 'salonFav')
      .select('salonFav.salon')
      .where('salonFav.user = :id', {id: req.user.id})
      .getMany()

      const cities = await getManager()
      .createQueryBuilder(SalonLocation,'location')
      .select("location.city AS city")
      .addSelect("COUNT(*) AS count")
      .groupBy("location.city")
      .getRawMany();

      console.log("Successfully sended details!")
      return res.status(200).send({user: { firstName: user.firstName, lastName: user.lastName, city: user.city, isNew: user.isNew }, favorites, cities})
    } else {
      return res.status(404).send("User not found")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}
