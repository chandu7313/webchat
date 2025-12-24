import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { IoSearch } from "react-icons/io5";


const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser,
        unseenMessages, setUnseenMessages } = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext)

    const [input, setInput] = useState(false)

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers])

  return (
    <div className={`bg-gray-50/80 backdrop-blur-sm h-full p-4 overflow-y-scroll border-r border-gray-200 ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-4'>
        <div className='bg-white border border-gray-300 rounded-xl flex items-center gap-3 py-3 px-4 shadow-md focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all'>
            <IoSearch className='text-gray-400' size={20}/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-gray-700 text-sm placeholder-gray-400 flex-1' placeholder='Search User...'/>
        </div>
      </div>

    <div className='flex flex-col gap-2 mt-2'>
        {filteredUsers.map((user, index)=>(
            <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=> ({...prev, [user._id]:0}))}}
             key={index} className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedUser?._id === user._id 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 shadow-md' 
                    : 'hover:bg-white border border-transparent'
             }`}>
                <div className='relative'>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-12 h-12 rounded-full border-2 border-gray-300 object-cover'/>
                    {onlineUsers.includes(user._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                </div>
                <div className='flex flex-col flex-1 min-w-0'>
                    <p className='text-gray-900 font-medium text-sm truncate'>{user.fullName}</p>
                    <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-600' : 'text-gray-500'}`}>
                        {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                    </span>
                </div>
                {unseenMessages[user._id] > 0 && (
                    <span className='absolute top-2 right-2 text-xs h-6 w-6 flex justify-center items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg'>
                        {unseenMessages[user._id]}
                    </span>
                )}
            </div>
        ) )}
    </div>

    </div>
  )
}

export default Sidebar
