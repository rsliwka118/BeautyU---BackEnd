import { getManager, getRepository } from "typeorm"
import { User } from "../../entity/User/User"
import { Salon } from "../../entity/Salon/Salon"
import { Visit } from "../../entity/Visits/Visits"
import { SalonService } from "../../entity/Salon/SalonService"

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
  
        //Add Visit
        let NewVisit = new Visit()
        NewVisit.userID = user.id,
        NewVisit.salonID = salon.id,
        NewVisit.serviceID = req.body.data.serviceID,
        NewVisit.date = req.body.data.date,
        NewVisit.hour = req.body.data.hour,
        NewVisit.info = req.body.data.info
  
        await RepositoryVisits.save(NewVisit)
  
        console.dir(NewVisit)
 
        return res.status(200).send({message:"Zarezerwowano wizytę!"})
    } else {
        return res.status(400).send("access denied ( route for client account )")
      }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }

//Get user visits
export async function getVisit(req, res) {
  try {
    let RepositoryUsers = getRepository(User)
    let RepositorySalon = getRepository(Salon)
    let RepositoryVisits = getRepository(Visit)
  
    const user = await RepositoryUsers.findOne(req.user.id)

    if (!checkAccountType(user)) {

      //Get visits
      const visits = await getRepository(Visit)
      .createQueryBuilder('visit')
      .select(['visit.id','visit.date','visit.hour','visit.status'])
      .leftJoinAndMapOne('visit.salonID', Salon, 'salon', 'visit.salonID = salon.id')
      .leftJoinAndMapOne('visit.serviceID', SalonService, 'service', 'visit.serviceID = service.id')
      .where("userID = :userID", { userID: user.id})
      .andWhere("status = 'Scheduled'")
      .orderBy("visit.date")
      .getMany()

      const history = await getManager()
      .createQueryBuilder(Visit, 'visit')
      .select(['visit.id','visit.date','visit.hour','visit.status'])
      .addSelect('visit.hour')
      .leftJoinAndMapOne('visit.salonID', Salon, 'salon', 'visit.salonID = salon.id')
      .leftJoinAndMapOne('visit.serviceID', SalonService, 'service', 'visit.serviceID = service.id')
      .where("userID = :userID", { userID: user.id})
      .andWhere("status != 'Scheduled'")
      .orderBy("visit.date")
      .getMany()

      return res.status(200).send({visits: visits, history: history})
  } else {
      return res.status(400).send("access denied ( route for client account )")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Update status
export async function updateStatus(req,res){

  let RepositoryVisits = getRepository(Visit)
  let visit = await RepositoryVisits.findOne({ where: { id: req.params.id } })
  
  try {
    if (visit != null) {
      let status = req.body.data.status
      let message = status === "Canceled" ? "Anulowano wizytę" : "Zmieniono status wizyty"

      await getManager()
      .createQueryBuilder(Visit, 'visit')
      .update<Visit>(Visit, {status: status})
      .where("id = :id", { id: req.params.id })
      .updateEntity(true)
      .execute();

      console.log("Successfully updated visit status!")
      return res.status(200).send( {message: message})
    } else {
      return res.status(404).send("Visit not found")
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
  
  let salon = await RepositorySalon.findOne({ where: { id: req.params.id } })
  let date = req.body.data.date

  const _date = new Date(req.body.data.date)

  try {

    const hours = convertHours(salon.hours)
    const availableHours = salonHours(date, 30, hours)
    const today = new Date()
    const now = today.getHours() + ":" + today.getMinutes()
    let arr = []

    if(availableHours.length != 0){
      const visitsHours = await getManager()
      .createQueryBuilder(Visit, 'visit')
      .select('visit.hour')
      .where("date like :date", { date: `%${date}%`})
      .getMany()
      
      for( let i = 0; i < visitsHours.length; i++ ){
          removeItem( availableHours, visitsHours[i].hour )
      }

      if( formatFullDate( _date ) === formatFullDate(today)){
        for( let i = 0; i < availableHours.length; i++ ){
          if( compareHours( availableHours[i], now ) ) arr.push(availableHours[i])//removeItem( availableHours, availableHours[i] )
        }
        for( let i = 0; i < arr.length; i++ ){
          removeItem( availableHours, arr[i] )
        }
      }

    }

    return res.status(200).send( { availableHours: availableHours } ) 

  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

function removeItem(array, item){
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function salonHours(date, serviceTime, salonHours) {
    
  let availableHours = []
 
    let dayOfWeek = new Date(date).getDay() || 7 //start day convert to monday


    const start = salonHours[dayOfWeek - 1][0]
    const end = salonHours[dayOfWeek - 1][1]

    if( salonHours[dayOfWeek - 1][0] === "-") return []
    availableHours.push(start)

    let i = 0

    while ( compareHours( addHours(availableHours[i], serviceTime), end ) ) {
        availableHours.push( addHours(availableHours[i], serviceTime) )
        i++
    } 

    return availableHours
    
}

function addHours(hr, el) {

    let hours = hr.split(':')
    let hour = parseInt(hours[0], 10);
    let minute = parseInt(hours[1], 10);

    if( minute + el >= 60) {
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
        else return false
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

function formatFullDate(data){
  let dd = String(data.getDate()).padStart(2, '0')
  let mm = String(data.getMonth() + 1).padStart(2, '0')
  let yyyy = data.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}