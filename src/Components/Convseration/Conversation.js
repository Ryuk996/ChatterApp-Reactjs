import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import env from '../../settings'

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState([]);


  useEffect(async() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
    
    const getUser = async () => {
      try {
        const res = await axios(`${env.api}/user/?id=`+ friendId) 

        setUser([...res.data]);
       

      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
 
  const username = user.map((d)=> d.firstName)
  const Dp = user.map((d)=> d.profilePic)
  const Status = user.map((d)=> d.status)
  

  return (
    <>
    <div className="conversation">
      <img
        className="conversationImg"
        src={Dp}
        alt=""
      />
      <div className="infocontainer">
      <span className="conversationName">{username}</span>
      <div className="conversationStatus">{Status}</div>
      </div> 
    </div>
    </>
  );
}