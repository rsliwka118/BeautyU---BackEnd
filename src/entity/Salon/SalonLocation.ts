import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

@Entity({ name: "salonLocations" })
export class SalonLocation {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  city: string

  @Column()
  code: string

  @Column()
  street: string

  @Column()
  houseNumber: string

  @Column()
  apartmentNumber: string
}