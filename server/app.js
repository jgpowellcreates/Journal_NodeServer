require("dotenv").config(); //this makes items in .env file available to our whole application
const Express = require('express'); //import Express framework and store it in a variable
const app = Express();
const dbConnection = require("./db"); //create a variable that imports the db file

app.use(require('./middleware/headers'));
//headers must come before the routes are declared. It's also high enough in the order to pass value of "Content-Type" into Express.json()

const controllers = require("./controllers"); //we import the controllers as a bundle through the object we exported in index.js and store the var

app.use(Express.json()); //in order to use req.body middleware, we need to use function called .json()
    //Express needs to JSON-ify the request to be able to parse/interpret the body of data being sent in the request
    //THIS STATEMENT MUST GO ABOVE ANY ROUTES or this statement will not be used
app.use("/user", controllers.userController); //use() from Express framework to create route  to usercontroller w/ '/user' as our endpoint

//app.use(require("./middleware/validate-jwt")); //this will check to see if an incoming request has a token
//anything underneath ^^this^^line^^ will require a token to access. It is protected
//however, it will restrict access to EVERYTHING in journal. We don't want that for this example. Go to journalcontroller

app.use("/journal", controllers.journalController); //we create a base URL called /journal
                    //our 2nd parameter passes in 'controllers' object and use (.)notation to access the desired file


dbConnection.authenticate()
    .then(() => dbConnection.sync()) //We use a promise resolver to access the returned promise and call the sync() method that will sync all defined models to the database
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })  //Use the promise resolver to access returned promise / use sync() method to see if we are connected
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    }); //promise rejection fires off an error if there are errors