import { createHmac } from "crypto"
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Salon } from "../Salon/Salon"
import { SalonFav } from "../Salon/SalonFav"
import { SalonRate } from "../Salon/SalonRate"
// import { SalonFav } from "../Salon/SalonFav"

enum AccoutType{
  Admin="Admin",
  Client="Client",
  Salon="Salon"
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column("enum", { enum: AccoutType })
  accountType: AccoutType

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string
  
  @Column('bit', { default: 0 })
  isNew: number;

  @Column()
  city: string

  @OneToMany( () => SalonRate, rate => rate.user )
  rates: SalonRate[]
  
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = createHmac("sha1", this.password).digest("hex")
    }
  }
}
