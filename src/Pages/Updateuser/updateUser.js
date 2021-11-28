import React, { useEffect, useRef, useState } from "react"
import axios from "axios";
import { useHistory } from "react-router";
import env from "../../settings"
import "./updateUser.css"
import {showErrMsg, showSuccessMsg} from '../../Notifications/Notification'
import { useSelector } from "react-redux";
import { AddAPhoto, Camera, CameraFront, Home } from "@material-ui/icons";
import { db,storage } from "../../lib/firebase/firebase";
import { addDoc,collection, serverTimestamp } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString  } from "@firebase/storage";
import { Link } from "react-router-dom";
export default function UpdateUser(){

    const token = window.localStorage.getItem("firstlogin");
    const initialState = {
        err: '',
        success: ''
    }
    const [userZ, setUserZ] = useState(initialState)
    const { err, success} = userZ
    const [firstName, setFirstName]=useState(" ");
    const [userName, setUsername]=useState(" ");
    const [profilePic, setProfilePic]=useState(" ");
    const [password, setPassword] = useState("");
    const [status, setStatus]=useState(" ");
     const [confirmPassword, setConfirmpassword] = useState("");
    const[isLoading,setLoading]=useState(false)
    const filePickerRef = useRef(null);
     const[selectedFile,setSelectedFile] = useState(null)
    const history = useHistory();
    const auth = useSelector(state => state.auth)
    const {user, alluser} = auth
    console.log(user)
    
    // let  name = user.map((item) => item.firstName)
    // let  username = user.map((item) => item.userName)
    // let DP = user.map((item)=>item.profilePic)
    // console.log(name)
    useEffect(async()=>{
      try{
        let product = await axios.get(`${env.api}/user/getuserInfo`, {
                        headers: {Authorization: token}
                    })
      setUsername(product.data.userName)             
      setFirstName(product.data.firstName)
      setProfilePic(product.data.profilePic)
      setStatus(product.data.status)
      console.log([product.data])
      }
      catch{
        console.log("error");
      }
    },[])

    //   setUsername(username)             
    //   setFirstName(name)
    //   setProfilePic(DP)
    const addImageToPost = (e) =>{
        setUserZ({...userZ, err: "" , success: ''})
        const reader = new FileReader();
        const file = e.target.files[0]
    
    if(file){
            reader.readAsDataURL(file);
         }
    
    reader.onload = (readerEvent) => {
        setSelectedFile(readerEvent.target.result);
    }
    
    }

    const changeAvatar = async(e) => {
        e.preventDefault()
        setUserZ({...userZ, err: "" , success: ''})
        if(!selectedFile) return setUserZ({...user, err: "No files were uploaded." , success: ''})
    
        const ext = selectedFile.split(':')[1].split(';')[0]                                //getting the file extension
            console.log(ext)
            
        
    if(ext !== 'image/jpeg' && ext !== 'image/png')
        return setUserZ({...userZ, err: "File format is incorrect." , success: ''})
        try {

            if(isLoading) return;

        setLoading(true);
        const docRef= await addDoc(collection(db,'profile'),
        { 
            
            timestamp:serverTimestamp()
        })
        console.log("New doc added with ID",docRef.id)

        const imageRef = ref(storage,`profile/${docRef.id}/image`)
        console.log(imageRef)
        await uploadString(imageRef,selectedFile,'data_url').then (async (snapshot) =>{
            const downloadURL = await getDownloadURL(imageRef);
            await setProfilePic(downloadURL)
        })
        setLoading(false);
        setSelectedFile(null);
        // setSelectedFile([""])

        console.log("success")
            
        } catch (error) {
            setUserZ({...user, err: "retry upload" , success: ''})
            console.log(error)
        }
    }

    const updateInfor = () => {
        try {
             axios.put(`${env.api}/user/updateuser`, {
                firstName: firstName ? firstName : firstName,
                profilePic: profilePic ? profilePic : profilePic,
                status: status ? status : status,
            },{
                headers: {Authorization: token}
            })

            setUserZ({...userZ, err: '' , success: "Updated Success!"})
        } catch (err) {
            setUserZ({...userZ, err: err.response.data.msg , success: ''})
        }
    }
    const updatePassword = async () => {
        const isMatch = (password, confirmPassword) => {
            if(password === confirmPassword) return true
            return false
        }
        if(!isMatch(password, confirmPassword))
            return setUserZ({...userZ, err: "Password did not match.", success: ''})
            console.log({password,confirmPassword})
        try {
            let resetData = await axios.post(`${env.api}/user/resetpwd`,{password},
            {headers: {Authorization: token}})
            setUserZ({...userZ, err: '', success: resetData.data.msg})
        } catch (err) {
            err.response.data.msg &&
            setUserZ({...userZ, err: err.response.data.msg, success: ''})
        }
    }

    const handleUpdate = () => {
        if(firstName || profilePic || status) updateInfor()
        if(password) updatePassword()
    }

    return(
        <div>
      <div className="container">
      <h1 class="TitleZ">Update Profile</h1>
      <div className="FileContentZ">
      
      <br></br>
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        <br></br>
                        <Link to='/drive'><Home className="homebtnZ"></Home></Link>
                        {
                            selectedFile ? (
                                <img src={ selectedFile } className="Dp" onClick={()=> setSelectedFile(null)} alt=""/>
                            ) : (
                                <div onClick={()=> filePickerRef.current.click()} className="">
                            <AddAPhoto className="AddDp" aria-hidden="true"/>
                        </div>
                            )
                        }
                    <div className="profilePicP">
                      { <img className="profilePic" src={ profilePic ? profilePic : profilePic} alt=""/> }
                     <img src="" alt=""/>
                     <span>
                         <i className="fas fa-camera"></i>
                          <input ref={filePickerRef} className="choosefile" hidden type="file" firstName="file" id="file_up" accept="image/*" onChange={addImageToPost} /> 
                     </span> 
                     <button onClick={changeAvatar} className="DpUploadbtn"><CameraFront></CameraFront></button>
                 </div>
                 <div className="form-group">
                 <div  className="col-lg-6">
                <label>Name</label>
                <input type="text" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} className="form-control"></input>
            </div>
                </div>
                <div className="form-group">
                 <div  className="col-lg-6">
                <label>Status</label>
                <textarea type="text" value={status} onChange={(e) => {setStatus(e.target.value)}} className="form-control"></textarea>
            </div>
                </div>
                <div className="form-group">
                 <div  className="col-lg-6">
                 <label htmlFor="email">Email</label>
                    <input type="email" firstName="email" id="email" value={userName} className="form-control"
                    placeholder="Your email address"  disabled />
            </div>
                </div>
                <div className="form-group">
                 <div  className="col-lg-6">
                 <label htmlFor="confirmPassword"> New Password</label>
                    <input type="password" firstName="confirmPassword" id="Password" className="form-control"
                    placeholder="New password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </div>
                </div>
                <div className="form-group">
                <div  className="col-lg-6">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input type="password" firstName="confirmPassword" id="confirmPassword" className="form-control"
                    placeholder="Confirm password" value={confirmPassword} onChange={(e) => {setConfirmpassword(e.target.value)}} />
            </div>
            
            </div>
             <button className="update" onClick={handleUpdate}>Update</button> 
      </div>
    </div> 
    </div>
    // </div>
    )
}


