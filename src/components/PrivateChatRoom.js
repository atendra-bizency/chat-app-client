import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';


function ChatPage(){
  const [isPrivateChat, setIsPrivateChat]= useState(false);
  const [privateRoomName, setPrivateRoomName]= useState('')
  const [privateChatUser, setPrivateChatUser]= useState('')

  const handleStartPrivateChat=(roomName, user)=>{
    setIsPrivateChat(true);
    setPrivateRoomName(roomName);
    setPrivateChatUser(user);
  }

  return (
    <div className="columns">
      <ChatSidebar onStartPrivateChat={handleStartPrivateChat} />
      <ChatArea
        isPrivateChat={isPrivateChat}
        privateRoomName={privateRoomName}
        privateChatUser={privateChatUser}
      />
    </div>
  );
}

export default ChatPage;