import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import User from 'src/users/entity/user.entity'
import Message from './message.entity'

@Entity()
export default class Channel {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    name: string

  @Column({ default: false })
    isPrivate: boolean

  @Column({ default: '' })
    password: string

  @ManyToMany(() => User)
  @JoinTable()
    users: User[]

  @OneToMany(() => Message, (message: Message) => message.channel, { cascade: true })
    messages: Message[]

  @ManyToOne(() => User)
  @JoinColumn()
    owner: User

  @ManyToMany(() => User)
  @JoinTable()
    admins: User[]

  @Column('text', { array: true, default: [] })
    banned: number[][]

  @Column('text', { array: true, default: [] })
    muted: number[][]

  @Column({ default: false })
    isDM: boolean
}
