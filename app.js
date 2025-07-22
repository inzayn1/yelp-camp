if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


console.log(process.env.SECRET)


const express = require ('express')
const path = require('path');
const app = express()
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');




const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const MongoDBStore= require("connect-mongo")(session);
//const dburl=process.env.DB_URL;
const dburl='mongodb://127.0.0.1:27017/yelp-camp';
 mongoose.connect(dburl,);

 const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const Path = require('path');
const campground = require('./models/campground');
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs')
app.set('views', Path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(Path.join(__dirname, 'public')));

const store = new MongoDBStore({
    url:dburl,
    secret:'thisisbetter',
    touchAfter:24*60*60

})
store.on("error",function(e){
    console.log("session error",e)
})

const sessionConfig = {
    store,
    secret:'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
   res.locals.success= req.flash('success');
    res.locals.error = req.flash('error');
   next();

})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'aman@gmail.com', username: 'aman' })
    const newUser = await User.register(user, 'singh');
    res.send(newUser);
});

 app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home')
});



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err ,req, res , next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status( statusCode).render('error', { err });
    
})
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})