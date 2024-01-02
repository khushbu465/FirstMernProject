const mongoose = require('mongoose');

const db = process.env.DATABASE;
mongoose.connect(db, {
    dbName: "newdatabase",
}).then(() => {
    console.log("mongodb connected successfully!");
}).catch((err) => console.log('mongodb not connected', err));

