import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { BiSolidContact } from "react-icons/bi";
import { MdOutlineNotifications } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FiSettings } from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa6";
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";


const dashOptions=[
    { optionName:"CHAT", icon:<IoChatbubbleEllipses/> },
    { optionName:"CONTACTS", icon:<BiSolidContact/> },
    { optionName:"NOTIFICATIONS", icon:<MdOutlineNotifications/> },
    { optionName:"CALENDER", icon:<SlCalender/> },
    { optionName:"SETTINGS", icon:<FiSettings/> },
    { optionName:"LOGOUT", icon:<FaPowerOff/> }
]


const Dashboard = () => {

    const {authUser} = useContext(AuthContext)
    const [selectedOption,setSelectedOption] = useState(dashOptions[0].optionName)
    const navigate = useNavigate()
    console.log(authUser)

    const {logout, onlineUsers} = useContext(AuthContext)

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-50 to-white text-gray-700 w-full h-full relative max-md:hidden border-r border-gray-200">
        <div className='flex justify-between items-center p-4 border-b border-gray-200'>
        <img src={assets.nexusLogo} alt="logo" className='max-w-10 drop-shadow-lg' />
            <div className="relative py-2 group">
                <IoMdMenu className='text-gray-600 hover:text-gray-900 cursor-pointer transition-colors' size={24}/>
                <div className='absolute top-full right-0 z-20 w-40 p-4 rounded-xl bg-white backdrop-blur-xl border border-gray-200 text-gray-700 hidden group-hover:block shadow-2xl'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors'>Edit Profile</p>
                    <hr className="my-2 border-t border-gray-200" />
                    <p onClick={()=> logout()} className='cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors'>Logout</p>
                </div>
            </div>
        </div>
        <div className='flex flex-col justify-center items-center mt-8 mb-6'>
            <div className='relative mb-3'>
                <img src={authUser.profilePic || assets.avatar_icon} alt="" className='w-20 h-20 rounded-full cursor-pointer border-2 border-purple-400 shadow-lg hover:border-purple-500 transition-all'/>
                <div className='absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white'></div>
            </div>
            <h3 className='text-gray-900 font-semibold text-lg'>{authUser.fullName}</h3>
            <p className='text-gray-500 text-xs mt-1'>{authUser.bio || 'No bio yet'}</p>
        </div>
        <div className='flex flex-col gap-2 items-center w-full mt-4 flex-1 px-2'>
            {
                dashOptions.map((option,index)=>(
                    index != 5 && 
                    <div key={index} 
                        onClick={()=>setSelectedOption(option.optionName)}
                        className={`py-3 px-4 flex gap-3 justify-start items-center cursor-pointer w-full rounded-xl transition-all duration-200 ${
                            selectedOption === option.optionName 
                                ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-l-4 border-purple-500 shadow-md" 
                                : "hover:bg-gray-100 text-gray-600 border-l-4 border-transparent"
                        }`}>
                        <span className={selectedOption === option.optionName ? 'text-purple-600' : 'text-gray-500'}>{option.icon}</span>
                        <h2 className='text-sm font-semibold'>{option.optionName}</h2>
                    </div>
                ))
            }
        </div>
        <div className='flex gap-3 justify-start items-center cursor-pointer w-full p-4 mt-auto border-t border-gray-200 hover:bg-red-50 hover:text-red-600 transition-all rounded-t-xl'>
            <span className='text-red-500'>{dashOptions[5].icon}</span>
            <h3 className='text-sm font-semibold'>{dashOptions[5].optionName}</h3>
        </div>
    </div>
  )
}

export default Dashboard