import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl p-4'>

      {/* -------- left -------- */}
      <div className='flex flex-col justify-center items-center gap-10'>
        <div className='bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 shadow-2xl'>
          <img src={assets.nexusLogo} alt="" className='w-[min(30vw,250px)] drop-shadow-2xl'/>
        </div>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg'>NEXUSCHAT</h1>
        <p className='text-gray-600 text-center max-w-md'>Connect with friends and family in real-time. Secure, fast, and beautiful.</p>
      </div>

      {/* -------- right -------- */}

      <form onSubmit={onSubmitHandler} className='bg-white/95 backdrop-blur-xl border border-gray-200 p-8 flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-md'>
        <h2 className='font-semibold text-3xl text-gray-900 flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer hover:opacity-70 transition-opacity'/>
          }
         </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
           type="text" className='p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all' placeholder="Full Name" required/>
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required className='p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all'/>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' required className='p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all'/>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
             rows={4} className='p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all resize-none' placeholder='provide a short bio...' required></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-lg cursor-pointer font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" className='accent-purple-600' />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-600 text-center'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-purple-600 cursor-pointer hover:text-purple-700 transition-colors'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600 text-center'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-medium text-purple-600 cursor-pointer hover:text-purple-700 transition-colors'>Click here</span></p>
          )}
        </div>
         
      </form>
    </div>
  )
}

export default LoginPage
