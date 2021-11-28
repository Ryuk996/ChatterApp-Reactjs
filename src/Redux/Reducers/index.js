import {combineReducers} from 'redux'
import auth from './authReducer'
import token from './tokenReducer'
// import users from './allUserReducer'

export default combineReducers({
    auth,
    token,
    // users
})