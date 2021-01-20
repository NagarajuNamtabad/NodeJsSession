const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');    

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const Result = require('./models/result');
const User = require('./models/user');

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

    app.use((req, res, next) => {
      //  throw new Error('Sync Dummy');
        if(!req.session.user) {
            return next();
        }

        User.findByPk(req.session.user.id)
        .then( user => {
            if(!user) {
               return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
    });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
   // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', { 
    pageTitle: 'Error!', 
    path: '/500',  
    isAuthenticated: req.isLoggedIn
   });
});

Result.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Result);

sequelize
//.sync({ force: true })
.sync()
.then(result1 => {
   // console.log(result1);
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


