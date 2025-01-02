import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PostService from "../services/post.service";
import Post from "../component/Post";  // นำเข้า Post คอมโพเนนต์

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await PostService.getPosts();  // ดึงโพสต์จาก API
        if (response.status === 200) {
          setPosts(response.data);  // เก็บโพสต์ที่ได้มาใน state
        }
      } catch (error) {
        Swal.fire({
          title: "Home",
          text: error?.response?.data?.message || error.message,
          icon: "error",
        });
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className='flex flex-col space-y-6'>
        {
          posts.length > 0 && posts.map((post, index) => {
            return <Post key={index} {...post} />
          })
        }
      </div>
    </>
  )
}

export default Home