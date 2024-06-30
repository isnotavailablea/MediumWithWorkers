import { useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil";
import { TOKEN } from "./UserAuth";

function Header() {
  const navigate = useNavigate();
  const setToken = useSetRecoilState(TOKEN)
  return (
    <div className = "flex justify-between p-3 bg-black color-white text-white font-mono">
       <button className="hover:text-sky-700" onClick={() => navigate('/Home')}>Home</button>
       <button className="hover:text-sky-700" onClick={() => {navigate('/Discover')}}>Discover</button>
       <button className="hover:text-sky-700" onClick={() => navigate('/Create')}>Create</button>
       <button className="border border-green-500 p-1 hover:text-sky-700" onClick={()=>{
        localStorage.setItem("token" , "null");
        setToken(null)
        navigate("")
       }}>Logout</button>
    </div>
  )
}

export default Header
