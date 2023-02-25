const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for the user collection
const userSchema = new mongoose.Schema({
    _id: String, // Set the mobileNumber field as the primary key
    firstName: String,
    lastName: String,
    mobileNumber: { type: Number, unique: true }, // Add a unique index to the mobileNumber field
    email: String,
    pin: Number,
  });
  
  userSchema.pre('save', function (next) {
    // Set the mobileNumber field as the _id field
    this._id = this.mobileNumber;
    next();
  });
  
  const User = mongoose.model('User', userSchema);

// Sign up API endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, mobileNumber, email, pin } = req.body;

  // Check if user already exists
  const userExists = await User.exists({ mobileNumber });

  if (userExists) {
    res.status(400).send('User already exists');
  } else {
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      email,
      pin,
    });

    await newUser.save();
    res.send('User created successfully');
  }
});

// Login API endpoint
app.post('/login', async (req, res) => {
  const { mobileNumber, pin } = req.body;

  // Check if user exists
  const user = await User.findOne({ mobileNumber });

  if (!user) {
    res.status(404).send('User not found');
  } else if (user.pin !== pin) {
    res.status(401).send('Invalid PIN');
  } else {
    res.send('Login successful');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));