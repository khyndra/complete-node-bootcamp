const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

//Mongoose is about models (like classes in JS. We will create a model for all CRUD operations)
//Schema - specify and validate our data
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

//Use uppercase in variables and models
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

//testTour is an instance of Tour model so it had methods we can use
//The save method will return a promise
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR:', err);
  });

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
