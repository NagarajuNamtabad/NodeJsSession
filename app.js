const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');    

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();

const myStore = new SequelizeStore({
    db: sequelize,
})

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
//const { Sequelize } = require('sequelize/types');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: myStore
     })
    );

    app.use(csrfProtection);
    app.use(flash());

    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
        next();
    });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(result1 => {
   // console.log(result1);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


