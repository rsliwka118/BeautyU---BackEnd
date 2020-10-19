import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "salons" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  ownerID: number

  @Column()
  type: string

}