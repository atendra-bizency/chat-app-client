import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import Message from './Message';
import { useMessagesDispatch, useMessagesState } from '../contexts/MessagesContext';



function MessageList({ messages, userId }) {
  const ref = useRef(null);
  const dispatch = useMessagesDispatch();

  //console.log(userId,'from message list');




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

          // Skip rendering if the message type is 'information'
          if (message.type === 'information') {
            return null; // Skip this message
          }

          //console.log(userId, 'from message list');
         //console.log(message.sender, 'from message list');
          


          const isCurrentUser = message.sender === user._id; // Check if sender is the current user

          if(isCurrentUser){
            //console.log('iiii');
            
              return (
                <Message key={index} data={{ ...message, type:  'secondary'  }} />
              );
            
          }else{

//console.log('enrr');
            return (
              <Message key={index} data={{ ...message, type:  'primary' }} />
            );
          }


        })
      ) : (
        <p className="has-text-centered">No messages yet</p>
      )}
    </div>
  );

}
export default MessageList;
