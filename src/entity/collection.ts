import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user';
import Card from './card';

@Entity()
export default class Collection {
	@PrimaryGeneratedColumn()
	id: number;
	@ManyToOne(type => User, user => user.collects, { cascadeAll: true })
	user: User;
	@ManyToOne(type => Card, card => card.collection)
	card: number;
}