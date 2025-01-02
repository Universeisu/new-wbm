const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//วิธีแยก Class พิมพ์ใหญ่ Object พิมพ์เล็ก
const UserSchema = new Schema({
  username: { type: String, require: true, unique: true, min: 4 },
  password: { type: String, require: true },
});

//สร้างModel
const UserModel = model("User", UserSchema);
module.exports = UserModel;
