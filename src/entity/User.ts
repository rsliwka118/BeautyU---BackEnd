import { createHmac } from "crypto";
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate} from "typeorm";

@Entity( {name: "users"} )
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column() 
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
    if (this.password) {
        this.password = createHmac('sha256', this.password).digest('hex');
    }
   }
}

