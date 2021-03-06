import "reflect-metadata";
import * as log4js from 'log4js';
import { createConnection } from 'typeorm';
import User from './entity/user';
import Card from './entity/card';

async function connect() {
	return await createConnection('postgres', '/home/taoqf/git/dbd/ormconfig.json');
}

async function test1() {
	const conn = await connect();
	function add() {
		const user = new User();
		console.log(222);
		user.name = 'taoqf';
		user.age = 34;
		return user;
	}
	const saved = await conn.entityManager.persist([add(), add(), add()]);
	console.log('user saved');
	console.log(saved);
	process.exit();
}

async function test2() {
	const conn = await connect();
	const em = conn.entityManager;
	const users = await em.find(User);
	console.log('users', users);
	const usersAndCount = await em.findAndCount(User);
	console.log('usersAndCount', usersAndCount);
	const user = await em.findOne(User);
	console.log('user', user);
}

async function test3() {
	const conn = await connect();
	const ur = conn.getRepository(User);
	const users = await ur.find();
	console.log('users:', users);
	const user1 = await ur.findOneById(4);
	console.log('user1', user1);
	const user2 = await ur.find({
		id: 5
	});
	console.log('user2', user2);
}

async function test4() {
	const conn = await connect();
	const ur = conn.getRepository(User);
	await ur.remove(await ur.find());
}

async function test5() {
	const conn = await connect();
	const user = new User();
	user.age = 34;
	user.name = 'taoqf';
	const card = new Card();
	card.company = 'friendslink';
	card.phone = '17093759183';
	user.card = card;
	const saved = await conn.getRepository(Card).persist(card);
	console.log('saved', saved);
	await conn.getRepository(User).persist(user);
	console.log('saved user', user);
	await conn.close();
}

async function test6() {
	const conn = await connect();
	const cr = conn.getRepository(Card);
	const card = await cr.findOne({
		alias: 'card',
		innerJoinAndSelect: {
			user: 'card.user'
		}
	});
	if (card) {
		console.log('card', card);
		const user = card.user;
		console.log('user', user);
	} else {
		console.error('cannot find card');
	}
	await conn.close();
}

async function test() {
	const conn = await connect();
	const ur = conn.getRepository(User);
	await ur.remove(await ur.find());
	console.log('removed');
	const cr = conn.getRepository(Card);
	await cr.remove(await cr.find());
	await conn.close();
	console.log('removed');
}

async function test7() {
	const conn = await connect();
	const ur = conn.getRepository(User);
	const user = await ur.findOne({
		alias: 'user',
		innerJoinAndSelect: {
			card: 'user.card'
		}
	});
	console.log('user', user);
	await conn.close();
}

import Photo from './entity/photo';

async function test8() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const photos = await pr.find();
	console.log('photos:', photos);
	await conn.close();
}

async function test_9() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const photo = new Photo();
	photo.name = "taoqf";
	photo.description = "I am near polar bears";
	photo.file_name = "photo-with-bears.jpg";
	photo.views = 1;
	photo.is_published = true;
	const saved = await pr.persist(photo);
	console.log('saved photo', saved);
	await conn.close();
}

async function test_10() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const [photos, count] = await pr.findAndCount({ name: 'taoqf' });
	console.log(photos, count);
	await conn.close();
}

import PhotoMetadata from './entity/photo-meta-data';

async function test_11() {
	const conn = await connect();
	// create a photo
	const photo = new Photo();
	photo.name = "only me";
	photo.description = "I am near polar bears";
	photo.file_name = "photo-with-bears.jpg"
	photo.is_published = true;
	photo.views = 0;

	// create a photo metadata
	const metadata = new PhotoMetadata();
	metadata.height = 640;
	metadata.width = 480;
	metadata.compressed = true;
	metadata.comment = "cybershoot";
	metadata.orientation = "portait";
	metadata.photo = photo; // this way we connect them

	// get entity repositories
	const photoRepository = conn.getRepository(Photo);
	const metadataRepository = conn.getRepository(PhotoMetadata);

	// first we should persist a photo
	await photoRepository.persist(photo);

	// photo is saved. Now we need to persist a photo metadata
	await metadataRepository.persist(metadata);

	// done
	console.log("metadata is saved, and relation between metadata and photo is created in the database too");

	await conn.close();
}

async function test_12() {
	const conn = await connect();
	const mr = conn.getRepository(PhotoMetadata);
	const m = new PhotoMetadata();
	m.comment = "lalala";
	m.compressed = false;
	m.height = 480;
	m.orientation = 'h';
	m.width = 480;
	const sm = await mr.persist(m);
	console.log('sm', sm);
	await conn.close();
}

async function test_13() {
	const conn = await connect();
	const mr = conn.getRepository(PhotoMetadata);
	const ms = await mr.find({
		alias: 'metadata',
		innerJoinAndSelect: {
			'photo': 'metadata.photo'
		}
	});
	console.log('find photometadata:', ms);
	await conn.close();
}

async function test_14() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const ps = await pr.find({
		alias: 'photo',
		innerJoinAndSelect: {
			'metadata': 'photo.metadata'
		}
	});
	console.log('find photo:', ps);
	await conn.close();
}

async function test_15() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const photo = await pr.findOne({
		alias: 'photo',
		innerJoinAndSelect: {
			'metadata': 'photo.metadata'
		}
	});
	if (photo) {
		photo.metadata.comment = 'test';
		await pr.persist(photo);
		console.log('photo updated:', photo);
	} else {
		console.error('cannot find any photo');
	}
	await conn.close();
}

async function test_16() {
	const conn = await connect();
	const pr = conn.getRepository(PhotoMetadata);
	const metadata = await pr.findOne({
		alias: 'metadata',
		innerJoinAndSelect: {
			'photo': 'metadata.photo'
		}
	});
	if (metadata) {
		metadata.photo.description = 'test';
		await pr.persist(metadata);
		console.log('metadata updated:', metadata);
	} else {
		console.error('cannot find any metadata');
	}
	await conn.close();
}

// import Photo2 from './entity/photo2';

// async function test_17() {
// 	const conn = await connect();
// 	const pr = conn.getRepository(Photo2);
// 	const photos = await pr.find();
// 	console.log('lslslsls', photos);
// 	await conn.close();
// }

import Author from './entity/author';

async function test_18() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const photo = await pr.findOne();
	if (photo) {
		photo.author = new Author();
		photo.author.name = 'taoqf';
		const ar = conn.getRepository(Author);
		await ar.persist(photo.author);
		await pr.persist(photo);
		console.log('photo added:', photo);
	} else {
		console.error('cannot find any photo');
	}
	await conn.close();
}

async function test_19() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const photo = await pr.findOne({
		alias: 'photo',
		innerJoinAndSelect: {
			'metadata': 'photo.metadata'
		}
	});
	if (photo) {
		photo.author.name = 'tqf';
		await pr.persist(photo);
		console.log('photo updated:', photo);
	} else {
		console.log('cannot find any photo');
	}
	await conn.close();
}

async function test_20() {
	const conn = await connect();
	const photo = new Photo();
	photo.name = "taoqf";
	photo.description = "I am near polar bears";
	photo.file_name = "dddddddddddddd";
	photo.views = 1;
	photo.is_published = true;
	const metadata = new PhotoMetadata();
	metadata.height = 640;
	metadata.width = 480;
	metadata.compressed = true;
	metadata.comment = "cybershoot";
	metadata.orientation = "portait";
	metadata.photo = photo; // this way we connect them
	const author = new Author();
	author.name = 'my photo';
	author.photos = [photo];
	photo.author = author;
	const pr = conn.getRepository(Photo);
	const pmr = conn.getRepository(PhotoMetadata);
	const ar = conn.getRepository(Author);
	await ar.persist(author);
	console.log('author saved:', author);
	await pr.persist(photo);
	console.log('photo saved:', photo);
	await pmr.persist(metadata);
	console.log('photometadata saved:', metadata);
	await conn.close();
}

async function test_21() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const pqb = await pr.createQueryBuilder('photo');
	if (pqb) {
		const qb = await pqb.innerJoinAndSelect('photo.metadata', 'metadata');
		const sql = qb.getSql();
		console.log('sql:', sql);
		const photos = await qb.getMany();
		console.log('photos', photos);
	} else {
		console.log('cannot build querybuilder.');
	}
	await conn.close();
}

async function test_22() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const pqb = await pr.createQueryBuilder('photo');
	if (pqb) {
		const qb = await pqb.innerJoinAndSelect('photo.author', 'author');
		const sql = qb.getSql();
		console.log('sql:', sql);
		const photos = await qb.getMany();
		console.log('photos', photos);
	} else {
		console.log('cannot build querybuilder.');
	}
	await conn.close();
}

async function test_23() {
	const conn = await connect();
	const ar = conn.getRepository(Author);
	const pqb = await ar.createQueryBuilder('author');
	if (pqb) {
		const qb = await pqb.innerJoinAndSelect('author.photos', 'photos');
		const sql = qb.getSql();
		console.log('sql:', sql);
		const author = await qb.getMany();
		console.log('author', JSON.stringify(author));
	} else {
		console.log('cannot build querybuilder.');
	}
	await conn.close();
}

import Album from './entity/album';

async function test_24() {
	const conn = await connect();
	// 创建两个albums
	const album1 = new Album();
	album1.name = "Bears";

	const album2 = new Album();
	album2.name = "Me";

	// 创建两个photos
	const photo1 = new Photo();
	photo1.name = "Me and Bears";
	photo1.description = "I am near polar bears";
	photo1.file_name = "photo-with-bears.jpg";
	photo1.albums.push(album1);
	photo1.views = 1;
	photo1.is_published = true;

	const photo2 = new Photo();
	photo2.name = "Bears";
	photo2.description = "I am near polar bears";
	photo2.file_name = "photo-with-bears.jpg";
	photo2.albums.push(album2);
	photo2.views = 1;
	photo2.is_published = false;

	// 获取Photo的repository
	const photoRepository = conn.getRepository(Photo);

	// 依次存储photos，由于cascade，albums也同样会自动存起来
	await photoRepository.persist(photo1);
	await photoRepository.persist(photo2);

	console.log("Both photos have been saved");
	await conn.close();
}

async function test_25() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	const qb = pr.createQueryBuilder('photo');
	if (qb) {
		await qb.innerJoinAndSelect('photo.metadata', 'metadata')
			.leftJoinAndSelect('photo.albums', 'albums')
			.where('photo.is_published = true')
			.andWhere(`(photo.name='My' or photo.name='Mishka')`)
			.orderBy('photo.id', 'DESC')
			.setFirstResult(1)
			.setMaxResults(10);
		console.log('sql:', qb.getSql())
		const photos = await qb.getMany();
		console.log('photos:', photos);
	} else {
		console.error('failed create query builder');
	}
	await conn.close();
}

async function test_26() {
	const conn = await connect();
	const pr = conn.getRepository(Photo);
	await pr.transaction(async (r) => {
		const photos = await r.find();
		console.log('r photos', photos);
	});
	await conn.entityManager.transaction(async (e) => {
		const r = e.getRepository(Photo);
		const photos = await r.find();
		console.log('e photos', photos);
	});
	await conn.close();
}

async function test_xx() {
	const conn = await connect();
	await conn.close();
}

async function main() {
	log4js.configure('./log4js.json');
	await test_26();
	process.exit();
}

main();
