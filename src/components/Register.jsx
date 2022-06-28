import axios from 'axios'
import React,{useState} from 'react'
import {CloseCircleOutlined} from '@ant-design/icons'
import {EyeInvisibleFilled,EyeFilled} from '@ant-design/icons'
const Register = ({setregister}) => {
    
   
   const [name,setname]=useState('')
   const [email,setemail]=useState('')
   const [success, setsuccess] = useState(false)
   const [err,seterr]=useState(false)
   const [password,setpassword]=useState('')
   const [visible,setvisible]=useState(false)
      
      
       const handleSubmit=(e)=>{
        e.preventDefault();
     const arr={"username":name, "email":email,"password":password}
        axios.post(
        'https://mosquelocation.herokuapp.com/register',
            arr)
            .then(res => {
                if (res.status === 200){
                  alert('user created')
                  setsuccess(true)
                }
               
                else {
                  seterr(true)
                Promise.reject()
               
                }
            })
            .catch(err => alert('Something went wrong'))
     
      
    }

  return (
    <div className='register' >
         
    <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete='off'>
    

      <div class="mb-3">
       
        <input type="text"placeholder='username' class="form-control" name='name' onChange={(e)=>setname(e.target.value)} value={name||''} required />
     
      </div>
      <div class="mb-3">
       
        <input type="text" placeholder='email' class="form-control" name='email' onChange={(e)=>setemail(e.target.value)} value={email||''} required />
     
      </div>
      <div class="mb-3">
       
        <input type={visible?'text':'password'}  placeholder='password'class="form-control" name='npasswordame' onChange={(e)=>setpassword(e.target.value)} value={password||''}  required/>
       {visible?<EyeFilled className='eye'onClick={()=>setvisible(!visible)}/>:<EyeInvisibleFilled className='eye'onClick={()=>setvisible(!visible)}/>} 
      </div>
     
      <button className="btn btn-success" type="submit">
          Register
        </button>

    </form>
    <a className="loginCancel" onClick={()=> setregister(false)}><CloseCircleOutlined /></a>
            </div>
  )
}

export default Register