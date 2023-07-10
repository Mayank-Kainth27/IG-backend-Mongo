const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require('bcryptjs');


const config = require('./config/database.json');
const User = require('./database/user_model');
const { default: mongoose } = require('mongoose');

const app = express();
const db = mongoose.connection;
const PORT = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect(config.url);
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.post("/login", async (req,res,next)=> {
    const data = req.body;
    const user = await User.findOne({userName: data.userName});
    if (user) {
        // const hashedPassword = bcrypt.hashSync("key", user.salt, data.password);
        if (bcrypt.compareSync(data.password, user.password)){
            console.log('user logged in')
            res.json({
                ...user,
                redirectTo: '/home',
                message: 'user logged in'
            });
        }else {
            console.log("Username or password incorrect");
            res.json({
                message: "Username or password incorrect"
            });
        }
    } else {
        res.json({
            message:'user not found',
            redirectTo: '/signUp'
        })
    }
})

app.post('/signUp', async (req,res,next) => {
    const data = req.body;
    console.log(data);
    const user = new User({
        number: data.number,
        email: data.email,
        userName: data.username,
        fullName: data.fullname,
        password: data.password,
        salt: data.salt
    })
    await user.save();
    const response = {
        message: 'user created',
        ...user
    }
    res.json(response);
})

app.get('/message', (req,res,next)=> {
    res.json(config.url);
})

app.listen(PORT, ()=>{
    console.log('server is running');
})