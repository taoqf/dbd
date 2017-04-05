import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Photo from "./photo";

@Entity()
export default class Author {
	@PrimaryGeneratedColumn({
		type: 'uuid'
	})
	id: string;

	@Column()
	name: string;

	@OneToMany(type => Photo, photo => photo.author) // note: we will create author property in the Photo class below
	photos: Photo[];
}
