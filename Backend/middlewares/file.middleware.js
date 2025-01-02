const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/", // ระบุโฟลเดอร์ที่ใช้จัดเก็บไฟล์
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb); // ตรวจสอบประเภทไฟล์
  },
}).single("file"); // ระบุชื่อ input ที่ใช้ใน form

function checkFileType(file, cb) {
  // ประเภทไฟล์ที่อนุญาต
  const fileType = /jpeg|jpg|png|gif|webp/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileType.test(file.mimetype);

  if (mimeType && extName) {
    cb(null, true); // ไฟล์ผ่านการตรวจสอบ
  } else {
    cb(new Error("Error: Images Only!")); // ไฟล์ไม่ผ่านการตรวจสอบ
  }
}

module.exports = { upload };
