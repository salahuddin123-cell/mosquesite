
import axios from "axios";
import {CloseCircleOutlined} from '@ant-design/icons'
import { useRef, useState } from "react";
import "./login.css";
import LocationOnIcon from '@mui/icons-material/LocationOn';
export default function Login({ setlogin, setCurrentUsername}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("https://mosquelocation.herokuapp.com/login", user);
      setCurrentUsername(res.data.username);
      localStorage.setItem('user', res.data.username);
      console.log('success')
      setlogin(false)
    } catch (err) {
      console.log(err)
      setError(true);
    }
   
  };

  return (
    <div className="loginContainer">
      <div className="logo">
      <LocationOnIcon />
        <span>sskdon</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" required ref={usernameRef} /><br />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
          required
        /> <br />
        <button className="loginBtn" type="submit">
          Login
        </button> <br />
        {error && <span className="failure">Something went wrong!</span>}
      </form>
<a className="loginCancel" onClick={()=> setlogin(false)}><CloseCircleOutlined /></a>
    </div>
  );
}
