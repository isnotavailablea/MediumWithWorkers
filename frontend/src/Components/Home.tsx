import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { UserBlog } from '../StateStore/HomeComp';
import { fetchUser } from '../AuthFunctions';
import { TOKEN } from '../StateStore/UserAuth';
import Header from '../StateStore/Header';
import PostCard from './PostCard';
function Home() {
  const [posts, setPosts] = useRecoilState(UserBlog);
  const token = useRecoilValue(TOKEN);
  const [isLoading, setIsLoading] = React.useState(true);
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const curPosts = await fetchUser(token);
      setPosts(curPosts);
      // console.log("Here " , curPosts);
    } catch (err) {
      // console.error("Unable to Fetch Posts!", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (posts.length === 1 && posts[0].title === "defaultHaiBhai") {
      getPosts();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // {console.log(posts)}
  return (
    <div>
      <Header/>
      <div className='p-5'>
         <PostCard posts = {posts}/>
      </div>
    </div>
  );
}

export default Home;