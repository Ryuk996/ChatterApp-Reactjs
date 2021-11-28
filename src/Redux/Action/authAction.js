import ACTIONS from './index'
import axios from 'axios'
import env from '../../settings'
export const dispatchLogin = () => {
    return {
        type: ACTIONS.LOGIN
    }
}

export const fetchUser = async (token) => {
    const res = await axios.get(`${env.api}/user/getuser`, {
        headers: {Authorization: token}
    })
    // console.log(res)
    return res
}

export const dispatchGetUser = (res) => {
    return {
        type: ACTIONS.GET_USER,
        payload: {
            user: res.data
            // isAdmin: res.data.role === 1 ? true : false
        }
    }
}
//TODO
export const fetchAllUsers = async (token) => {
    const res = await axios.get(`${env.api}/user/getAllUser`, {
        headers: {Authorization: token}
    })
    // console.log(res)
    return res
}

export const dispatchGetAllUsers = (res) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload:{
            alluser:res.data
        } 
    }
}