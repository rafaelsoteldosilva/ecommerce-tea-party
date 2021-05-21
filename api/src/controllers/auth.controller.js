const server = require("express").Router();
const Sequelize = require("sequelize");
const op = Sequelize.Op;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const bcrypt = require("bcryptjs");
const {
  // Product,
  // Category,
  // Ingredient,
  // Store,
  // Order,
  // Image,
  User,
} = require("../db.js");
const passport = require("passport");

const login = async (req, res, next) => {
  console.log(req.body)
  if (req.body.token) {
    const { token } = req.body;
    //console.log("I'm the freaking token", token);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const { given_name, family_name, email, sub } = ticket.getPayload();
    //console.log("payload:", ticket.getPayload());
    //console.log("el email:", email)
    const hashedPassword = bcrypt.hash(sub, 10);
    const [ user ] = await User.findOrCreate({
      defaults: {
        name: given_name,
        surname: family_name,
        admin: false,
        email: email,
        username: email, //el email es unico, mejor ese campo
        password: (await hashedPassword).toString(), //cambiar a null - ver hashSync
      },
      where: {
        email: email,
      },
    });
    console.log("soy el user en login", user)
    res.json({
      msg: "Successfully Authenticated",
      admin: user.dataValues.admin,
      name: user.dataValues.name,
      id: user.dataValues.id,
    });
  } else {
    passport.authenticate("local", { session: true }, (err, user, info) => {
      if (err) throw err;
      //console.log("soy el info", info);
      if (!user) res.status(200).json(info);
      else {
        req.login(user, (err) => {
          if (err) throw err;
          //console.log("enviando", req.user.dataValues);
          res.status(200).json({
            msg: "Successfully Authenticated",
            admin: req.user.dataValues.admin,
            name: req.user.dataValues.name,
            id: req.user.dataValues.id,
          });
        });
      }
    })(req, res, next);
  }
};

const logout = async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.sendStatus(200);
  }
  res.status(200).send("Hice Logout");
};

const me = async (req, res, next) => {
  const usernameUser = req.body.username;
  const user = await User.findOne({
    where: { username: usernameUser },
  });
  if (!user) {
    res.status(400).json({ msg: "El usuario ingresado no existe" });
  } else {
    const data = {
      name: user.name,
      surname: user.surname,
      username: user.username,
      email: user.email,
    };
    res.status(200).json(data);
  }
};

module.exports = {
  login,
  logout,
  me,
};
