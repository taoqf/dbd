"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const log4js = require("log4js");
const typeorm_1 = require("typeorm");
const user_1 = require("./entity/user");
const card_1 = require("./entity/card");
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield typeorm_1.createConnection('postgres', '/home/taoqf/git/dbd/ormconfig.json');
    });
}
function test1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(1111);
        const conn = yield connect();
        function add() {
            const user = new user_1.default();
            console.log(222);
            user.name = 'taoqf';
            user.age = 34;
            return user;
        }
        const saved = yield conn.entityManager.persist([add(), add(), add()]);
        console.log('user saved');
        console.log(saved);
        process.exit();
    });
}
function test2() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const em = conn.entityManager;
        const users = yield em.find(user_1.default);
        console.log('users', users);
        const usersAndCount = yield em.findAndCount(user_1.default);
        console.log('usersAndCount', usersAndCount);
        const user = yield em.findOne(user_1.default);
        console.log('user', user);
    });
}
function test3() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const ur = conn.getRepository(user_1.default);
        const users = yield ur.find();
        console.log('users:', users);
        const user1 = yield ur.findOneById(4);
        console.log('user1', user1);
        const user2 = yield ur.find({
            id: 5
        });
        console.log('user2', user2);
    });
}
function test4() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const ur = conn.getRepository(user_1.default);
        yield ur.remove(yield ur.find());
    });
}
function test5() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const user = new user_1.default();
        user.age = 34;
        user.name = 'taoqf';
        const card = new card_1.default();
        card.company = 'friendslink';
        card.phone = '17093759183';
        user.card = card;
        const saved = yield conn.getRepository(card_1.default).persist(card);
        console.log('saved', saved);
        yield conn.getRepository(user_1.default).persist(user);
        console.log('saved user', user);
        yield conn.close();
    });
}
function test6() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const cr = conn.getRepository(card_1.default);
        const card = yield cr.findOne({
            alias: 'card',
            innerJoinAndSelect: {
                user: 'card.user'
            }
        });
        if (card) {
            console.log('card', card);
            const user = card.user;
            console.log('user', user);
        }
        else {
            console.error('cannot find card');
        }
        yield conn.close();
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const ur = conn.getRepository(user_1.default);
        yield ur.remove(yield ur.find());
        console.log('removed');
        const cr = conn.getRepository(card_1.default);
        yield cr.remove(yield cr.find());
        yield conn.close();
        console.log('removed');
    });
}
function test7() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const ur = conn.getRepository(user_1.default);
        const user = yield ur.findOne({
            alias: 'user',
            innerJoinAndSelect: {
                card: 'user.card'
            }
        });
        console.log('user', user);
        yield conn.close();
    });
}
const photo_1 = require("./entity/photo");
function test8() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const photos = yield pr.find();
        console.log('photos:', photos);
        yield conn.close();
    });
}
function test_9() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const photo = new photo_1.default();
        photo.name = "taoqf";
        photo.description = "I am near polar bears";
        photo.file_name = "photo-with-bears.jpg";
        photo.views = 1;
        photo.is_published = true;
        const saved = yield pr.persist(photo);
        console.log('saved photo', saved);
        yield conn.close();
    });
}
function test_10() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const [photos, count] = yield pr.findAndCount({ name: 'taoqf' });
        console.log(photos, count);
        yield conn.close();
    });
}
const photo_meta_data_1 = require("./entity/photo-meta-data");
function test_11() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        // create a photo
        const photo = new photo_1.default();
        photo.name = "only me";
        photo.description = "I am near polar bears";
        photo.file_name = "photo-with-bears.jpg";
        photo.is_published = true;
        photo.views = 0;
        // create a photo metadata
        const metadata = new photo_meta_data_1.default();
        metadata.height = 640;
        metadata.width = 480;
        metadata.compressed = true;
        metadata.comment = "cybershoot";
        metadata.orientation = "portait";
        metadata.photo = photo; // this way we connect them
        // get entity repositories
        const photoRepository = conn.getRepository(photo_1.default);
        const metadataRepository = conn.getRepository(photo_meta_data_1.default);
        // first we should persist a photo
        yield photoRepository.persist(photo);
        // photo is saved. Now we need to persist a photo metadata
        yield metadataRepository.persist(metadata);
        // done
        console.log("metadata is saved, and relation between metadata and photo is created in the database too");
        yield conn.close();
    });
}
function test_12() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const mr = conn.getRepository(photo_meta_data_1.default);
        const m = new photo_meta_data_1.default();
        m.comment = "lalala";
        m.compressed = false;
        m.height = 480;
        m.orientation = 'h';
        m.width = 480;
        const sm = yield mr.persist(m);
        console.log('sm', sm);
        yield conn.close();
    });
}
function test_13() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const mr = conn.getRepository(photo_meta_data_1.default);
        const ms = yield mr.find({
            alias: 'metadata',
            innerJoinAndSelect: {
                'photo': 'metadata.photo'
            }
        });
        console.log('find photometadata:', ms);
        yield conn.close();
    });
}
function test_14() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const ps = yield pr.find({
            alias: 'photo',
            innerJoinAndSelect: {
                'metadata': 'photo.metadata'
            }
        });
        console.log('find photo:', ps);
        yield conn.close();
    });
}
function test_15() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const photo = yield pr.findOne({
            alias: 'photo',
            innerJoinAndSelect: {
                'metadata': 'photo.metadata'
            }
        });
        if (photo) {
            photo.metadata.comment = 'test';
            yield pr.persist(photo);
            console.log('photo updated:', photo);
        }
        else {
            console.error('cannot find any photo');
        }
        yield conn.close();
    });
}
function test_16() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_meta_data_1.default);
        const metadata = yield pr.findOne({
            alias: 'metadata',
            innerJoinAndSelect: {
                'photo': 'metadata.photo'
            }
        });
        if (metadata) {
            metadata.photo.description = 'test';
            yield pr.persist(metadata);
            console.log('metadata updated:', metadata);
        }
        else {
            console.error('cannot find any metadata');
        }
        yield conn.close();
    });
}
// import Photo2 from './entity/photo2';
// async function test_17() {
// 	const conn = await connect();
// 	const pr = conn.getRepository(Photo2);
// 	const photos = await pr.find();
// 	console.log('lslslsls', photos);
// 	await conn.close();
// }
const author_1 = require("./entity/author");
function test_18() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const photo = yield pr.findOne();
        if (photo) {
            photo.author = new author_1.default();
            photo.author.name = 'taoqf';
            const ar = conn.getRepository(author_1.default);
            yield ar.persist(photo.author);
            yield pr.persist(photo);
            console.log('photo added:', photo);
        }
        else {
            console.error('cannot find any photo');
        }
        yield conn.close();
    });
}
function test_19() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const photo = yield pr.findOne({
            alias: 'photo',
            innerJoinAndSelect: {
                'metadata': 'photo.metadata'
            }
        });
        if (photo) {
            photo.author.name = 'tqf';
            yield pr.persist(photo);
            console.log('photo updated:', photo);
        }
        else {
            console.log('cannot find any photo');
        }
        yield conn.close();
    });
}
function test_20() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const photo = new photo_1.default();
        photo.name = "taoqf";
        photo.description = "I am near polar bears";
        photo.file_name = "dddddddddddddd";
        photo.views = 1;
        photo.is_published = true;
        const metadata = new photo_meta_data_1.default();
        metadata.height = 640;
        metadata.width = 480;
        metadata.compressed = true;
        metadata.comment = "cybershoot";
        metadata.orientation = "portait";
        metadata.photo = photo; // this way we connect them
        const author = new author_1.default();
        author.name = 'my photo';
        author.photos = [photo];
        photo.author = author;
        const pr = conn.getRepository(photo_1.default);
        const pmr = conn.getRepository(photo_meta_data_1.default);
        const ar = conn.getRepository(author_1.default);
        yield ar.persist(author);
        console.log('author saved:', author);
        yield pr.persist(photo);
        console.log('photo saved:', photo);
        yield pmr.persist(metadata);
        console.log('photometadata saved:', metadata);
        yield conn.close();
    });
}
function test_21() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const pqb = yield pr.createQueryBuilder('photo');
        if (pqb) {
            const qb = yield pqb.innerJoinAndSelect('photo.metadata', 'metadata');
            const sql = qb.getSql();
            console.log('sql:', sql);
            const photos = yield qb.getMany();
            console.log('photos', photos);
        }
        else {
            console.log('cannot build querybuilder.');
        }
        yield conn.close();
    });
}
function test_22() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const pqb = yield pr.createQueryBuilder('photo');
        if (pqb) {
            const qb = yield pqb.innerJoinAndSelect('photo.author', 'author');
            const sql = qb.getSql();
            console.log('sql:', sql);
            const photos = yield qb.getMany();
            console.log('photos', photos);
        }
        else {
            console.log('cannot build querybuilder.');
        }
        yield conn.close();
    });
}
function test_23() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const ar = conn.getRepository(author_1.default);
        const pqb = yield ar.createQueryBuilder('author');
        if (pqb) {
            const qb = yield pqb.innerJoinAndSelect('author.photos', 'photos');
            const sql = qb.getSql();
            console.log('sql:', sql);
            const author = yield qb.getMany();
            console.log('author', JSON.stringify(author));
        }
        else {
            console.log('cannot build querybuilder.');
        }
        yield conn.close();
    });
}
const album_1 = require("./entity/album");
function test_24() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        // 创建两个albums
        const album1 = new album_1.default();
        album1.name = "Bears";
        const album2 = new album_1.default();
        album2.name = "Me";
        // 创建两个photos
        const photo1 = new photo_1.default();
        photo1.name = "Me and Bears";
        photo1.description = "I am near polar bears";
        photo1.file_name = "photo-with-bears.jpg";
        photo1.albums.push(album1);
        photo1.views = 1;
        photo1.is_published = true;
        const photo2 = new photo_1.default();
        photo2.name = "Bears";
        photo2.description = "I am near polar bears";
        photo2.file_name = "photo-with-bears.jpg";
        photo2.albums.push(album2);
        photo2.views = 1;
        photo2.is_published = false;
        // 获取Photo的repository
        const photoRepository = conn.getRepository(photo_1.default);
        // 依次存储photos，由于cascade，albums也同样会自动存起来
        yield photoRepository.persist(photo1);
        yield photoRepository.persist(photo2);
        console.log("Both photos have been saved");
        yield conn.close();
    });
}
function test_25() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        const qb = pr.createQueryBuilder('photo');
        if (qb) {
            yield qb.innerJoinAndSelect('photo.metadata', 'metadata')
                .leftJoinAndSelect('photo.albums', 'albums')
                .where('photo.is_published = true')
                .andWhere(`(photo.name='My' or photo.name='Mishka')`)
                .orderBy('photo.id', 'DESC')
                .setFirstResult(1)
                .setMaxResults(10);
            console.log('sql:', qb.getSql());
            const photos = yield qb.getMany();
            console.log('photos:', photos);
        }
        else {
            console.error('failed create query builder');
        }
        yield conn.close();
    });
}
function test_26() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        const pr = conn.getRepository(photo_1.default);
        yield pr.transaction((r) => __awaiter(this, void 0, void 0, function* () {
            const photos = yield r.find();
            console.log('r photos', photos);
        }));
        yield conn.entityManager.transaction((e) => __awaiter(this, void 0, void 0, function* () {
            const r = e.getRepository(photo_1.default);
            const photos = yield r.find();
            console.log('e photos', photos);
        }));
        yield conn.close();
    });
}
function test_xx() {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield connect();
        yield conn.close();
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        log4js.configure('./log4js.json');
        yield test_26();
        process.exit();
    });
}
main();
