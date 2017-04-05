import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import Photo from './photo';

@Entity()
export default class Album {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(type => Photo, photo => photo.albums, {  // note: we will create "albums" property in the Photo class below
		cascadeInsert: true, // allow to insert a new photo on album save
		cascadeUpdate: true, // allow to update a photo on album save
		// cascadeRemove: true  // allow to remove a photo on album remove
	})
	@JoinTable()
	photos: Photo[] = []; // we initialize array for convinience here
}