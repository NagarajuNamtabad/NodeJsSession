const db = require('../util/database');
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
};
