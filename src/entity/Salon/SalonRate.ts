import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { Salon } from "./Salon"
import { User } from "../User/User"

@Entity({ name: "salonRate" })
export class SalonRate {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  rate: string

  @OneToOne( user => User )
  @JoinColumn()
  user: User

  @OneToOne( salon => Salon )
  @JoinColumn()
  salon: Salon

}