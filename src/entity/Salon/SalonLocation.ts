import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "salonLocations" })
export class SalonLocation {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  salonID: number

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