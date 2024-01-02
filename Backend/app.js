const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config({ path: './config.env' });
require("./db/db");
app.use(express.json());
port = process.env.PORT;

app.use(require('./router/auth'));
//middleware
const middleware = (req, res, next) => {
    console.log('this is midldeware');
    next();
};

app.get('/', (req, res) => {
    res.send(`hello world from the server`);
});
app.get('/about', middleware, (req, res) => {
    res.send(`hello about `);
});

app.get('/contact', (req, res) => {
    res.cookie("test", 'khushi');
    res.send('hello contacts');
})
app.listen(port, () => {
    console.log(`server is running on port number ${port}`)
})