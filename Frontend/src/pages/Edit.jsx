import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ใช้เพื่อดึง id จาก URL
import Editor from "../component/Editor";
import Swal from "sweetalert2";
import PostService from "../services/post.service";
import { useAuthContext } from "../context/AuthContext";

const Edit = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const { user } = useAuthContext();
  const [content, setContent] = useState("");
  const [postDetail, setPostDetail] = useState({
    title: "",
    summary: "",
    file: null,
    imageUrl: null, // เพิ่มเพื่อเก็บ URL ของรูปภาพปัจจุบัน
  });
  const editorRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostsById(id); // API สำหรับดึงโพสต์
        if (response.status === 200) {
          if (user.id !== response.data.author._id) {
            navigate("/Home");
          }
          setPostDetail({
            ...response.data,
            imageUrl: response.data.imageUrl || null, // ตรวจสอบว่ามีรูปภาพหรือไม่
          });
          setContent(response.data.content);
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || error.message,
          icon: "error",
        });
      }
    };

    fetchPost(); // เรียกใช้งานฟังก์ชัน
  }, [id, navigate, user.id]); // เพิ่ม dependencies ที่จำเป็น

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setPostDetail((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleContentChange = (value) => {
    setPostDetail((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", postDetail.title);
    formData.append("summary", postDetail.summary);
    formData.append("content", postDetail.content);
    if (postDetail.file) {
      formData.append("file", postDetail.file);
    }

    try {
      const response = await PostService.updatePost(id, formData); // API สำหรับอัปเดตโพสต์
      if (response.status === 200) {
        Swal.fire("Success", "Post updated successfully", "success").then(() => {
          navigate("/Home"); // ไปยังหน้า Home หลังจากอัปเดตสำเร็จ
        });
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Post</h2>

      {/* แสดงรูปภาพหน้าปกถ้ามี */}
      {postDetail.imageUrl && (
        <div className="mb-6 text-center">
          <img
            src={postDetail.imageUrl}
            alt="Current cover"
            className="mx-auto w-48 h-48 object-cover rounded-md"
          />
          <p className="mt-2 text-sm text-gray-600">Current cover image</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            value={postDetail.title}
            onChange={handleChange}
            placeholder="Enter the post title"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-lg font-semibold text-gray-700">
            Summary
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            value={postDetail.summary}
            onChange={handleChange}
            placeholder="Enter the post summary"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700">
            Content
          </label>
          <Editor value={postDetail.content} onChange={handleContentChange} ref={editorRef} />
        </div>

        <div>
          <label htmlFor="file" className="block text-lg font-semibold text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="mt-2 p-3 w-full border border-gray-300 rounded-md"
            onChange={handleChange}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
