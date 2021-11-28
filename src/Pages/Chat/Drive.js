
import React from 'react'
import { useState,useEffect,useRef } from 'react'
import { useSelector } from 'react-redux';
import "./chat.css"
import axios from 'axios';
import env from "../../settings"
import Topbar from '../../Components/Topbar/Topbar';
import Conversation from '../../Components/Convseration/Conversation';
import Texts from '../../Components/Texts/Texts'
import Message from "../../Components/Texts/Texts";
import Msgonline from "../../Components/MessageOnline/Msgonline";
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route,Switch,useHistory } from 'react-router-dom';
import Picker from 'emoji-picker-react'
import { Close, EmojiEmotions, InsertEmoticonOutlined, Send } from '@material-ui/icons';


function Drive() {
    const userID = window.localStorage.getItem("userToken");
    const token = window.localStorage.getItem("firstlogin");
    const [userData, setUserData]=useState([])
    const [convo,setConvoId] = useState([])
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const socket = useRef();
    const scrollRef = useRef();
    const auth = useSelector(state => state.auth)
    const {user, alluser} = auth

    let  userId = user.map((item) => item._id)

    useEffect(() => {
      
      const getConversations = async () => {
        try {
          const res = await axios.get(`${env.api}/api/conversations/` + userID);
          setConversations(res.data);
       
          setConvoId(res.data)
        } catch (err) {
          console.log(err);
        } 
      };
      getConversations();
    }, [userID]);

    const  conversationID = convo.map((k) => k._id)
    

    //SOCKET_CLIENT
    useEffect(() => {
      socket.current = io(`${env.socket}`)
      socket.current.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }, [])

    useEffect(() => {
      arrivalMessage &&
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);
    
    
    useEffect(async() => {                          //TODO
 
        const res = await axios(`${env.api}/user/getAlluser`,
      {
          headers: {Authorization: token}
      }
     )
    
     const nerds = res.data;
     const  nerdId = nerds.map((item) => item._id)
      
      socket.current.emit("addUser",userID)      //todo
      socket.current.on("getUsers",users =>{
        setOnlineUsers(
          nerdId.filter((f) => users.some((u) => u.userId === f))
        );
        
      })
      
    }, [userID]);                             //TODO
         

        
        if(currentChat!==null){                                                                 //TODO
          const chatPerson = currentChat.members.find((X)=>X !==userID)
         
          var chatPersonInfo = alluser.find((Y)=>Y._id ==chatPerson)
         
        }
       

        useEffect(() => {
          const getMessages = async ()=>{
            try {
              const res = await axios.get(`${env.api}/api/messages/` + currentChat._id)
              setMessages(res.data)
            } catch (error) {
              console.log(error)
            }  
          }
          getMessages();
        }, [currentChat])
        

        const onEmojiClick = (event, emojiObject) => {                                                //todo
          setNewMessage(prevInput => prevInput + emojiObject.emoji);
          setShowPicker(false);
        }

        const handleClose = () =>{
          setCurrentChat(null)
        }

        const handleSubmit = async (e) => {
          e.preventDefault();
          let senderid = userId.toString();
        
          const message = {
            sender: senderid,
            text: newMessage,
            conversationId: currentChat._id,
          };
          
        
          const receiverId = currentChat.members.find(
            (member) => member !== senderid
          );
      
          socket.current.emit("sendMessage", {
            senderId: senderid,
            receiverId,
            text: newMessage,
          });
      
          try {
            const res = await axios.post(`${env.api}/api/messages`, message);
            setMessages([...messages, res.data]);
            setNewMessage("");
          } catch (err) {
            console.log(err);
          }
        };
        useEffect(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages]);

    return (
        <>
          <Topbar conversationID={conversationID}
              conversations={conversations}
              onlineUsers={onlineUsers}
              currentId={userID}
              setCurrentChat={setCurrentChat}></Topbar>
          <div className="messenger">
           
        <div className="chatMenu">
        
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={userID} />
              </div>
            ))}
            
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
              <div className="chatboxinfoZ">
                <img className="chatImg" src={chatPersonInfo?.profilePic}/>
                <div className="chatTxt">{chatPersonInfo?.firstName}</div>
                </div>
                <Close className="closeChat" onClick={handleClose}/>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Texts message={m} own={m.sender == userID} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {setNewMessage(e.target.value)}}
                    value={newMessage}
                  ></textarea><InsertEmoticonOutlined
                  className="emoji-icon"
                  src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                  onClick={() => setShowPicker(val => !val)} />
                {showPicker && <Picker
                  pickerStyle={{ width: '100%' }}
                  onEmojiClick={onEmojiClick} />}
                  
                  <Send className="chatSubmitButton" onClick={handleSubmit}></Send>
                   
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">Online
            <Msgonline
              conversationID={conversationID}
              onlineUsers={onlineUsers}
              currentId={userID}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>          
     
       </>

    )

}

export default Drive
