
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

 mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

 const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'687d215fd05961d5def04334',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
             title: `${sample(descriptors)} ${sample(places)}`,
             
             description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, cumque.',
             price,
             geometry:{
                type:"Point",
                coordinate:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
             },
             images:[
                 {
      url: 'https://res.cloudinary.com/dzokelbca/image/upload/v1753100595/YelpCamp/sf6mxwbtjejty1vyprsb.jpg',
      filename: 'YelpCamp/sf6mxwbtjejty1vyprsb'
      
    },
    {
      url: 'https://res.cloudinary.com/dzokelbca/image/upload/v1753100595/YelpCamp/lh0dgcmolzxfqb4avmf5.webp',
      filename: 'YelpCamp/lh0dgcmolzxfqb4avmf5'
      
    }
             ]


                    })
        await camp.save();
    }
}
    


seedDB().then(() => {
    mongoose.connection.close();
});