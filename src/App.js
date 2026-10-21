import { useState } from "react";

const App =()=>{
  const[secret,setSecret] = useState('');
  const handleLogin = async ()=>{
    const response = await fetch("http://localhost:5000/admin/login",{
      method :"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({secret})
    });

    const data = await response.json();
    console.log(data);
    localStorage.setItem("adminToken",data.token);
  }
  return(
    <div>
      <input
      //type="password"
      value={secret}
      onChange={(e)=>setSecret(e.target.value)}
      placeholder="Enter Secret"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default App;