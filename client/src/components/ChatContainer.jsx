import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { PiWarningCircle } from "react-icons/pi";


const ChatContainer = () => {

    const { messages, selectedUser, setSelectedUser, sendMessage, 
        getMessages} = useContext(ChatContext)

    const { authUser, onlineUsers } = useContext(AuthContext)

    const scrollEnd = useRef()

    const [input, setInput] = useState('');

    // Handle sending a message
    const handleSendMessage = async (e)=>{
        e.preventDefault();
        if(input.trim() === "") return null;
        await sendMessage({text: input.trim()});
        setInput("")
    }

    // Handle sending an image
    const handleSendImage = async (e) =>{
        const file = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            toast.error("select an image file")
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async ()=>{
            await sendMessage({image: reader.result})
            e.target.value = ""
        }
        reader.readAsDataURL(file)
    }

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])

    useEffect(()=>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({ behavior: "smooth"})
        }
    },[messages])

  return selectedUser ? (
    <div className='h-full overflow-hidden relative bg-gradient-to-b from-gray-50 to-white flex flex-col'>
      {/* ------- header ------- */}
      <div className='flex items-center gap-3 py-4 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
        <div className='relative'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"/>
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className='flex-1'>
          <p className='text-lg text-gray-900 font-semibold flex items-center gap-2'>
              {selectedUser.fullName}
          </p>
          <p className='text-xs text-gray-500'>{onlineUsers.includes(selectedUser._id) ? 'Active now' : 'Offline'}</p>
        </div>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer hover:opacity-70 transition-opacity'/>
        <PiWarningCircle size={23} className='text-gray-400 hover:text-gray-600 cursor-pointer transition-colors'/>
      </div>
      {/* ------- chat area ------- */}
      <div className='flex-1 flex flex-col overflow-y-scroll p-4 pb-6 gap-4 custom-scrollbar bg-gray-50/50'>
        {messages.map((msg, index)=>(
            <div key={index} className={`flex items-end gap-3 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}>
                {msg.senderId !== authUser._id && (
                  <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full border-2 border-gray-300 object-cover flex-shrink-0' />
                )}
                <div className={`flex flex-col max-w-[70%] ${msg.senderId === authUser._id ? 'items-end' : 'items-start'}`}>
                  {msg.image ? (
                      <img src={msg.image} alt="" className='max-w-[280px] rounded-2xl overflow-hidden shadow-lg border border-gray-200'/>
                  ):(
                      <p className={`px-4 py-2 rounded-2xl break-words shadow-md ${
                          msg.senderId === authUser._id 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-md' 
                              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                      }`}>{msg.text}</p>
                  )}
                  <p className={`text-xs text-gray-400 mt-1 px-2 ${msg.senderId === authUser._id ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
                {msg.senderId === authUser._id && (
                  <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full border-2 border-gray-300 object-cover flex-shrink-0' />
                )}
            </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

{/* ------- bottom area ------- */}
    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200'>
        <div className='flex-1 flex items-center bg-white border border-gray-300 px-4 rounded-full shadow-md focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all'>
            <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder="Type a message..." 
            className='flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-gray-700 placeholder-gray-400'/>
            <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
            <label htmlFor="image" className="cursor-pointer flex items-center text-gray-500 hover:text-purple-600 transition-colors">
                <img src={assets.gallery_icon} alt="Upload image" className="w-5 h-5 mr-2"/>
            </label>
        </div>
        <button onClick={handleSendMessage} className='w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg hover:shadow-purple-500/50 hover:scale-110 transition-all cursor-pointer'>
          <img src={assets.send_button} alt="Send" className="w-6 h-6 filter brightness-0 invert" />
        </button>
    </div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-4 text-gray-400 bg-gradient-to-br from-gray-50 to-white max-md:hidden h-full'>
        <div className='bg-gradient-to-br from-purple-100 to-pink-100 backdrop-blur-xl rounded-3xl p-12 border border-purple-200 shadow-2xl'>
          <img src={assets.nexusLogo} className='max-w-40 drop-shadow-2xl' alt="" />
        </div>
        <p className='text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Chat anytime, anywhere</p>
        <p className='text-sm text-gray-500'>Select a conversation to start messaging</p>
    </div>
  )
}

export default ChatContainer
