import React from 'react'
import { useState } from 'react'
import env from "../settings"
import "./Login/login.css";

import axios from 'axios';
import {useHistory, useParams} from 'react-router-dom'

import {showErrMsg, showSuccessMsg} from '../Notifications/Notification'


function Resetpassword() {
    const initialState = {
        err: '',
        success: ''
    }
    const {id} = useParams()
    const [user, setUser] = useState(initialState)
    const { err, success} = user
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmpassword] = useState("");
    const history = useHistory()
    let handleSubmit = async(e) => {
        e.preventDefault()
        const isMatch = (password, confirmPassword) => {
            if(password === confirmPassword) return true
            return false
        }
        if(!isMatch(password, confirmPassword))
            return setUser({...user, err: "Password did not match.", success: ''})
            console.log({password,confirmPassword})
        try {
            let resetData = await axios.post(`${env.api}/user/resetpwd`,{password},
            {headers: {Authorization: id}})
            setUser({...user, err: '', success: resetData.data.msg})
            history.push("/login")
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
                    }}
                    >
                        <h3>Reset your password</h3>
                        <h6>enter your new password</h6>
                        <br></br>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        <br></br>
                        <div class="form-floating">
                            <input
                                type="password"
                                class="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password} onChange={e => setPassword(e.target.value)}
                            />
                            <label for="floatingPassword">Password</label>
                        </div>
                        <br></br>
                        <div class="form-floating">
                            <input
                                type="password"
                                class="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={confirmPassword} onChange={e => setConfirmpassword(e.target.value)}
                            />
                            <label for="floatingPassword">Confirm Password</label>
                        </div>
                        <br></br>
                        <input class="w-100 btn btn-lg btn-primary" type="submit" value="Reset"/>
                    </form>
                </main>
            </body>
        </>
    )
}

export default Resetpassword
