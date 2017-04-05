"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const photo_meta_data_1 = require("./photo-meta-data");
const author_1 = require("./author");
const album_1 = require("./album");
let Photo = class Photo {
    constructor() {
        this.albums = []; // we initialize array for convinience here
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'uuid'
    }),
    __metadata("design:type", String)
], Photo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 500
    }),
    __metadata("design:type", String)
], Photo.prototype, "name", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], Photo.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Photo.prototype, "file_name", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Photo.prototype, "views", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Photo.prototype, "is_published", void 0);
__decorate([
    typeorm_1.OneToOne(type => photo_meta_data_1.default, photo_metadata => photo_metadata.photo, { cascadeAll: true }),
    __metadata("design:type", photo_meta_data_1.default)
], Photo.prototype, "metadata", void 0);
__decorate([
    typeorm_1.ManyToOne(type => author_1.default, author => author.photos, { cascadeAll: true }),
    __metadata("design:type", author_1.default)
], Photo.prototype, "author", void 0);
__decorate([
    typeorm_1.ManyToMany(type => album_1.default, album => album.photos, {
        cascadeInsert: true,
        cascadeUpdate: true,
    }),
    __metadata("design:type", Array)
], Photo.prototype, "albums", void 0);
Photo = __decorate([
    typeorm_1.Entity()
], Photo);
exports.default = Photo;
