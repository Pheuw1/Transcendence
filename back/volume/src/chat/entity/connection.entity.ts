import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'

@Entity()
export default class ConnectedUser {
	@Column()
    user: number

	@Column()
    channel: number

  @PrimaryColumn()
    socket: string
}
