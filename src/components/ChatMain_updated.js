import React, { useState } from 'react';
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";

function ChatMain() {
  const [isPrivateChat, setIsPrivateChat] = useState(false);
  const [privateRoomName, setPrivateRoomName] = useState('');
  const [privateChatUser, setPrivateChatUser] = useState('');

  const handleStartPrivateChat = (roomName, user) => {
    setIsPrivateChat(true);
    setPrivateRoomName(roomName);
    setPrivateChatUser(user);
  };
  return (
    <main className="columns">
         
      <ChatArea
        isPrivateChat={isPrivateChat}
        privateRoomName={privateRoomName}
        privateChatUser={privateChatUser}
      />
      <ChatSidebar onStartPrivateChat={handleStartPrivateChat} />
    </main>
  );
}

export default ChatMain;
