import { createHmac } from "crypto";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";

// enum AccountType {
//   Client,
//   Salon,
//   Admin,
// }

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  accountType: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = createHmac("sha1", this.password).digest("hex");
    }
  }
}
