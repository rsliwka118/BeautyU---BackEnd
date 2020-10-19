import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

enum SalonType{
    Hairdresser="Hairdresser",
    Barber="Barber",
    Massager="Massager",
    Beautician="Beautician",
    Nails="Nails",
    Depilation="Depilation"
  }

@Entity({ name: "salons" })
export class Salon {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  ownerID: number

  @Column("enum", { enum: SalonType })
  type: SalonType

  @Column()
  rate: number

  @Column()
  review: string

  @Column()
  location: string

  @Column()
  hours: string

}