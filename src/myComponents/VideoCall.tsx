import React from "react";
import {useParams} from 'react-router-dom';
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';
const RoomPage=()=>{
    const {RoomId}=useParams();
const MyMeeting= async (element: any)=>{
const AppId=1466923089;
const ServerSecret='550b7c756f95e5419ef56781a390f838'
const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(AppId,ServerSecret,RoomId,'user','kumud')
const zc=ZegoUIKitPrebuilt.create(kitToken);
zc.joinRoom({
    container:element,
    sharedLinks:[{
name:'Copy Link',
URL:`https://localhost:3000/room/${RoomId}`,
scenario:{
    mode:ZegoUIKitPrebuilt.OneONoneCall,
}}]
  
})
}
return(
    <>
    <div>
        <div ref={MyMeeting}/>
    </div>
    </>
)
}