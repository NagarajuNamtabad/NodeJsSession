const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Result = sequelize.define('result', {
   id: {
     type: Sequelize.INTEGER,
     autoIncrement: true,
     allowNull: false,
     primaryKey: true
   },
   examName: {
     type: Sequelize.STRING,
     allowNull: false
   },
   studentName: {
     type: Sequelize.STRING,
     allowNull: false
   },
   english: {
     type: Sequelize.INTEGER,
     allowNull: false
   },
   maths: {
     type: Sequelize.INTEGER,
     allowNull: false
   },
   physics: {
     type: Sequelize.INTEGER,
     allowNull: false
   },
   chemistry: {
     type: Sequelize.INTEGER,
     allowNull: false
   },

   totalmarks: {
    type: Sequelize.STRING,
    allowNull: true
  },
   
});

module.exports = Result;


/* const db = require('../util/database');
const Cart = require('./cart');

module.exports = class Result {
  constructor(id, examName, studentName, english, maths, physics, chemistry) {
    this.id = id;
    this.examName = examName;
    this.studentName = studentName;
    this.english = english;
    this.maths = maths;
    this.physics = physics;
    this.chemistry = chemistry;
  }

  save() {
    return db.execute(
      'INSERT INTO result (examName, studentName, english, maths, physics, chemistry) VALUES (?, ?, ?, ?, ?, ?)',
      [this.examName, this.studentName, this.english, this.maths, this.physics, this.chemistry]
       );
  }

  static fetchAll(){
      return db.execute('SELECT * FROM result');
  }
}; */
