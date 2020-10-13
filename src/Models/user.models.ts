import {getManager, getRepository} from "typeorm";
import {User} from "../entity/User";

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

