//Apps will have several models so we centralize their imports/exports to one location and in a single object

const UserModel = require('./user');
const JournalModel = require('./journal');

module.exports = {UserModel, JournalModel};