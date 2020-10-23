import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import { Salon } from "./Salon"
import { User } from "../User/User"
import { SalonReview } from "./SalonReview"

@Entity({ name: "salonRate" })
export class SalonRate {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  rate: string

  @OneToOne( user => User )
  @JoinColumn()
  user: User

  @ManyToOne( () => Salon, salon => salon.rates )
  salon: Salon;

}