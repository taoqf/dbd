import * as log4js from 'log4js';
import * as Sequelize from 'sequelize';


function test1() {
	// const sequelize = new Sequelize('my_db', 'test', 'test', {
	// 	host: '127.0.0.1',
	// 	port: 15432,
	// 	dialect: 'postgres',
	// 	pool: {
	// 		max: 5,
	// 		min: 0,
	// 		idle: 10000
	// 	},
	// define: {
	// 	timestamps: false // true by default
	// }
	// });
	const sequelize = new Sequelize('postgres://test:test@127.0.0.1:15432/my_db');

	const User1 = sequelize.define('user1', {
		username: Sequelize.STRING,
		birthday: Sequelize.DATE
	});
	User1.findOne().then((row) => {
		console.log('user1', row.get('username'));
	});

	const User2 = sequelize.define('user2', {
		firstName: {
			type: Sequelize.STRING,
			field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
		},
		lastName: {
			type: Sequelize.STRING,
			field: 'last_name'
		}
	}, {
			freezeTableName: true // Model tableName will be the same as the model name
		});
	User2.findOne().then((row) => {
		console.log('user2', row.get('firstName'));
	});

	// sequelize.sync().then(() => {
	// 	return User.create({
	// 		firstName: 'qf',
	// 		lastName: 'tao'
	// 	});
	// 	// return User.create({
	// 	// 	username: 'taoqf',
	// 	// 	birthday: new Date(1983, 7, 8)
	// 	// });
	// }).then((jane: any) => {
	// 	console.log(jane.get({
	// 		plain: true
	// 	}));
	// });
}

function main() {
	log4js.configure('./log4js.json');
	test1();
}

main();
