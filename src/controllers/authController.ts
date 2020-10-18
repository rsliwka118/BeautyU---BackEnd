import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { createHmac } from "crypto"
import * as jwt from "jsonwebtoken"

let refreshTokens = [] //Temporarily | refresh tokens will be stored in DB 

//Register
export async function register(req, res) {
  let Repository = getRepository(User)

  let Exists = await Repository.findOne({ where: { email: req.body.email } })

  try {
    if (Exists == null) {
      let NewUser = new User()
      NewUser.accountType = req.body.accountType
      NewUser.firstName = req.body.firstName
      NewUser.lastName = req.body.lastName
      NewUser.email = req.body.email
      NewUser.password = req.body.password

      await Repository.save(NewUser)

      console.dir(NewUser)
      res.send("Register succes!")

      return res.status(200).send()
    } else {
      return res.status(400).send()
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Login
export async function login(req, res) {
  try {
    let Repository = getRepository(User)

    const user = await Repository.findOne({ where: { email: req.body.email } })

    if (user.password === createHmac("sha1", req.body.password).digest("hex")) {
      const accessToken = generateToken(user)
      const refreshToken = generateRefreshToken(user)
      refreshTokens.push(refreshToken)

      console.log("Successfully logged in ( user ID: " + user.id + " )")

      return res
        .status(200)
        .send({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      return res.status(401).send("login failed")
    }
  } catch (Error) {
    console.error(Error)
    return res.status(500).send("server err")
  }
}

//Logout
export async function logout(req, res) {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204).send("logged out")
}

//Get refreshed token
export async function refreshToken(req, res) {
    
  const refreshToken = req.body.token
    
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    
      //token no longer valid
      if (err) return res.sendStatus(403)
      
      const accessToken = generateToken({id: user.id})
      res.json({ accessToken: accessToken })
   })
}

//Generate Token
function generateToken(user) {
  return jwt.sign( JSON.parse(JSON.stringify(user)), process.env.JWT_ACCESS_SECRET, { expiresIn: "60m" } )
}

//Generate Refresh Token
function generateRefreshToken(user) {
  return jwt.sign( JSON.parse(JSON.stringify(user)), process.env.JWT_REFRESH_SECRET )
}
