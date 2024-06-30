import { useRecoilValue, useSetRecoilState} from 'recoil';
import {  Routes , Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Components/Home';
import EntryPoint from './Components/EntryPoint';
import Create from './Components/Create';
import { LOGGEDIN , TOKEN  } from './StateStore/UserAuth';
import { fetchUser} from "./AuthFunctions"
import {useNavigate} from "react-router-dom"
import Discover from './Components/Discover';
function App() {
    const token = useRecoilValue(TOKEN)
    const setLoggedin = useSetRecoilState(LOGGEDIN)
    const navigate = useNavigate()
    useEffect(() =>{
        // console.log("First Page")
         fetchUser(token)
                        .then(() => {
                            setLoggedin(true)
                            navigate("/Home")
                        })
                        .catch(() =>{
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