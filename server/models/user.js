const { DataTypes } = require('sequelize'); //object destructuring used to extrapolate DataTypes from sequelize dependency. You can see them in use on the email and password keys
const db = require("../db"); //import connection to our database (unlocks methods from the sequelize connection)

const User = db.define("user", { //definition/creation of model. The define() is a sequelize method that mpas model props in a server file to a table in Postgres.
//we pass in string "user" - becomes table title
    email: {    //next arguments are objects and become columns
        type: DataTypes.STRING(100), //defining value for type property in our model means columns MUST be a string
        allowNull: false, //optional, but defaults to true
        unique: true, //optional, cannot have duplicates
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
    },
});

module.exports = User; //export the User Model in order to access it in other files in our application