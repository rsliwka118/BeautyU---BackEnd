import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Salon } from "./Salon"

@Entity({ name: "salonService" })
export class SalonService {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  offerTitle: string

  @Column()
  price: string

  @Column()
  time: string

  @ManyToOne( () => Salon, salon => salon.services)
  salon: Salon
  
}