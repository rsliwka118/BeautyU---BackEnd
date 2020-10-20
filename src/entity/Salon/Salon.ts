import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { SalonService } from "./SalonService"
import { SalonReview } from "./SalonReview"
import { SalonLocation } from "./SalonLocation"

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
  id: string

  @Column()
  ownerID: string

  @Column()
  name: string

  @Column("enum", { enum: SalonType })
  type: SalonType

  @Column()
  describe: string

  @Column()
  rate: number

  @Column()
  hours: string //Day1&OpeningHour&ClosingHour&Day2...

  @OneToMany( () => Salon, offer => SalonService )
  @JoinColumn()
  services: SalonService[]

  @OneToMany( () => Salon, review => SalonReview )
  @JoinColumn()
  reviews: SalonReview[]

  @OneToOne( location => SalonLocation )
  @JoinColumn()
  location: SalonLocation

}