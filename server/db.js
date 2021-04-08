const Sequelize = require('sequelize');
//import the sequelize package and create an instance of sequelize with the variable

const sequelize = new Sequelize("postgres://postgres:pgadmin_93@localhost:5432/eleven-journal");
//creating new sequelize object w/ all pertinent data for connecting to a database
    //postgres - identifies database table to connect to
    //user - username to connect to database
    //password - 
    //example.com:5432 - host points to the local port for sequelize
    //dbname - the name we choose in order to idenitfy a specific database

module.exports = sequelize;
    //we export the module