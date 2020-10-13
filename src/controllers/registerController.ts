import { getRepository } from "typeorm";
import {User} from "../entity/User";
import { createHmac } from "crypto";

export async function Register(res, FirstName: string, LastName: string, Email: string, Password: string){
    let Repository = getRepository(User);

    let Exists = await Repository.findOne({ where:  { email: Email } });

    if(Exists == null)
    {
        let NewUser = new User();
        NewUser.firstName = FirstName;
        NewUser.lastName = LastName;
        NewUser.email = Email;
        NewUser.password = Password;

        await Repository.save(NewUser);
        return res.status(200).send();
    }
    else
    {
       return res.status(400).send();
    }
}

export async function userSaveAction(req, res){

    try
    {
        await Register(
            res,
            req.body.firstName, 
            req.body.lastName, 
            req.body.email,
            req.body.password );
        
        console.dir(req.body);
        return;
    }

    catch(Error)
    {
        console.error(Error);
        return res.status(500).send(); 
    }

}
