import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "tokens" })
export class Token {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  userID: string

  @Column()
  refreshToken: string
}
