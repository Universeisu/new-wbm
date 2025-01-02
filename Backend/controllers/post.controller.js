const PostModel = require("../models/Post")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.SECRET;

//ค่าคงที่หรือคลลาสพิมพ์ใหญ่
// 
exports.createPost = async (req, res) => {

 //File upload
 const { path } = req.file;
 const author = req.userId;
 const { title, summary, content, } = req.body;
 if (!title || !summary || !content) {
  return res.status(400).json({ message: "All Fields is required" });
 }
 //สร้าง Post
 const postDoc = await PostModel.create({ title, summary, content, cover: path, author });
 res.json(postDoc)
}

exports.getPost = async (req, res) => {
 const post = await PostModel.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20);
 res.json(post);
}

exports.getById = async (req, res) => {
 const { id } = req.params;
 try {
  const postDoc = await PostModel.findById(id).populate("author", ["username"])
  if (!postDoc) {
   res.status(404).send({ message: "Post not found" });
   return;
  }
  res.json(postDoc)
 } catch (error) {
  console.log(error.message);
  res.status(500).send({ message: "something error occurred while getting post details" })
 }
};

// Delete Post
exports.deletePost = async (req, res) => {
 const { id } = req.params;
 const authorId = req.userId;
 try {
  const postDoc = await PostModel.findById(id);

  if (!postDoc) {
   return res.status(404).send({
    message: "Post not found",
   });
  }

  if (authorId !== postDoc.author.toString()) {
   return res.status(403).send({
    message: "You are not authorized to delete this post",
   });
  }

  await PostModel.findByIdAndDelete(id);

  res.status(200).send({
   message: "Post deleted successfully",
  });
 } catch (error) {
  console.error(error.message);
  res.status(500).send({
   message: error.message || "An error occurred while deleting the post",
  });
 }
};

// Update Post
exports.updatePost = async (req, res) => {
 const { id } = req.params;
 const authorId = req.userId;
 if (!id) return res.status(404).json({ message: "Post id is not Provided" });
 try {
  const postDoc = await PostModel.findById(id);
  if (authorId !== postDoc.author.toString()) {
   res.status(403).send({
    message: "You Cannnot update this post",
   });
   return;
  }

  const { title, summary, content } = req.body;
  if (!title || !summary || !content) {
   return res.status(400).json({ message: "All fields are required" });
  }
  postDoc.title = title;
  postDoc.summary = summary;
  postDoc.content = content;
  if (req.file) {
   const { path } = req.file;
   postDoc.cover = path;
  }
  await postDoc.save();
  res.json(postDoc);
 } catch (error) {
  res.status(500).send({
   message:
    error.message || "Somthing error occurrend white updating a post",
  });
 }
};

