const db = require("../DB_Models/index");
const Users = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./../.env" });
exports.create = (req, res) => {
  console.log("Request body==========>", req.body);
  const user_name = req.body.user_name;
  console.log("User_name", Users.findByPk(user_name));
  Users.findByPk(user_name).then((user) => {
    if (user) {
      let error = "User_name Exists in Database.";
      return res.status(400).json({ error });
    } else {
      const newUser = {
        user_name: req.body.name,
        password: req.body.password,
        // user_id: req.body.userId,
        department: "dept",
        branch: "branch",
        role: req.body.userType,
        email_id: req.body.email,
        role_type: req.body.selectedRole,
        location: req.body.geo.label,
      };
      console.log("new user =======>", newUser);
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          Users.create(newUser)
            .then((user) => {
              console.log("user======>", user);
              res.status(200).json(user);
            })
            .catch((err) => res.status(400).json(err));
        });
      });
    }
  });
  // const user = {
  //     user_name: req.body.user_name,
  //     password: req.body.password

  // }

  // Users.create(user).then(data => {

  //     res.send(data)
  // }).catch((err) => {
  //     res.status(500).send({
  //         message:
  //             err.message || "Some error occurred while creating the User."
  //     })
  // }

  // )
};
// exports.getCount = (req, res) => {
//     console.log("Request body==========>",req.body)
//     const user_name = req.body.user_name
//     Users.findByPk(user_name)
//         .then(user => {

//             if (user) {
//                 let error = 'User_name Exists in Database.';
//                 return res.status(400).json({ error });
//             } else {
//                 console.log("Else part =============>")
//                 const newUser = {

//                     user_name: req.body.user_name,
//                     password: req.body.password,
//                     user_id:req.body.user_id,
//                     department:req.body.department,
//                     role:req.body.role
//                 }
//                 bcrypt.genSalt(10, (err, salt) => {
//                     if (err) throw err;
//                     bcrypt.hash(newUser.password, salt,
//                         (err, hash) => {
//                             if (err) throw err;
//                             newUser.password = hash;
//                             Users.create(newUser).then(user => res.json(user))
//                                 .catch(err => res.status(400).json(err));
//                         });
//                 });
//             }
//         });

// }

exports.findUsers = (req, res) => {
  Users.findAll()
    .then((users) => {
      res.send(users);
      console.log("Users ===========>", users); // Array of user objects
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Users",
      });
    });
};

exports.getByRole = (req, res) => {
  Users.findAll({
    where: {
      role: "user,admin",
    },
  })
    .then((dnsData) => {
      console.log("DNS DATA LENGTH=====>", dnsData);
      res.json(dnsData);
    })
    .catch((err) => res.status(400).json(err));
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then((data) => {
      if (data) {
        console.log("Data values ============>", data);
        res.send(data);
      } else {
        res.status(404).send({
          message: `User not found with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

exports.login = async (req, res) => {
  console.log("reqqqqqqqqq", req.body);
  const user_name = req.body.user_name;
  const password = req.body.password;
  const user = await Users.findOne({
    where: {
      email_id: user_name,
    },
  });
  console.log("userValue======>", user);
  if (!user) {
    errors.user_name = "No Account Found";
    return res.status(404).json(errors);
  }
  // Users.findByPk(user_name)
  //     .then(user => {
  //         if (!user) {
  //             errors.user_name = "No Account Found";
  //             return res.status(404).json(errors);
  //         }
  else {
    console.log("userValues====>", user);
    res.json(user);
  }

  // bcrypt.compare(password, user.password)
  //     .then(isMatch => {
  //         if (isMatch) {
  //             const payload = {
  //                 user_name: user.user_name
  //             };
  //             jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 },
  //                 (err, token) => {
  //                     if (err) res.status(500)
  //                         .json({
  //                             error: "Error signing token",
  //                             raw: err
  //                         });
  //                     res.json({
  //                         success: true,
  //                         token: `Bearer ${token}`
  //                     });
  //                 });
  //         } else {
  //             errors.password = "Password is incorrect";
  //             res.status(400).json(errors);
  //         }
  //     });
};
