import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { SalonService } from "./SalonService"
import { SalonReview } from "./SalonReview"
import { SalonLocation } from "./SalonLocation"
import { type } from "os"

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
  hours: string //Day1&OpeningHour&ClosingHour%Day2...

  @OneToMany( () => SalonService, service => service.salon )
  services: SalonService[]

  @OneToMany( () => SalonReview, review => review.salon )
  @JoinColumn()
  reviews: SalonReview[]

  @OneToOne( location => SalonLocation )
  @JoinColumn()
  location: SalonLocation

}