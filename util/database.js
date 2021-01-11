const Sequelize = require('sequelize');

const sequelize = new Sequelize('school', 'root', 'medha#12345', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

/*const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'school',
    password: 'medha#12345'
});

module.exports = pool.promise();*/