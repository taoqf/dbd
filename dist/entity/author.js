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
const photo_1 = require("./photo");
let Author = class Author {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'uuid'
    }),
    __metadata("design:type", String)
], Author.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(type => photo_1.default, photo => photo.author) // note: we will create author property in the Photo class below
    ,
    __metadata("design:type", Array)
], Author.prototype, "photos", void 0);
Author = __decorate([
    typeorm_1.Entity()
], Author);
exports.default = Author;
