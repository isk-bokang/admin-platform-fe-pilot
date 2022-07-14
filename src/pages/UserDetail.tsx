import React from "react";
import {useParams} from 'react-router-dom';

function UserDetail() {

  const {userId} = useParams();
  
  console.log(userId);

  return (
    <div>user detail</div>
  )
}

export default UserDetail;