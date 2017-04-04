import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import User from './user';
import Collection from './collection';

@Entity()
export default class Card {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	company: string;

	@Column()
	phone: string;

	@OneToOne(() => User, user => user.card)
	@JoinColumn('userid')
	user: User;

	@OneToMany(type => Collection, collection => collection.card)
	collection: number;
}