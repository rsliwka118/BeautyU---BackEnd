import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "tokens" })
export class Token {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  userID: number

  @Column()
  refreshToken: string
}
