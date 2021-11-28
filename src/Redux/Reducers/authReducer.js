import ACTIONS from '../Action/'

const initialState = {
    user: [],
    isLogged: false,
    alluser:[]
    // isAdmin: false
}

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case ACTIONS.LOGIN:
            return {
                ...state,
                isLogged: true
            }
        case ACTIONS.GET_USER:
            return {
                ...state,
                user: action.payload.user,
                // isAdmin: action.payload.isAdmin
            }
        case ACTIONS.GET_ALL_USERS:
            return {
                ...state,
                alluser: action.payload.alluser,
            }
        default:
            return state
    }
}

export default authReducer