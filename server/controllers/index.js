module.exports = { //Exporting this file a s a module (we are exporting everything as an object)
    journalController: require("./journalController"), //we define a property & the value of this property is the import of the journalcontroller.js file
    userController: require("./usercontroller"),
};
//We're implementing a module formatting system built into Node called "CommonJS"
//This helps us organize our modules (files, routes, dependencies and managing access to the logic)