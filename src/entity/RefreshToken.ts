import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: "refreshTokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column()
  userID: number

  @Column()
  refreshToken: string
}
