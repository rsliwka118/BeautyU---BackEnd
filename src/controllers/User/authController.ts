import { getRepository } from "typeorm"
import { User } from "../../entity/User/User"
import { createHmac } from "crypto"
import * as jwt from "jsonwebtoken"
import { Token } from "../../entity/User/Token"
import { UserRoutes } from "../../routes/User/user.routes"

//Details
export async function details(req, res) {
  let Repository = getRepository(User)

  let user = await Repository.findOne({ where: { id: req.body.data.userID } })

  try {
    if (user != null) {
      console.log("Successfully sended details!")
      return res.status(200).send({ firstName: user.firstName, lastName: user.lastName })
    } else {
      return res.status(404).send("User not found")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Register
export async function register(req, res) {
  let Repository = getRepository(User)

  let Exists = await Repository.findOne({ where: { email: req.body.data.email } })

  try {
    if (Exists == null) {
      let NewUser = new User()
      let message = "Register succes!"

      NewUser.accountType = req.body.data.accountType
      NewUser.firstName = req.body.data.firstName
      NewUser.lastName = req.body.data.lastName
      NewUser.email = req.body.data.email
      NewUser.password = req.body.data.password

      await Repository.save(NewUser)

      console.dir(NewUser)
      
      return res.status(200).send({message: message})
    } else {
      return res.status(400).send("This email already exists.")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Login
export async function login(req, res) {
  try {
    let RepositoryUser = getRepository(User)
    let RepositoryRefreshToken = getRepository(Token)
    let Exists = await RepositoryUser.findOne({ where: { email: req.body.data.email } })

    //Check accout exist
    if(Exists == null) { 
      return res.status(400).send("Account doesn't exist")
    } else {
      const user = await RepositoryUser.findOne({ where: { email: req.body.data.email } })
      const tokenExists = await RepositoryRefreshToken.findOne({ where: { userID: user.id } })

      //Check password
      if (user.password === createHmac("sha1", req.body.data.password).digest("hex")) {
        
        const accessToken = generateToken(user)

        //Check if refresh token already exists for this user.
        if (tokenExists == null) {
          const refreshToken = generateRefreshToken(user)

          let NewToken = new Token()
          NewToken.userID = user.id
          NewToken.refreshToken = refreshToken
          await RepositoryRefreshToken.save(NewToken)

          console.log("Successfully logged in ( user ID: " + user.id + " )")
          console.log("Successfully added refreshToken for user ID: " + user.id + " )")

          return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken, id: user.id, firstName: user.firstName, lastName: user.lastName })
        
        } else {
        
        console.log("Successfully logged in ( user ID: " + user.id + " )")

        return res.status(200).send({ accessToken: accessToken, refreshToken: tokenExists.refreshToken, id: user.id, firstName: user.firstName, lastName: user.lastName})
        }

      } else {
        return res.status(401).send("login failed")
      }
    }
    } catch (Error) {
      console.error(Error)
      return res.status(500).send("server err")
    }
  }

//Logout ( delete refresh token )
export async function logout(req, res) {

  let RepositoryRefreshToken = getRepository(Token)
  let refreshToken = req.headers["authorization"]

  await RepositoryRefreshToken.delete({ refreshToken: refreshToken });
  return res.status(204).send("Logged out")
}

//Get new access token
export async function refreshToken(req, res) {

  const refreshToken = req.body.data.token

  let RepositoryRefreshToken = getRepository(Token)
  let tokenExists = await RepositoryRefreshToken.findOne({ where: { refreshToken: refreshToken } })
  
    if (refreshToken == null) return res.sendStatus(401)
    if (tokenExists == null) return res.sendStatus(403)
    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    
      //Token no longer valid
      if (err) return res.sendStatus(403)
      
      const accessToken = generateToken({id: user.id})
      res.json({ accessToken: accessToken })
   })
}

//Generate Token
function generateToken(user) {
  return jwt.sign( {id: user.id} , process.env.JWT_ACCESS_SECRET, { expiresIn: 100000 } )
}

//Generate Refresh Token
function generateRefreshToken(user) {
  return jwt.sign( {id: user.id}, process.env.JWT_REFRESH_SECRET )
}

//Check access Token
export async function checkToken(req, res){
  console.log("Token fine")
  return res.sendStatus(200)
}