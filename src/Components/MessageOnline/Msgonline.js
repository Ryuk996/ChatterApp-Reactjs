import axios from "axios";
import { useEffect, useState } from "react";
import "./msgonline.css";
import env from '../../settings'

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat,conversationID }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

 
  const token = window.localStorage.getItem("firstlogin");

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios(`${env.api}/user/getAlluser`,
      {
          headers: {Authorization: token}
      }
     )
    
      setFriends(res.data);
    };

    getFriends();
  }, []);
   

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);
 

  const handleClick = async (user) => {
   
            const res = await axios.get(
            `${env.api}/api/conversations/find/${currentId}/${user._id}`
          );
          setCurrentChat(res.data);
          
          const duoConvo = res.data;
          
        
        if( duoConvo== null ){
          
          try {
                    const result = await axios.post(
                      `${env.api}/api/conversations/${currentId}/${user._id}`            //sets a New Conversation
                    );
                    
                    
                  } catch (error) {
                    console.log(error)
                  }
                                                                                                //TODO
                    try {
                      const res = await axios.get(
                      `${env.api}/api/conversations/find/${currentId}/${user._id}`       //Open the new Conversation
                    );
                    setCurrentChat(res.data);
                    
                  } catch (err) {
                    console.log(err);
                  }
        }else{
          console.log("2 not done")
        }
}
  
  return (
    <div className="chatOnlineX">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePic
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.firstName}</span>
        </div>
      ))}
    </div>
  );
}