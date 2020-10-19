import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "salonOffers" })
export class SalonOffer {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  salonID: number

  @Column()
  userID: number

  @Column()
  review: string

  @Column()
  rate: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dateAdded: string

}