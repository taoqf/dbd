import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import Card from './card';
import Collection from './collection';

@Entity('u_user')
export default class User {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	name: string;
	@Column()
	age: number;
	@OneToOne(type => Card, card => card.user, {
		cascadeAll: true
	})
	card: Card;
	@OneToMany(type => Collection, collection => collection.user)
	collects: number;
}