import React, { useEffect, useState } from 'react'
import Header from '../StateStore/Header'
import { useRecoilState } from 'recoil'
import { AllUsers } from '../StateStore/HomeComp';
import { GetUsers, getBulkPosts, getUserPosts } from '../AuthFunctions';

type PostType = {
    id: string,
    title: string,
    content: string,
    authorId: string,
    published: boolean
}



function Discover() {
    const [allUsers, setAllUsers] = useRecoilState(AllUsers);
    const [showDetails , setShowDetails] = useState(false)
    const [ShowTitle , setShowTitle] = useState('')
    const [ShowContent , setShowContent] = useState('')
    const getUsers = async () => {
        try {
            console.log("Here in getusers Small!")
            const res = await GetUsers()
            setAllUsers(res)
        } catch (err) {
            console.log("Some Error Occured While Fethcing all Users")
        }
    }
    const [posts, setPosts] = useState<PostType[]>([])

    const fetchPosts = async (id: string) => {
        try {
            const res = await getUserPosts(id);
            if(res && res.blogs){
                setPosts(res.blogs)
                setShowDetails(false)
            }
        } catch (err) {
            alert("Unable to Fetch Posts!")
        }
    }
    useEffect(() => {
        try {
            getBulkPosts().then((res) => setPosts(res));
        } catch (err) {
            alert("Unable to Fetch Posts!")
        }
    }, [])
    if (allUsers.length <= 0) {
        getUsers()
    }
    return (
        <div>
            <Header />

            <div className='grid grid-cols-12'>
                <div className='col-span-8 bg-red'>
                    {(!posts || posts.length <= 0) ? <div>User Has no Posts</div> :
                        <div>
                           {!showDetails ?  <ul className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
                                {posts.map((post) => (
                                    <li key={post.id} className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
                                        <div className='p-4'>
                                            <>
                                                <h3 className='font-bold text-lg mb-2 truncate'>{post.title}</h3>
                                                <p className='text-gray-600 break-words line-clamp-3'>{post.content}</p>
                                                <button className='font-mono bg-cyan-400 p-1 mt-3' onClick={()=>{
                                                    setShowDetails(!showDetails)
                                                    setShowTitle(post.title)
                                                    setShowContent(post.content)
                                                }}>Read More</button>
                                            </>
                                        </div>
                                    </li>
                                ))
                                }
                            </ul> : 
                                <div>
                                    <div className='font-mono text-5xl text-center mb-2 p-2'>{ShowTitle}</div>
                                    <div className='font-mono break-words px-5'>{ShowContent}</div>
                                </div>
                             }
                        </div>}
                </div>
                {(allUsers.length <= 0) ? <div>Loading...</div> : <div className='col-span-4 text-2xl flex justify-center p-8'>
                    <ul className='h-80 overflow-y-scroll bg-white shadow-2xl rounded-lg'>
                        {allUsers.map(user => {
                            return <li key={user.id}>
                                <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                                    <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={`https://dummyimage.com/300.png/09f/fff&text=${(user.name ? user.name : "A")}`} alt="Woman's Face" />
                                    <div className="text-center space-y-2 sm:text-left">
                                        <div className="space-y-0.5">
                                            <p className="text-lg text-black font-semibold">
                                                {user.name}
                                            </p>
                                            <p className="text-slate-500 text-sm">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" onClick={()=>{fetchPosts(user.id)}}>Explore!</button>
                                    </div>
                                </div>
                            </li>
                        })}
                    </ul>

                </div>}

            </div>
        </div>
    )
}

export default Discover
