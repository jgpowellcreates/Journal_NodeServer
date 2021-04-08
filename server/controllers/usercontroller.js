const router = require("express").Router(); // combining 2 lines of code to access Express framework's Router method
const { UserModel } = require("../models");//object deconstructuring to import user model and store it in UserModel var
// convention to use Pascal casing for a model class w/ Sequelize
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const User = require("../models/user"); CAN I DELETE THIS?

router.get("/test", (req, res) => res.send("Hot dang"));

router.post("/register", async (req, res) => { //calling this POST method allows us to send data as an HTTP POST request
//we pass in arg1 - path and 2- async callback function (handler function) that listend for requests that match the specified route and return a match
    let { email, password } = req.body.user;
    // object deconstruction to parse request.
    // req.body middleware by Express. req is the request, body is where data is held
    // user is a property of body while email/password are properties of user

    //try/catch statements are a part of JS that allow a section of code to be attempted
    try {
        const User = await UserModel.create({ //grants access to UserModel variable and .create() sends new instance of the User model to database
            email,
            password: bcrypt.hashSync(password,13)
                //hashSync() takes 2 arguments: 1st is a string - our original PW, 2nd is the # of times we want our 1st argument salted
                    //the encryption algorithm is called a "SALT". the returned value is the "HASH"
        }); //LH side of this object has to match User model
    
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        //once created, this stores the token. We ref our jsonwebtoken dependency
        //sign() method creates token w/ paylaod (data we're sending User ID) & signature (used to encode/decode)
    
       res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
        //.status() let's us add a status code to a response. 201 is the status code 'Created'
        //.json() packages response as json. .send can also send object and arrays
        // but json can convert non-objects into valid JSON while res.send() cannot
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            })
        } else {
            res.status(500).json({
                message: "Failed to register user",
            });
        }
    } //similar to a promise rejection. If the code fails, it throws an exception that we can capture and convey w/ a message
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    
    try {
        let loginUser = await UserModel.findOne({
            where: {   // "where" is an boject in Sequelize that tells the db to look for something that matches its properties
                email: email,
            },
        });

        if (loginUser) {    // seeing if loginUser is true. "null" is not an error, but it's a falsey value

            let passwordComparison = await bcrypt.compare(password, loginUser.password);
                                    //bcrypt.compare can take 4 args, but we use 2: data to compare, data to be compared to (bcrypt does this highly involved process for us)
                                    //When we only use 2 args, it will return a boolean promise that is captured in our variable
            if (passwordComparison) {

                let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
                                                        //system goes outside current file to .env and looks for JWT_SECRET

                res.status(200).json({
                    user: loginUser,
                    message: "Login attempt successful",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect email of password"
            })
        }

    } catch(err) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router; //we export the module!