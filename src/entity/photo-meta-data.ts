import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import Photo from "./photo";

@Entity()
export default class PhotoMetadata {
	@PrimaryGeneratedColumn({
		type: 'uuid'
	})
	id: string;

	@Column("int")
	height: number;

	@Column("int")
	width: number;

	@Column()
	orientation: string;

	@Column()
	compressed: boolean;

	@Column()
	comment: string;

	@OneToOne(type => Photo, photo => photo.metadata, { cascadeUpdate: true })
	@JoinColumn()
	photo: Photo;
}
