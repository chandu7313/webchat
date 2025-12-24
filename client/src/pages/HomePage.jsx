import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { useContext } from 'react'
import { ChatContext } from '../../context/ChatContext'
import Dashboard from '../components/Dashboard'

const HomePage = () => {

    const {selectedUser} = useContext(ChatContext)

  return (
    <div className='w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/50 rounded-3xl overflow-hidden h-[100%] grid grid-cols-1 relative md:grid-cols-[1fr_1fr_1.5fr] xl:grid-cols-[1fr_1.8fr_2.5fr]">
      <Dashboard/>
        <Sidebar />
        <ChatContainer />
        {/* <RightSidebar/> */}
        
      </div>
    </div>
  )
}

export default HomePage
