import api from "./api";
import { Cookies } from "react-cookie"; // ใช้ React Cookie เพื่อดึง token
const cookies = new Cookies();
const token = cookies.get("accessToken"); // ดึง token จาก cookie

const API_URL = import.meta.env.VITE_BASE_URL + "/post";

const createPost = async (post) => {
 const response = await api.post(API_URL, post, {
  headers: {
   "Content-Type": "multipart/form-data",
   "x-access-token": token, // ส่ง token ใน headers
  },
 });
 return response;
};

// ฟังก์ชันดึงโพสต์ทั้งหมด
const getPosts = async () => {
 const response = await api.get(API_URL);  // ใช้ GET เพื่อดึงข้อมูลโพสต์
 return response;
};

const getPostsById = async (id) => {
 const response = await api.get(`${API_URL}/${id}`);
 return response;
};
const DeleteById = async (id) => {
 const response = await api.delete(`${API_URL}/${id}`, {
  headers: {
   "x-access-token": token, // ส่ง token ใน headers
  },
 });
 return response;
};

const updatePost = async (id, post) => {
 const response = await api.put(`${API_URL}/${id}`, post, {
  headers: {
   "Content-Type": "multipart/form-data",
   "x-access-token": token, // ส่ง token ใน headers
  },
 });
 return response;
};
const PostService = {
 createPost,
 getPosts,
 getPostsById,
 DeleteById,
 updatePost,
};

export default PostService;
