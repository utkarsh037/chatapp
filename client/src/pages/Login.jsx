import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const login = async ()=>{


const res = await axios.post(
  "http://localhost:4000/api/user/login",
  {email,password}
)

localStorage.setItem("token",res.data.token)
localStorage.setItem("user",JSON.stringify(res.data.user))

navigate("/chat")


}

return(


<div style={{padding:"40px"}}>

  <h2>Login</h2>

  <input
  placeholder="Email"
  onChange={(e)=>setEmail(e.target.value)}
  />

  <br/><br/>

  <input
  type="password"
  placeholder="Password"
  onChange={(e)=>setPassword(e.target.value)}
  />

  <br/><br/>

  <button onClick={login}>
    Login
  </button>

</div>


)

}

export default Login
