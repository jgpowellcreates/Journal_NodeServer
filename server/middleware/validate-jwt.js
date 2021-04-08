const jwt = require("jsonwebtoken");    //we'll be interacting w/ the token assigned to each session, so we need to import JWT package
const { UserModel } = require("../models"); //need to find out info on the specific user so we communicate w/ the user model

const validateJWT = async (req, res, next) => {
    try {
        if (req.method == "OPTIONS") { //preflight request (checks info before request)
            next(); //middleware function in express. When called, it passes control to the next middleware function
        } else if (
            req.headers.authorization &&
            req.headers.authorization.includes("Bearer") //looking for data in auth header && the string includes "Bearer" of incoming request
        ){
            const { authorization } = req.headers; //object deconstruct to pull value of auth header and store it
            //console.log("authorization -->", authorization);
            const payload = authorization  //checking if authorization contains a truthy value and returning value to payload
            ? jwt.verify(              //if contains truthy value, we call the JWT packge and invoke verify
                authorization.includes("Bearer") //verify() 1st param is our token (defined on line 11)
                ? authorization.split(" ")[1] //if token includes "Bearer", we extrapolate/return just the token
                : authorization,                
                process.env.JWT_SECRET // verify() 2nd param is the JWT_SECRET in our .env so we can decrypt the token
            )
            : undefined;       //if its' not a truthy value, it returns undefined
                //this conditional will return "payload" w/ either the token (excluding "Bearer") or 'undefined'

            //console.log("payload -->", payload);

            if (payload) {  //checking if payload is truthy
                let foundUser = await UserModel.findOne({ where: {id: payload.id } }); //if true, use Sequelize's findOne to match a UserModel user's ID with the ID stored in the token
                                //it then stores the value of the located user in "foundUser"
                //console.log("foundUser -->", foundUser);
                
                if (foundUser) {  //check if foundUser is truthy
                    //console.log("request -->", req);    
                    req.user = foundUser; //we create a property called "user" in express's request object which stores the located user's email/pw
                                        //we now have access to user email/pw when this middleware function gets invoked
                    next();   //in a middleware function, "next" function simply exits us out of the function
                } else {
                    res.status(400).send({message: "Not Authorized"}); //if code was unable to locate the user in db
                }
            } else {
                res.status(401).send({message: "Invalid token"}); //if payload came back undefined
            }
        } else {
            res.status(403).send({message: "Forbidden - no token provided"}); //auth object in the headers object is empty or does not include "bearer"
        }
    } catch(err) {
        res.status(500).send({message: err})
    }
};

module.exports = validateJWT;