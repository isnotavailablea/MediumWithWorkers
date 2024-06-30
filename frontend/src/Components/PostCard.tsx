import React, { useState } from 'react';
import { EditBlog, fetchUser } from '../AuthFunctions';
import { useSetRecoilState } from 'recoil';
import { UserBlog } from '../StateStore/HomeComp';
type BlogPost = {
    title: string,
    content: string,
    authorId: string,
    id: string,
    published: boolean
}

type BlogsType = BlogPost[];

interface Props {
    posts: BlogsType;
}

const PostCard: React.FC<Props> = ({ posts }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const setPosts = useSetRecoilState(UserBlog);
    const handleEditClick = (post: BlogPost) => {
        setEditingId(post.id);
        setEditedTitle(post.title);
        setEditedContent(post.content);
    };

    const handleSaveEdit = async (post: BlogPost) => {
        if(editingId === null)return;
        try{
        const res = await EditBlog(editedTitle , editedContent , editingId);
        const nw = await fetchUser(localStorage.getItem("token"))
        setPosts(nw);
        setEditingId(null);
        }catch(err){
            console.log("ok");
            return;
        }
    };

    return (
        <div className='w-full flex justify-center px-4 sm:px-6 lg:px-8'>
            <ul className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <li key={post.id} className='w-full bg-white shadow rounded-lg overflow-hidden'>
                            <div className='p-4'>
                                {editingId === post.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedTitle}
                                            onChange={(e) => setEditedTitle(e.target.value)}
                                            className="w-full mb-2 p-1 border rounded"
                                        />
                                        <textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="w-full mb-2 p-1 border rounded"
                                            rows={3}
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(post)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className='font-bold text-lg mb-2 truncate'>{post.title}</h3>
                                        <p className='text-gray-600 break-words line-clamp-3'>{post.content}</p>
                                        <button
                                            onClick={() => handleEditClick(post)}
                                            className="mt-2 bg-sky-500 font-mono px-2 py-1 rounded hover:bg-indigo-700 hover:text-white"
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))
                ) : (
                    <li className='col-span-full text-center'>No posts available</li>
                )}
            </ul>
        </div>
    );
}

export default PostCard;