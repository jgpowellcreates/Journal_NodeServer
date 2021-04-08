module.exports = (req, res, next) => {
    res.header("access-control-allow-origin","*")
    res.header("access-control-allow-methods","GET, POST, PUT, DELETE");
    res.header("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    next();
};

//req refers to the request from the client - focusing on any headers present on req object
//res refers to response and will be used to present which types of headers are allowed by server

//-allow-origin tells server specific origins that can communicate w/ server. * is a wild-card. Everything is allowed
//-methods we are only allowing 4 of HTTP's 15 methods
//-headers are the specific header types that the server will accept from the client

//next() tells the middleware to continue its process.
//here, it takes the req object and passes it on to the endpoint on the server
// without next(), the app would break because the server wouldn't know what to do after sending the header