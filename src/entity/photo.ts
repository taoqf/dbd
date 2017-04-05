import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, ManyToMany } from 'typeorm';
import PhotoMetadata from './photo-meta-data';
import Author from './author';
import Album from './album';

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
	@Column()
	file_name: string;
	@Column('int')
	views: number;
	@Column()
	is_published: boolean;
	@OneToOne(type => PhotoMetadata, photo_metadata => photo_metadata.photo, { cascadeAll: true })
	metadata: PhotoMetadata;
	@ManyToOne(type => Author, author => author.photos, { cascadeAll: true })
	author: Author;
	@ManyToMany(type => Album, album => album.photos, {
		cascadeInsert: true, // allow to insert a new album on photo save
		cascadeUpdate: true, // allow to update an album on photo save
		// cascadeRemove: true  // allow to remove an album on photo remove
	})
	albums: Album[] = []; // we initialize array for convinience here
}
