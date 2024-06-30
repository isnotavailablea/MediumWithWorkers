import { useState } from "react"
import { addUser, loginUser } from "../AuthFunctions"
import { useSetRecoilState } from "recoil"
import { LOGGEDIN, TOKEN } from "../StateStore/UserAuth"

function EntryPoint(){
    const [log , setLog] = useState(false)
    const [fieldVal , setFieldVal] = useState({
        name : "",
        userId : "",
        password : ""
    })
    const setToken = useSetRecoilState(TOKEN)
    const setloggedIn = useSetRecoilState(LOGGEDIN)
    const HandleClick = async () => {
        if(log){
            try{
            const lgin = await loginUser(fieldVal.userId , fieldVal.password)
            if(lgin === null){
                alert("User DoesNot Exist")
                return
            }
            localStorage.setItem("token" , lgin.token)
            setToken(lgin.token)
            setloggedIn(true)
            }catch(err){
                alert("Error While Logging in")
            }
        }
        else{
            // const [lgin , err] = await loginUser(fieldVal.firstName , fieldVal.lastName , fieldVal.userId , fieldVal.password)
            try{
                const lgin = await  addUser(fieldVal.name , fieldVal.userId , fieldVal.password)
                if(lgin === null){
                    alert("Couldnot Create User")
                    return
                }
                localStorage.setItem("token" , lgin.token)
                setToken(lgin.token)
                setloggedIn(true)
                }catch(err){
                    alert("Error While Signing up")
                }
        }
    }
    
    return <div className="bg-blue-100 h-screen w-screen flex  justify-center items-center">
        <div className="bg-white rounded-2xl">
            <div className="grid grid-cols-2">
                <button className="py-3 border-solid border-2 border-sky-500 border-l-0 border-t-0" onClick={()=>setLog(false)}>SignUp</button>
                <button className="py-3 border-solid border-2 border-sky-500 border-r-0 border-t-0" onClick={()=>setLog(true)}>Login</button>
            </div>
            {!log && <div>
                <div className="pl-3 pr-3" >
                <p className="mb-1 ">Name : </p>
                <input type = "text" className="border border-solid border-1 border-sky-300 focus:border-sky-800 outline-0 focus:outline-0 p-1" placeholder={"JOHN"} value={fieldVal.name}  onChange={(e)=>{setFieldVal({...fieldVal , name:e.target.value})}}/>
                </div>
            </div>}
            <div>
            <div className="pl-3 pr-3">
                <p className="mb-1 ">userId : </p>
                <input type = "text" className="border border-solid border-1 border-sky-300 focus:border-sky-800 outline-0 focus:outline-0 p-1" placeholder={"isnotavail"} value={fieldVal.userId} onChange={(e)=>{setFieldVal({...fieldVal , userId:e.target.value})}}/>
                </div>
                <div className="pl-3 pr-3">
                <p className="mb-1 ">Password : </p>
                <input type = "password" className="mb-3 border border-solid border-1 border-sky-300 focus:border-sky-800 outline-0 focus:outline-0 p-1" placeholder={"pwrd"} value={fieldVal.password} onChange={(e)=>{setFieldVal({...fieldVal , password:e.target.value})}}/>
                </div>
            <div className="flex justify-center">
                <button className="p-2 mb-2 bg-blue-500 text-white rounded-md focus:border hover:border-sky-500" onClick={HandleClick}>Submit</button>
            </div>
            </div>
        </div>
    </div>
}
export default EntryPoint