const express = require('express');
const path = require('path');
const Router = require('./routes/routes');
// const cookie = require('cookie-parser');
// const isLogIn = require('./controllers/auth/isLogIn');
const hbs = require('hbs');
const PORT = process.env.PORT || 8080;

const app = express();

// use static files from 'public'
const publicDirectory = path.join(__dirname, '/public');
app.use(express.static(publicDirectory));

// use hbs
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(__dirname + '/views/partials');

app.use(Router);

app.use((req, res) => {
    res.send('error 404')
});

// start app
const startApp = async () => {
    try {
        app.listen(PORT, () => console.log(`--- App is working`));
    } catch (error) {
        console.log(`--- Connection error: ${error}`);
    }
}

startApp();