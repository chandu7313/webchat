import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate('/');
    }
    
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4'>
      <div className='w-5/6 max-w-3xl bg-white/95 backdrop-blur-xl border border-gray-200 flex items-center justify-between max-sm:flex-col-reverse rounded-2xl shadow-2xl overflow-hidden'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-300 hover:border-purple-500 transition-all group'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <div className='relative'>
              <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon} alt="" className={`w-16 h-16 rounded-full border-2 border-purple-400 object-cover ${selectedImg && 'ring-2 ring-purple-500'}`}/>
              <div className='absolute inset-0 bg-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <span className='text-white text-xs font-semibold'>Change</span>
              </div>
            </div>
            <span className='text-gray-700 group-hover:text-purple-600 transition-colors'>Upload profile image</span>
          </label>
          <div className='space-y-2'>
            <label className='text-gray-700 text-sm font-medium'>Full Name</label>
            <input onChange={(e)=>setName(e.target.value)} value={name}
             type="text" required placeholder='Your name' className='w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 transition-all'/>
          </div>
          <div className='space-y-2'>
            <label className='text-gray-700 text-sm font-medium'>Bio</label>
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write profile bio" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400 resize-none transition-all" rows={4}></textarea>
          </div>

           <button type="submit" className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white p-3 rounded-lg text-lg font-semibold cursor-pointer shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200">Save Changes</button>
        </form>
        <div className='flex flex-col items-center justify-center p-10 bg-gradient-to-br from-purple-100 to-pink-100 border-l border-gray-200 max-sm:border-l-0 max-sm:border-t max-sm:w-full'>
          <img className={`max-w-56 rounded-full aspect-[1/1] object-cover border-4 border-purple-300 shadow-2xl ${selectedImg ? 'ring-4 ring-purple-500' : ''}`} src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.nexusLogo} alt="" />
          <p className='mt-4 text-gray-700 font-medium'>{authUser?.fullName}</p>
        </div>
      </div>
     
    </div>
  )
}

export default ProfilePage
