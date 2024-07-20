const express = require("express");
const dbconnect = require("./config/dbconfig");
const userModel = require("./model/user");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan =require ("morgan"); //This package is used to to , log HTTP requests in a pretty JSON format on console.

app.use(cookieParser());//Extracts the cookie data from the HTTP request and converts it into a usable format that can be accessed by the server-side code.


app.use(morgan("tiny")); //It logs the request information into console with tiny format.   //Whenever we make any http request it will show us on console of VS CODE.

const port = 5300;


app.use(
    cors({
      origin: "http://localhost:5173", //This is front end baseurl
      credentials: true,
    })
  );

  // app.post('/studentdata', async (req, res) => {
  //   const {email} = req.body;
    
  //   const dbstudent=await userModel.findOne({email});
  //   if(dbstudent){
  //     res.send("Student Already exist");
  
  //   }
  //   else{
  //     let data=await userModel(req.body)
  //     console.log(data);
  //     let result=await data.save();
  //     res.status(201).send(result);
  //     console.log("Student Register successfully",result);
  //   }}
  // );

app.use(express.json())

//Post API(create student)
app.post('/studentdata', async (req, res) => {
  const { email } = req.body;

  try {
    const dbstudent = await userModel.findOne({ email });

    if (dbstudent) {
      res.status(400).send("Student Already exists");
    } else {
      const data = new userModel(req.body);
      const result = await data.save();
      res.status(201).send(result);
      console.log("Student Registered successfully", result);
    }
  } catch (error) {
    res.status(500).send("Server error");
    console.error("Error:", error);
  }
});


//GET API

app.get('/getStud', async(req,res)=>{ //URL:localhost:5000/api/getEmp
  let data = await userModel.find();
  res.send(data);
  console.log("data", data);
})

app.get('/getStudent/:_id', async(req,res)=>{ //URL:localhost:5000/api/getEmp
  const {_id} = req.params;
  let data = await userModel.find({_id});
  res.send(data);
  console.log("data", data);
})


//PUT API

app.put('/updateStud/:_id', async(req,res)=>{ //URL:localhost:5000/api/updateEmployee/666971e30061c7a74460f85e
 console.log("update api")
  let data = await userModel.updateOne(req.params, {$set: req.body});
  console.log(data)
  console.log("updated successfully", data)
  res.send(data);
 
})

//DELETE API (Delete Student data)
app.delete("/deleteStud/:_id",async(req,res)=>{
      console.log(req.params);
      let data=await userModel.deleteOne(req.params);
      res.send(data);
})


// app.put("/updateStud/:_id",async(req,res)=>{
//       let data=await userModel.updateOne(req.params,{ $set:req.body});
//       console.log(data)
//       res.send(data);
//   })
  

  
app.listen(port, () => {
  console.log("server is running on port", port);
  dbconnect();
  userModel();
});
// const jwt = require("jsonwebtoken");

// const cookieParser = require("cookie-parser");

// app.use(cookieParser());

// const cors = require("cors");
// const { MaxKey } = require("mongodb");

// localhost:4040/protectedapi // data

// app.use(
//   cors({
//     origin: "http://localhost:3000", //This is front end baseurl
//     credentials: true,
//   })
// );

// cross origin resource sharing

// app.use(express.json()); //built in middleware -it converts string data into json form



// const jwtkey = "pooja2324hfhdghf";



// app.post("/register", async (req, res) => {
//   // let data=await userModel(req.body);
//   // console.log(data);
//   // let result =await data.save();
//   // res.send(result);

//   const { email } = req.body;

//   const dbuser = await userModel.findOne({ email });

//   if (dbuser) {
//     res.send("User is already exist");
//   } else {
//     let data = await userModel(req.body);
//     console.log(data);
//     let result = await data.save();
//     res.send(result);
//   }
// });

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email);

//   try {
//     const dbuser = await userModel.findOne({ email });
//   if (dbuser) {
//     //token generate  // 5000 = 5 seconds

//     const accessToken = jwt.sign({ dbuser }, jwtkey, { expiresIn: 5000 }); //to create a token there are 3 parameters payload,securitykey,expiretime

//     const refreshToken = jwt.sign({ dbuser }, jwtkey, { expiresIn: "1h" });

//     res
//       .status(200)
//       .cookie("accessToken", accessToken, { maxAge: 5000 })

//       .cookie("refreshToken", refreshToken, { maxAge: 600000 })

//       .send({ message: "Login susscessful!!!" });
//   } else {
//     res.status(500).send("email is not registered");
//   }
//   } catch (error) {
//     res.status(900).send("email is not registered");
//   }
  
// });

// //verify token code
// const verifyToken = (req, res, next) => {
//   //verifyToken is a middleware
//   const accessToken = req.cookies.accessToken; //we find out the token from cookies

//   if (!accessToken) {
//     generateRefreshToken(req, res, next);
//     next();
//   }
//   jwt.verify(accessToken, jwtkey, (errr, payload) => {
//     //verify method is used for verify the token //payload -user information or data
//     if (errr) return res.send("you are not authorised");

//     req.dbuser = payload.dbuser;

//     next(); //call next functions  or API's
//   });

//   console.log(accessToken);
// };

// const generateRefreshToken = (req, res, next) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.send({ message: "login Again" });

//   jwt.verify(refreshToken, jwtkey, (err, payload) => {
//     if (err) return res.send({ message: " token invalid" });
//     const dbuser = payload.dbuser;
//     // const accessToken = jwt.sign({dbuser},jwtkey,{expiresIn : 5000});

//     const accessToken = jwt.sign({ dbuser }, jwtkey, { expiresIn: 5000 });

//     res.cookie("accessToken", accessToken, { maxAge: 5000 });

//     console.log("new access Token is generated");
//     next();
//   });
// };

// app.get("/protected", verifyToken, (req, res) => {
//   res.send({
//     user: {
//       name: "Pooja",
//       age: 29,
//     },
//   });
// });

// // app.get("/getdata",async(req,res)=>{

// //     let data= await userModel.find();
// //     res.send(data);
// // })

// // app.delete("/deletedata/:_id",async(req,res)=>{
// //     console.log(req.params);
// //     let data=await userModel.deleteOne(req.params);
// //     res.send(data);
// // })

// // app.put("/updatedata/:_id",async(req,res)=>{
// //     let data=await userModel.updateOne(req.params,{ $set:req.body});
// //     res.send(data);
// // })
