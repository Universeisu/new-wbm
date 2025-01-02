import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
import TokenService from "../services/token.service";
console.log("baseURL:", baseURL);
const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json", // ต้องสะกดให้ถูกต้อง
  },
});

instance.interceptors.request.use((config) => {
  const token = TokenService.getLocalAccessToken(); // ดึง token จาก TokenService
  if (token) {
    config.headers["x-access-token"] = token; // เพิ่ม token ใน header
  }
  return config;
});

export default instance;
