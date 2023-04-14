import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Message from './message.entity'
import type User from 'src/users/entity/user.entity'

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    users: User[]

  @OneToMany(() => Message, (message) => message.channel)
    messages: Message[]
}
