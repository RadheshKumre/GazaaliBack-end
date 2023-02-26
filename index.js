const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const fs = require('fs');
const { uuid } = require('bson');
const cwd = process.cwd()


app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});






// Create a schema for the user collection
const userSchema = new mongoose.Schema({
    userid: { type: String, unique: true }, // Set the mobileNumber field as the primary key
    firstName: String,
    lastName: String,
    mobileNumber: String, // Add a unique index to the mobileNumber field
    email: String,
    notificationTopic : String
  });
  
  userSchema.pre('save', function (next) {
    // Set the mobileNumber field as the _id field
    this.userid = uuid;
    this.userId = uuid;
    next();
  });
  
  const User = mongoose.model('User', userSchema);




// Create a schema for the meet collection
const meetSchema = new mongoose.Schema({
    meetid: String, // Set the mobileNumber field as the primary key
    meetingLink: String,
    owner: String,
    title: String, // Add a unique index to the mobileNumber field
    time: String,
    description : String
  });
  
  meetSchema.pre('save', function (next) {
    // Set the mobileNumber field as the _id field
    this.meetid = uuid;
    this.meetId = uuid;
    next();
  });
  
  const Meet = mongoose.model('Meet', meetSchema);



//meetmap table
const meetmapSchema = new mongoose.Schema({
    mapid: { type: String, unique: true }, // Set the mobileNumber field as the primary key
    userId: String,
    meetId: String
  });

  //operate on maptable
  meetmapSchema.pre('save', function (next) {
    // Set the mobileNumber field as the _id field
    this.meetid = uuid;
    next();
  });

  const Map = mongoose.model('Map', meetmapSchema);





// Sign up API endpoint
app.post('/signup', async (req, res) => {
  const { firstName, lastName, mobileNumber, email, notificationTopic } = req.body;

  // Check if user already exists
  const userExists = await User.exists({ mobileNumber });

  if (userExists) {
    res.status(400).send({"message":'User already exists'});
  }
  else if (mobileNumber.length!==10){
    res.status(400).send({"message":'Mobile Number should be equal to 10 digit!'})
  }
  else {
    const newUser = new User({
      firstName,
      lastName,
      mobileNumber,
      email,
      notificationTopic
    });
    await newUser.save();
    res.send({"message":'User created successfully'});
  }
});

// Login API endpoint
// app.post('/login', async (req, res) => {
//   const { mobileNumber, pin } = req.body;

//   // Check if user exists
//   const user = await User.findOne({ mobileNumber });

//   if (!user) {
//     res.status(404).send('User not found');
//   } else if (user.pin !== pin) {
//     res.status(401).send('Invalid PIN');
//   } else {
//     res.send('Login successful');
//   }
// });


// Edit profile API endpoint
app.put('/edituser/:mobileNumber', async (req, res) => {
    const mobileNumber = req.params.mobileNumber;
    const { firstName, lastName} = req.body;
  
    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
  
    if (!user) {
      res.status(404).send({"message":'User not found'});
    } else {
      // Update the user's information
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
      res.send({"message":'Profile updated successfully'});
    }
});


//get user profile 
app.get('/getuser/:mobileNumber', async (req, res) => {
    const mobileNumber = req.params.mobileNumber;
  
    // Find the user by mobile number
    const user = await User.findOne({ mobileNumber });
  
    if (!user) {
      res.status(404).send({"message":'User not found'});
    } else {
      res.send(user);
    }
});

//meet
app.post('/meet', async (req, res) => {

    const { meetingLink, owner, title, time, description } = req.body;

    const newmeet = new Meet({
        meetingLink,
        owner,
        title,
        time,
        description
    });
    await newmeet.save();
    const meeta = await Meet.findOne({ owner }); 
    let meetId1 =meeta._id
    const user = await User.findOne({ owner }); 
    let userId1 =user._id
    const newMap = new Map({
        // mapid,
        userId:userId1,
        meetId:meetId1
    })
    await newMap.save();
    res.send({"message":'Meeting data successfully'});
  });
 
// //Dashboard
// app.post('/dashboard', async (req, res) => {
//     const { email } = req.body;
  

//     // Find the user by mobile number
//     const user = await User.findOne({ email });
//     let userId = user._id
//     const meta = await Meet.find({userId});
//     // let meetingids = meta.meetId
//     res.send(meta)
// });



  
app.listen(port, () => console.log(`Server running on port ${port}`));
// Read the HTML file
// const html = fs.readFileSync('cwd/Html/index.html', 'utf8');