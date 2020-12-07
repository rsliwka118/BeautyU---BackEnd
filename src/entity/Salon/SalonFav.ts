import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm"
import { Salon } from "./Salon"
import { User } from "../User/User"

@Entity({ name: "salonFav" })
export class SalonFav {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  salon: string

  @Column()
  user: string
}