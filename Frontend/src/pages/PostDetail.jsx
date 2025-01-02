import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PostService from "../services/post.service";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";
import { format } from "date-fns"; // เพิ่มการนำเข้า
const baseURL = import.meta.env.VITE_PIC_URL;

const Post = () => {
  const [postDetail, setPostDetail] = useState(null);
  const { id } = useParams(); // Get the id from the URL params
  const { user } = useAuthContext(); // Get user data from context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostsById(id); // Fetch post details by id
        if (response.status === 200) {
          setPostDetail(response.data); // Set the fetched post data to state
        }
      } catch (error) {
        Swal.fire({
          title: "Post Detail",
          text: error?.response?.data?.message || error.message,
          icon: "error",
        });
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    Swal.fire({
      title: "Delete",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await PostService.DeleteById(id); // Pass the id of the post to delete
          Swal.fire("Deleted!", "Your post has been deleted.", "success").then(
            () => navigate("/Home") // Redirect to homepage after successful deletion
          );
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error?.response?.data?.message || error.message,
            icon: "error",
          });
        }
      }
    });
  };

  if (!postDetail) {
    return (
      <div className="container mx-auto max-w-3xl mt-20 px-4 text-center">
        <p className="text-xl text-red-500">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="post-page win-h-full min-w-full flex items-center p-4 pt-20 text-center">
      <div className="bg-white p-8 rounded0-bg shadow-lg max-4xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-grey-800">
          {postDetail.title}
        </h1>

        <div className="text-grey-600 mb-4 text-center">
          <time className="block mb-2">
            {format(new Date(postDetail.createdAt), "dd MMMM yyyy HH:mm")}
          </time>
          <div className="author mb-2">
            <span className="text-blue-500">@{postDetail.author.username}</span>
          </div>
        </div>
        {user.id === postDetail.author._id && (
          <div className="edit-row mb-4 text-center flex items-center justify-center gap-2">
            <a href={`/edit/${postDetail._id}`} className="btn btn-warning">
              Edit Post
            </a>
            <button
              className="btn btn-error"
              onClick={handleDelete} // Use the handleDelete function
            >
              Delete Post
            </button>
          </div>
        )}
        <img
          src={`${baseURL}/${postDetail.cover}`}
          alt={postDetail.title}
          className="w-full h-64 object-cover mb-4"
        />
        <div
          className="content text-grey-700"
          dangerouslySetInnerHTML={{ __html: postDetail.content }}
        ></div>
      </div>
    </div>
  );
};

export default Post;
