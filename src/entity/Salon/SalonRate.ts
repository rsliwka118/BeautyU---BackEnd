import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import { Salon } from "./Salon"
import { User } from "../User/User"

@Entity({ name: "salonRate" })
export class SalonRate {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  rate: string

  @ManyToOne( user => User, {
    onDelete: 'CASCADE'
  } )
  user: User

  @ManyToOne( () => Salon, salon => salon.rates )
  @JoinColumn()
  salon: Salon;

}