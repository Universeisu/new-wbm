const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // เพิ่มการใช้งาน jwt
const UserModel = require("../models/User");
const salt = bcrypt.genSaltSync(10);


exports.register = async (req, res) => {
  const { username, password } = req.body;
  // ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลเข้ามาไหม
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields!",
    });
    return;
  }

  try {
    const hashesPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      password: hashesPassword,
    });
    res.send({
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something went wrong during registration",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบว่าผู้ใช้ได้กรอกข้อมูลเข้ามาไหม 
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide both username and password!",
    });
    return;
  }

  try {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({
        message: "User not found!",
      });
    }

    // เปรียบเทียบรหัสผ่าน
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({
        message: "Invalid Password",
      });
    }

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET, // ใช้ secret key ที่เก็บใน .env
      { expiresIn: "1d" } // กำหนดระยะเวลาให้หมดอายุภายใน 1 วัน
    );

    // ส่ง Token กลับไปพร้อมกับข้อมูลผู้ใช้
    res.send({
      message: "Login Successful!",
      user: {
        id: user._id,
        username: user.username,
      },
      accessToken: token, // ส่ง token ไปพร้อมกับ response
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something went wrong during login",
    });
  }
};
