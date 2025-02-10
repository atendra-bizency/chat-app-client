import React, { useEffect, useState } from 'react';
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";

function ChatMain() {

  const [messages, setMessages] = useState([]); // State to manage messages
  const [userId, setUserId] = useState(''); // State to manage messages
  const [isLogin, setIsLogin] = useState(false);

   /*useEffect(() => {
      const storedUser = localStorage.getItem('chatUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);   
        setUserId(user._id);
      }
    }); */

  //console.log(userId,'from chat main');
  

  // Function to update messages
  const handleFetchMessage = (fetchedMessages) => {    
    setMessages(fetchedMessages);
    //console.log(fetchedMessages);
    
  };
  // Function to update messages
  const handleFetchUserId = (fetchedUserId) => {    
    setUserId(fetchedUserId);
  };
  const handleIsLogin = (isLogin) => {    
    setIsLogin(isLogin);
    //console.log(isLogin);
    
  };
  return (
    <main className="columns">
       <ChatArea messages={messages} userId={userId} onFetchIsLogin={handleIsLogin}/> {/* Pass messages to ChatArea */}
       <ChatSidebar onFetchMessage={handleFetchMessage} onFetchUserId={handleFetchUserId} isLogin={isLogin} setIsLogin={setIsLogin}/> {/* Pass function to ChatSidebar */}
    </main>
  );
}

export default ChatMain;
