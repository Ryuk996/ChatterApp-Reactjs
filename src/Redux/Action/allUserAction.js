import ACTIONS from './index'
import axios from 'axios'
import env from '../../settings'

export const fetchAllUsers = async (token) => {
    const res = await axios.get(`${env.api}/user/getAllUsers`, {
        headers: {Authorization: token}
    })
    console.log(res)
    return res
}

export const dispatchGetAllUsers = (res) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: res.data
    }
}