import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, Index } from "typeorm"
import { SalonService } from "./SalonService"
import { SalonReview } from "./SalonReview"
import { SalonLocation } from "./SalonLocation"
import { type } from "os"
import { SalonRate } from "./SalonRate"
import { SalonFav } from "./SalonFav"

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

  @Index({ fulltext: true })
  @Column()
  name: string

  @Column("enum", { enum: SalonType })
  type: SalonType

  @Column()
  describe: string

  @Column()
  hours: string //8:00&20:00#8:01&20:01#8:02&20:02#8:03&20:03#8:04&20:04#8:05&20:05#-&-

  @OneToMany( () => SalonService, service => service.salon )
  services: SalonService[]

  @OneToMany( () => SalonReview, review => review.salon )
  reviews: SalonReview[]

  @OneToOne( location => SalonLocation )
  @JoinColumn()
  location: SalonLocation

  @OneToMany( () => SalonRate, rate => rate.salon )
  rates: SalonRate[]

  fav: any
}