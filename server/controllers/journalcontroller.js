const Express = require('express'); //we import the Express framework and store it inside a variable
const router = Express.Router(); // the var gives us access into exp framework -> we can call methods w/ express.methodName()
let validateJWT = require("../middleware/validate-jwt");
const { JournalModel } = require("../models");

//Express.Router() will return a router object = an isolated instance of middleware & routes.
    // think of it asn a mini-application, only capabale of performing middleware/routing functions. An app router is built-in to every expr. app

                //we inject validateJWT as a middleware function in our practice route. It will check for a token for this route
router.get('/practice', validateJWT, (req, res) => {
//method allows us to complete an HTTP GET request w/ 2 arguments:
    // 1st - '/practice' is the path
    // 2nd- anonymous callback fn, sometime called a "handler function". It listens for requests. When it detects a match, it calls the callback function
    res.send('Hey!! This is a practice route!')
});

/*
=======================
    Journal Create
=======================
*/
router.post('/create', validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const { id } = req.user;
    const journalEntry = {  //object and const, so the contents of the var cannot be changed
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=======================
   Get all Journals
=======================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await JournalModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.get('/about', (req, res) => {
    res.send("This is the about route!")
});

/*
=======================
  Get Journals by User
=======================
*/
router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=======================
 Get Journals by Title
=======================
*/
router.get("/:title", async (req, res) => { //this is a dynamic route! We'll substitute :title w/ the title correlated w/ the hournal entry
    const {title} = req.params; //looks at the params returned in the URL and accesses the value w/ the keyword "title"
    try {
        const results = await JournalModel.findAll({
            where: { title: title } //this line is redundant. We could just write "where: {title}"
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=======================
    Update a Journal
=======================
*/
router.put("/update/:entryId", validateJWT, async (req, res) => {  //put replaces whatever is there w/ what we give it. PUT updates
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    console.log("Journal Id --->",journalId);
    console.log("Req params --->",req.params);
    const userId = req.user.id;

    const query = {
        where: {
            id: journalId,
            owner: userId
        }
    };

    const updatedJournal = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json({
            update,
            message: "Update successful!",
            updatedJournal
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
=======================
    Delete a Journal
=======================
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;
 
    try {
        const query = {  //making an object. There IS NOT LOGIC here.
            where: {
                id: journalId,
                owner: ownerId
            }
        };

        let destroyedEntry = await JournalModel.destroy(query); //"destroy" is a sequelize method. It destroys all entries that match the query and returns that
        if (destroyedEntry > 0) {       //since .destroy() returns the num of destroyed items, if it equals 1 it will confirm the deleted entry 
            res.status(200).json({
                message: "Journal Entry Removed",
                ownerId,
                journalId
            });
        } else {
            res.status(500).json({message: "You can't delete that, homie"})
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;
//Here, we export the module for usage outside of the file