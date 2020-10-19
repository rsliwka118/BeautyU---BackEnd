import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

enum Day{
    Monday="Monday",
    Tuesday="Tuesday",
    Wednesday="Wednesday",
    Thursday="Thursday",
    Friday="Friday",
    Saturday="Saturday",
    Sunday="Sunday"
  }

@Entity({ name: "salonHours" })
export class SalonHour {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  salonID: number

  @Column("enum", { enum: Day })
  day: Day

  @Column("time")
  openingTime: Date

  @Column("time")
  closignTime: Date


}