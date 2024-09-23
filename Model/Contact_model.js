const connection = require('../Model/db_Mysql.js'); // Your MySQL connection

class contactModel  {
  static createContact (contactData, callback) {
    const query = `
      INSERT INTO contacts (name, phone, email, subject, details)
      VALUES (?, ?, ?, ?, ?)
    `;
    connection.query(query, contactData, callback);
  }

  static getContacts (id, callback) {
    let query = 'SELECT * FROM contacts';
    const queryParams = [];

    if (id) {
      query += ' WHERE id = ?';
      queryParams.push(id);
    }

    connection.query(query, queryParams, callback);
  }

  static updateContact (id, contactData, callback) {
    const query = `
      UPDATE contacts
      SET name = ?, phone = ?, email = ?, subject = ?, details = ?
      WHERE id = ?
    `;
    connection.query(query, [...contactData, id], callback);
  }

  static deleteContact (id, callback){
    const query = 'DELETE FROM contacts WHERE id = ?';
    connection.query(query, [id], callback);
  }
};

module.exports = contactModel;
