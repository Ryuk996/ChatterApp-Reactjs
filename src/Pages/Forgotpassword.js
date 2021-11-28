import React from 'react'
import {useState} from 'react'
import env from "../settings"
import "./Login/login.css";
// import "../App.css";
import axios from 'axios';
import {useHistory, useNavigate} from "react-router-dom"
import {Link} from "react-router-dom"
import {showErrMsg, showSuccessMsg} from '../Notifications/Notification'



function Forgotpassword() {
    const initialState = {
        err: '',
        success: ''
    }
    
    const [user, setUser] = useState(initialState)
    const { err, success} = user
    const [userName, setUsername] = useState("");

    let history = useHistory()
    let handleSubmit = async(e) => {
        e.preventDefault()
        console.log({userName})
        try {
            let forgotData= await axios.post(`${env.api}/user/forgotpwd`,{userName})
            
            setUser({...user, err: '', success: forgotData.data.msg})
            window.localStorage.setItem("app_token",forgotData.data.token)

          
            
        } catch (err) {
            
            err.response.data.msg &&
            setUser({...user, err: err.response.data.msg, success: ''})
        }
    }
    return (
      <>
      <body class="text-center">
            <main class="form-signin">
                <form onSubmit={(e) => {
                        handleSubmit(e);
                    }}>
                    <h3 class=" text-white">Forgot your password</h3>
                    <h6 class=" text-white">enter your EmailID</h6>
                    <div>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                    </div>
                    <br></br>
                    <div class="form-floating">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" value={userName} onChange={e =>setUsername(e.target.value)} />
                        <label for="floatingInput">Email address</label>
                    </div>
                    <br></br>
                    <input class="w-100 btn btn-lg btn-primary" type="submit" value="Verify "/>
                        
                    
                    <p class="mt-5 mb-3 text-muted">&copy; 2017–2021</p>
                </form>
            </main>
        </body>
    </>
    )
}

export default Forgotpassword
