import React, { useState, FormEvent } from 'react'
import Header from '../StateStore/Header'
import { EditBlog, PostBlog, fetchUser } from '../AuthFunctions';
import { UserBlog } from '../StateStore/HomeComp';
import { useSetRecoilState } from 'recoil';

function Create() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const setPosts = useSetRecoilState(UserBlog);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Here you would typically send the new post data to your backend
    try{
        e.preventDefault();
        const res = await PostBlog(title , content);
        const nw = await fetchUser(localStorage.getItem("token"));
        setPosts(nw);
        setTitle('');
        setContent('');
    }
    catch(err){
        console.log("here ")
        return;
    }
    // Reset form fields
    
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-700 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Create