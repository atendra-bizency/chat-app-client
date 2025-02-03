import React from 'react';
import { useEffect, useRef } from 'react';
//import Message from './Message';

function MessageList({ messages , userId}) {
  const ref = useRef(null);

  useEffect(() => {
    const messagelist = ref.current;
    messagelist.scrollTop = messagelist.scrollHeight;
  });

  
  let user
    const storedUser = localStorage.getItem('chatUser');
    
  if (storedUser) {
       user = JSON.parse(storedUser);
  }



  return (
    <div
      ref={ref}
      className="columns is-multiline has-text-black has-background-white-bis messagelist"
      style={{ alignContent: "flex-start" }}
    >
      {messages.length > 0 ? (
        messages.map((message, index) => {
          //console.log(message);
          
          const isCurrentUser = message.sender === user._id; // Check if sender is the current user
          return (
            <div
              key={index}
              className={`column is-12 is-paddingless ${
                isCurrentUser ? " is-clearfix secondary" : "has-text-left primary"
              }`}
            >
              <strong className={`is-block ${
                isCurrentUser ? " has-text-right" : "has-text-left "
              }`} >{message.sender}</strong>
              <div
                className={`text ${
                  isCurrentUser ? " is-pulled-right" : "is-pulled-left "
                }`}
                
              >
                {message.chat}
                <time className="is-block">{message.time}</time>
              </div>
            </div>
          );
        })
      ) : (
        <p className="has-text-centered">No messages yet</p>
      )}
    </div>
  );
  
}
export default MessageList;
