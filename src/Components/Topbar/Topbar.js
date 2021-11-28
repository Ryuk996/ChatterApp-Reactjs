import "./topbar.css";
import axios from "axios";
import { Search, Person, Chat, Notifications, ExitToAppRounded, People } from "@material-ui/icons";
import env from '../../settings'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import Msgonline from '../MessageOnline/Msgonline'
import Conversation from "../Convseration/Conversation";
import { useState,useEffect } from "react";


export default function Topbar({ onlineUsers, currentId, setCurrentChat,conversationID,conversations }) {

  // const login = () =>{
  //   const auth = useSelector(state => state.auth)
  // const {user, isLogged} = auth
 
  // }
  // console.log(user)
  // console.log(isLogged)
  // const  dp = user.map((item) => item.profilePic)
  // const  userName = user.map((item) => item.firstName)
  const auth = useSelector(state => state.auth)
  const {user, isLogged} = auth
  // console.log(user)
  // console.log(isLogged)
  const  dp = user.map((item) => item.profilePic)
  const  userName = user.map((item) => item.firstName)
  const [isActive, setActive] = useState("false");

 

  
const handleSignIn = () => {
  window.location.href = "/";
}

  const handleToggle = () => {
    setActive(!isActive);
  };

  let handleLogout = async (e) => {
  

  try {
      let logout = await axios.get(`${env.api}/user/logout`)
      window.localStorage.removeItem('firstlogin')
      window.localStorage.removeItem('userToken')
 
      window.location.href = "/";
      // history.push('/')
  } catch (err) {
      console.log(err)
  }

  }
  
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <a onClick={handleSignIn} style={{ textDecoration: "none" }}>
          { isLogged ? <span className="logo">{userName}</span> : <span className="logo">SignIN</span> }

        </a>
      </div> 
      <div className="topbarCenter"> 
 
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
        <div className="topbarIconItem">
            <ExitToAppRounded onClick={()=>handleLogout()}></ExitToAppRounded >
            <span className="topbarIconBadge">3</span>
          </div>
          <div className="dropdwnOnline">
            <Chat />
            <div className="dropdwnchatOnline"><div className="drpTxt">Online</div>
            
          
            <Msgonline
              conversationID={conversationID}
              onlineUsers={onlineUsers}
              currentId={currentId}
              setCurrentChat={setCurrentChat}
            />
         
        </div>
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <People onClick={handleToggle} />
            
            <span className="topbarIconBadge">1</span>
          </div>
          <div className={isActive ? "noone" : "sidenavChat"}>Friends
          {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={currentId} />
              </div>
            ))} 
  
            </div>
        </div>
        <Link to={'/updateUser'}>
          {isLogged ? <img src={dp} alt="" className="topbarImg"/> : <></>}
          
        </Link>
      </div>
    </div>
  );
}
// {"https://png.pngtree.com/background/20210716/original/pngtree-bloodship-angel-devil-background-picture-image_1375374.jpg"