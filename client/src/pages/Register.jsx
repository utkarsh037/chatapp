import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Register(){

const navigate = useNavigate()

const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
password:""
})

const register = async ()=>{


const res = await axios.post(
  "http://localhost:4000/api/user/register",
  form
)

alert(res.data.message)

navigate("/login")


}

return(


<div style={{padding:"40px"}}>

  <h2>Create Account</h2>

  <input
  placeholder="First name"
  onChange={(e)=>setForm({...form,firstName:e.target.value})}
  />

  <br/><br/>

  <input
  placeholder="Last name"
  onChange={(e)=>setForm({...form,lastName:e.target.value})}
  />

  <br/><br/>

  <input
  placeholder="Email"
  onChange={(e)=>setForm({...form,email:e.target.value})}
  />

  <br/><br/>

  <input
  type="password"
  placeholder="Password"
  onChange={(e)=>setForm({...form,password:e.target.value})}
  />

  <br/><br/>

  <button onClick={register}>
    Register
  </button>

</div>


)

}

export default Register
