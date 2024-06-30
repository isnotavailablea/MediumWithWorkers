import Axios from "axios"

const fetchUser = async (token : string | null) =>{
    try{
        // console.log("Called Here!!")
        if(typeof(token) === null)throw "not good"
        const res = await Axios.get(`https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/blog/${token}/me/get`)
        console.log("fetch User " , res.data.posts)
        if(!res || !res.data || !res.data.posts)throw "null"
        return res.data.posts
    }catch(err){
        // console.log("Failed To Load!")
        throw "this is an error!"
    }
}

const addUser = async (name : string , email : string , password : string) => {
   try{
    const res = await Axios.post("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/user/signup" , {
        name , password , email 
    })
    if(!res){
        return null
    }
    // console.log(res)
    return res.data
   }catch(err){
     throw "Cannot Add User"
   }
}

const loginUser = async (email : string , password : string) =>{
     try{
        const res = await Axios.post("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/user/signin" , {
            email , password
        })
         if(!res){
            return null
         }
        //  console.log(res)
         return res.data
     }catch(err){
        throw "Cannot get User"
     }
    }

const getUsers = async (token :string ) =>{
    try{
        // console.log(token)
        const res = await Axios.get("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/user/find" , {
            params : {
                token 
            }
        })
        // console.log(res)
        if(!res){
            return null
        }
        return res.data.data
    }
    catch(err){
        return null
    }
}

const PostBlog = async (title : string , content : string) => {
    try{
        const res = await Axios.post("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/blog" , {
            token : localStorage.getItem("token"),
            title ,
            content
        })
        if(!res)throw "dims";
        alert("Blog Posted SuccessFully!")
        return;
    }catch(err){
        alert("Unable to Post Blog");
        return;
    }
}

const EditBlog = async (title : string , content : string , blogID : string) => {
    try{
        // const req = {token : localStorage.getItem("token"),
        // title ,
        // content,
        // blogID}
        // // console.log("Edit Blog Func " , req)
        await Axios.put("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/blog" , {
            token : localStorage.getItem("token"),
            title ,
            content,
            blogID
        })
        alert("Blog Edited SuccessFully!")
        return ;
    }catch(err){
        alert("Unable to Edit Blog");
        return;
    }
}

const GetUsers = async () => {
    try{
        const users = await Axios.get("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/user/all")
        console.log("These are Users " , users.data)
        return users.data
    }catch(err){
        alert("Cannot Get Users Currently Please Try Again")
        return
    }
}

const getBulkPosts = async () => {
    try{
        const users = await Axios.get("https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/user/bulk")
        console.log("These are get blk posts  " , users.data)
        return users.data
    }catch(err){
        alert("Cannot Get Blogs Currently Please Try Again")
        return
    }
}

const getUserPosts = async (id : string) => {
    try{
        const users = await Axios.get(`https://my-app.co-b-13-alok-mishra.workers.dev/api/v1/blog/${localStorage.getItem("token")}/${id}`)
        console.log("These are get some users posts  " , users.data)
        return users.data
    }catch(err){
        alert("Cannot Get Blogs Currently Please Try Again")
        return
    }
}

export {
    fetchUser , getUsers , addUser , loginUser , PostBlog , EditBlog , GetUsers , getBulkPosts , getUserPosts
}