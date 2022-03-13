const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Book = require("../models/Book");
const User = require("../models/User");

const authenticate = async (req, res, next)=>{
  try {
    // Get the Cookies
    console.log("reached");
    console.log(req.cookies);
    console.log("Printing the jwt = "+req.cookies.jwt);
    const token = req.cookies.jwt;
    if(!token){
      res.status(401).send("No token")
    }else{
      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
      const rootUser = await User.findOne({_id : verifyToken._id, "tokens.token" : token});

      if(!rootUser){
        res.status(401).send("User Not Found")
      }else{
        res.status(200).send("Authorized User")
      }
    }
    next()
  } catch (error) {
    res.status(401).send("Error")
    console.log(error)
  }
}

const login = async (req, res, next) => {
  const { username, password } = req.body;
  let user;
  try {
    user = await User.findOne({ username });
    if (user) {
      // Verify Password
      const isMatch = await bcryptjs.compare(password, user.password);
      // console.log(`isMatch = ${isMatch}`);

      if (isMatch) {
        // Generate Token Which is Define in User Schema
        const token = await user.generateToken();
        res.cookie("usertype", user.usertype)
        res.cookie("jwt", token)
        res.cookie("userid", user.id)
        res.cookie("username", user.username)
        return res.status(200).json({
          "username": user.username,
          "usertype": user.usertype,
          "jwt": token,
          "userid": user.id
        })
      } else {
        return res.status(400).send("Invalid Credentials");
      }
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Server error");
  }
};

const registerUser = async (req, res, next) => {
  const { username, email, name, password } = req.body;
  let user;
  usertype = "user";
  if(req.cookies && req.cookies.usertype === "admin")
    usertype = "employee";
  try {
    user = new User({
      username,
      email,
      name,
      password,
      usertype
    });
    console.log(user);
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(400).send("Server error");
  }
  return res.status(200).send("Registered new user");
};

const getAllUsers = async (req, res, next) => {
  let users;
  usertype = req.cookies.usertype;
  try {
    if(usertype == "admin")
      users = await User.find();
  } catch (err) {
    console.log(err);
    return res.status(400).send("No users found");
  }
  // console.log(users)
  return res.status(200).json({ users });
};

const deleteUser = async (req, res, next) => {
  if(req.cookies.usertype !== "admin"){
    return res.status(400).send("No users found");
  }
  const id = req.params.id;
  let user;
  try {
    await User.findByIdAndRemove(id);
  } catch (err) {
    console.log(err);
    return res.status(404).send("Unable To Delete this user");
  }
  return res.status(200).send("User Successfully Deleted");
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt")
  return res.status(200).send("Logged out")
};

exports.authenticate = authenticate;
exports.login = login;
exports.registerUser = registerUser;
exports.logout = logout;
exports.getAllUsers = getAllUsers
exports.deleteUser = deleteUser
