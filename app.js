const express = require("express");
const cors =require("cors");
const bodyparser = require("body-parser");
const mongodb =require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");

const app = new express();
app.use(cors());
app.use(bodyparser.json());

var db;
mongodb.connect("mongodb+srv://gem-stone:user123@cluster0.nx8o9.mongodb.net/threeInOne?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true},(error,database)=>{
  db = database.db("threeInOne")
  console.log("DB connected")
})

app.post('/register',(req,res)=>{
  req.body._id = new Date().getTime();
  db.collection("users").insertOne(req.body,(error,data)=>{
    if(error){
      res.status(401).json("You Have some insert querry")
    }else{
      res.json("Registered Successfully")
    }
  })
});

app.post("/login",(req,res)=>{
  //res.json("User logged in");
  console.log(req.body);
  var inputLoginDetail = req.body
  var loginCheck = {
    'username': inputLoginDetail.loginUsername,
    'password': inputLoginDetail.loginPassword
  }
  db.collection("users").find(loginCheck, {projection:{_id:1 , username:1}}).toArray((error,data)=>{
    if(error){
      res.status(401).json("Error in Authention")
    }else{
      var token;
      if(data.length > 0){
        token = jwt.sign(data[0],'myKey')
      }else{
        token = ''
      }
      res.json(token)
    }
  })
})
var loggedUser;
function verifyUser(req,res,next){
  console.log(req.headers)
  /* var token = req.headers.myAuthKey;
  if(!token){
    return res.status(401).json("token are not found");
  }
  jwt.verify(req.headers.myAuthKey,"myKey",(error,data)=>{
    if(error){
      return res.status(401).json("token invalid")
    }
    loggedUser = data;
  }) */
  next();
}

app.get("/home", (req,res)=>{
  console.log(req);
  res.json("Your are in Home")
})

module.exports = app;
