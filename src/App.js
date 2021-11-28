import logo from './logo.svg';
import './App.css';
import Login from './Pages/Login/login';
import Register from './Pages/Register';
import Drive from './Pages/Chat/Drive';
import ActivationEmail from './Pages/activateMail';
import {
  BrowserRouter as Router,
  Switch,
  Route, 
  Link
} from "react-router-dom";
import Forgotpassword from './Pages/Forgotpassword';
import Resetpassword from './Pages/Resetpassword';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { dispatchLogin,fetchUser,dispatchGetUser,fetchAllUsers,dispatchGetAllUsers } from './Redux/Action/authAction';
import Home from './Pages/Home/Home';
import UpdateUser from './Pages/Updateuser/updateUser';

function App() {

  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  const loginToken = window.localStorage.getItem("firstlogin");

  useEffect(() => {
    if(loginToken!==""){
      const getToken = async () => {
        dispatch({type: 'GET_TOKEN', payload: loginToken})
        console.log("loggedIN")
      }
      getToken()
    }
  },[auth.isLogged, dispatch])
  
  useEffect(() => {
    if(token){
      const getUser = () => {
        dispatch(dispatchLogin())
        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token, dispatch])

  useEffect(() => {
    if(token){
      const getAllUser = () => {
        return fetchAllUsers(token).then(res =>{
          dispatch(dispatchGetAllUsers(res))
      })
      }
      getAllUser()
    }
  },[token, dispatch])

  return (
    <Router>
    <Switch>
      <Route path="/register" component={Register} exact={true}/>
      <Route path="/user/activate/:activation_token" component={ActivationEmail} exact={true}/>
      <Route path="/user/reset/:id" component={Resetpassword} exact={true}/>
      <Route path="/login" component={Login} exact={true}/>
      <Route path="/forgot_pwd" component={Forgotpassword} exact={true}/>
      <Route path="/drive" component={Drive} exact={true}/>
      <Route path="/updateUser" component={UpdateUser} exact={true}/>
      <Route path="/" component={Home} exact={true}/>
    </Switch>

  </Router>
  );
}

export default App;

