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

  let RepositoryVisit = getRepository(Visit)
  let RepositorySalon = getRepository(Salon)
  
  //potem rozszarzyć dla sprawdzenia wielu wizyt
  let visit = await RepositoryVisit.findOne({ where: { salonID: req.params.id } })
  let salon = await RepositorySalon.findOne({ where: { id: req.params.id } })
  
  try {

    const hours = convertHours(salon.hours)
    salonHours(visit.date, 30, hours)
      
    return res.sendStatus(200) 

  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

function salonHours(date, serviceTime, salonHours) {

    const dayOfWeek = new Date(date).getDay()
    const start = salonHours[dayOfWeek-1][0]
    const end = salonHours[dayOfWeek-1][1]

    let availableHours = []
    let i = 0

    availableHours.push(start)

    while ( compareHours( addHours(availableHours[i], serviceTime), end ) ) {
         availableHours.push( addHours(availableHours[i], serviceTime) )
         i++
    } 

    console.log(availableHours)
}

function addHours(hr, el) {

    let hours = hr.split(':')
    let hour = parseInt(hours[0], 10);
    let minute = parseInt(hours[1], 10);

    if( minute + el > 60) {
        hour = ( ++hour > 23) ? 0 : hour++
        minute -= el
    } else {
        minute += el
    }
    
    return hour + ":" + ( minute < 10 ? "0" : "") + minute

}

function compareHours(hr1, hr2) {

    let hours1 = hr1.split(':')
    let hour1 = parseInt(hours1[0], 10);
    let minute1 = parseInt(hours1[1], 10);

    let hours2 = hr2.split(':')
    let hour2 = parseInt(hours2[0], 10);
    let minute2 = parseInt(hours2[1], 10);
    
    if( hour1 == hour2 ){
        if( minute1 < minute2) return true
    }
    else if( hour1 < hour2 ) return true
    else return false

}

function convertHours(hours) {
    let hrs = hours.split('#')

    for(let i=0; i < hrs.length; i++){
        hrs[i]=hrs[i].split('&')
    }

    return hrs
}