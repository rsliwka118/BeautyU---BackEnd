import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Salon } from "./Salon"

@Entity({ name: "salonService" })
export class SalonService {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  offerTitle: string

  @ManyToOne( () => Salon, salon => salon.services)
  salon: Salon;
  
}