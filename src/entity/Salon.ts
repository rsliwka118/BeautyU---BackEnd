import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "salons" })
export class Salon {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  ownerID: number

  @Column()
  type: string

}