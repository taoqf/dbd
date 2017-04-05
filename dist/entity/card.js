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
const user_1 = require("./user");
const collection_1 = require("./collection");
let Card = class Card {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Card.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Card.prototype, "company", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Card.prototype, "phone", void 0);
__decorate([
    typeorm_1.OneToOne(() => user_1.default, user => user.card),
    typeorm_1.JoinColumn('userid'),
    __metadata("design:type", user_1.default)
], Card.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(type => collection_1.default, collection => collection.card),
    __metadata("design:type", Number)
], Card.prototype, "collection", void 0);
Card = __decorate([
    typeorm_1.Entity()
], Card);
exports.default = Card;
