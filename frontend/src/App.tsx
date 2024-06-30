import { useRecoilValue} from 'recoil';
import {  Routes , Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Components/Home';
import EntryPoint from './Components/EntryPoint';
import Create from './Components/Create';
import { LOGGEDIN , TOKEN  } from './StateStore/UserAuth';
import { fetchUser} from "./AuthFunctions"
import { useRecoilState } from "recoil";
import {useNavigate} from "react-router-dom"
import Discover from './Components/Discover';
function App() {
    const token = useRecoilValue(TOKEN)
    const [loggedin , setLoggedin] = useRecoilState(LOGGEDIN)
    const navigate = useNavigate()
    useEffect(() =>{
        // console.log("First Page")
        const getUser = fetchUser(token)
                        .then((res) => {
                            setLoggedin(true)
                            navigate("/Home")
                        })
                        .catch((err) =>{
                            navigate("")
                            console.log("Error While Fetching...")
                        })
    } , [token])
  return ( 
    <>
    <Routes>
        <Route path = "/" element = {<EntryPoint/>}/>
        <Route path="/Home" element = {<Home/>}/>
        <Route path="/Create" element = {<Create/>}/>
        <Route path="/Discover" element= {<Discover/>}/>
      </Routes>
    </>
  )
}

export default App