import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export default class Photo {
	@PrimaryGeneratedColumn({
		type: 'uuid'
	})
	id: string;
	@Column({
		length: 500
	})
	name: string;
	@Column('text')
	description: string;
	@Column('int')
	views: number;
	@Column()
	is_published: boolean;
}
