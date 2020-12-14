import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, Index } from "typeorm"

enum Status{
    Canceled="Canceled",
    Scheduled="Scheduled",
    Finished="Finished",
}

@Entity({ name: "visits" })
export class Visit {
  @PrimaryGeneratedColumn("uuid")
  id: string
  
  @Column()
  salonID: string

  @Column()
  userID: string

  @Column()
  serviceID: string

  @Column()
  date: string

  @Column()
  hour: string

  @Column()
  info: string

  @Column("enum", { enum: Status, default: "Scheduled" } )
  status: Status

}