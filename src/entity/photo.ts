import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne } from 'typeorm';
import PhotoMetadata from './photo-meta-data';
import Author from './author';

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
	@Column({
		nullable: true
	})
	file_name: string;
	@Column('int')
	views: number;
	@Column()
	is_published: boolean;
	@OneToOne(type => PhotoMetadata, photo_metadata => photo_metadata.photo, { cascadeAll: true })
	metadata: PhotoMetadata;
	@ManyToOne(type => Author, author => author.photos, { cascadeAll: true })
	author: Author;
}
