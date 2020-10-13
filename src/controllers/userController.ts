import { getRepository } from "typeorm";
import * as UserModel from "../Models/user.models"
import {User} from "../entity/User";

export async function userSaveAction(req, res){

    try
    {
        await UserModel.Register(
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

export async function usersGetAction(req,res){

    try
    {
        let Repository = getRepository(User);
        const users = await Repository.find();
    
        return res.status(200).send(users);
    }

    catch(Error)
    {
        console.error(Error);
        return res.status(500).send(); 
    }
}

export async function userGetByIdAction(req, res){

    try
    {
        let Repository = getRepository(User);
        const user = await Repository.findOne(req.params.id);

        if (!user) {
            res.status(404);
            res.end();
            return;
        }

        return res.status(200).send(user); 
        
    }

    catch(Error)
    {
        console.error(Error);
        return res.status(500).send(); 
    }
}