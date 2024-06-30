import {atom} from "recoil"


type blogsType = {
    title : string,
    content : string,
    authorId : string,
    id : string,
    published : boolean
}[]

const UserBlog = atom<blogsType>({
    key : "userBlog" , 
    default : [{
        title : "defaultHaiBhai",
    content : "string",
    authorId : "",
    id : "string",
    published : false
    }]
})

type User = {
    email : string,
    password : string,
    name : string|null,
    id : string
}

const AllUsers = atom<User[]>({
    key : "allUsers",
    default : []
})


export  {UserBlog , AllUsers}