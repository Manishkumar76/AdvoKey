'use client';
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile(){
const [userData,setUserData]=useState();
    const getUserData =async()=>{
      try {
        const response:any= await axios.get('/api/users/me');
        const data:any= response.data;
        setUserData(data.data._id);
      } catch (error) {
        
      }
    }
        return(
        <div>
            profile Page
            <div>
                <h1>User Details</h1>
                <h3>User ID: <Link href={``}> id</Link></h3>
            </div>
            <button onClick={getUserData} >Get user's Details</button>
        </div>
    );
}