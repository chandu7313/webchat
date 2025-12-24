import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client"


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
const socketUrl = import.meta.env.VITE_SOCKET_URL || backendUrl;
axios.defaults.baseURL = backendUrl;

// Log for debugging
if (!import.meta.env.VITE_BACKEND_URL) {
    console.warn("VITE_BACKEND_URL not set, using default: http://localhost:5001");
}

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            // If not authenticated yet (401/403), just ignore silently
            console.warn("Auth check failed:", error?.response?.status || error.message);
        }
    }

// Login function to handle user authentication and socket connection

const login = async (state, credentials)=>{
    try {
        const { data } = await axios.post(`/api/auth/${state}`, credentials);
        if (data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"] = data.token;
            setToken(data.token);
            localStorage.setItem("token", data.token)
            toast.success(data.message)
        }else{
            toast.error(data.message || "Operation failed")
        }
    } catch (error) {
        if (error.code === 'ERR_NETWORK' || error.message?.includes('CONNECTION_REFUSED')) {
            toast.error("Cannot connect to server. Make sure the backend is running on http://localhost:5001");
            console.error("Connection error - Backend URL:", backendUrl);
        } else {
            const errorMsg = error?.response?.data?.message || error?.response?.statusText || error?.message || "An error occurred";
            toast.error(errorMsg);
        }
        console.error("Login error:", error.response?.data || error);
    }
}

// Logout function to handle user logout and socket disconnection

    const logout = async () =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully")
        if(socket){
            socket.disconnect();
        }
    }

    // Update profile function to handle user profile updates

    const updateProfile = async (body)=>{
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(socketUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    },[token])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}