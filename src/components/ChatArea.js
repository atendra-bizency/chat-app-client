import React from 'react';
import { useEffect, useState } from 'react';
import {  useMessagesState ,useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';
import LoginForm from './LoginForm';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

function ChatArea({messages, userId, onFetchIsLogin}) {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const allMessages = useMessagesState();
  const dispatch = useMessagesDispatch();


  let loggedInUser
    const storedUser = localStorage.getItem('chatUser');
    
  if (storedUser) {
       loggedInUser = JSON.parse(storedUser);
  }

// Push only the last message from allMessages into messages
if (allMessages.length > 0) {
  const lastMessage = allMessages[allMessages.length - 1]; // Get the last message
  if (!messages.includes(lastMessage)) { // Avoid duplicates 
    console.log(userId);
              
      if (lastMessage.receiver === userId  || lastMessage.sender ===  userId) {
        console.log('pushed',lastMessage);
        
      messages.push(lastMessage);
    }
  }
}

//console.log(userId,'from chat area');



  
  useEffect(() => {

    function onNewUser(newUser) {
      dispatch({
        type: 'newmessage',
        message: {
          type: 'information',
          user: newUser,
          text: 'logged in.'
        }
      })
    }

    function onExitUser(exitUser) {
      dispatch({
        type: 'newmessage',
        message: {
          type: 'information',
          user: exitUser,
          text: 'left.'
        }
      })
    }

   /* function onNewMessage(message) {
      console.log(message);
      
      dispatch({
        type: 'newmessage',
        message: {
          type: 'secondary',
          user: message.user,
          chat: message.chat,
          sender: message.senderId,
          receiver: message.receiverId,
          time:new Date().toLocaleTimeString()
        }
      })
    } */

    function onReceiveMessage(message) {
      console.log(message);
      
      dispatch({
        type: 'receive message',
        message: {
          type: 'secondary',
          user: message.user,
          chat: message.chat,
          sender: message.receiver,
          receiver: message.sender,
          time:new Date().toLocaleTimeString()
        }
      })
    }

    // New user
    socket.on('new user', onNewUser);

    // Exit user
    socket.on('exit user', onExitUser);

    // New message
    //socket.on('new message', onNewMessage);

    socket.on('receive message', onReceiveMessage);

    return () => {
      socket.off('new user', onNewUser);
      socket.off('exit user', onExitUser);
      //socket.off('new message', onNewMessage);
      socket.off('receive message', onReceiveMessage);
    }
  }, [dispatch]);

  //console.log(isLogin);
  // Use useEffect to call onFetchIsLogin only when isLogin changes
  useEffect(() => {
    onFetchIsLogin(isLogin);
  }, [isLogin, onFetchIsLogin]); // Add isLogin and onFetchIsLogin as dependencies


  // Frontend: Check local storage on page load
window.addEventListener('load', () => {
  const storedUser = localStorage.getItem('chatUser');
  //console.log('storedUser:', storedUser);
  
  if (storedUser) {
    const { full_name, _id } = JSON.parse(storedUser);
    //console.log('reconnect user:', full_name, _id);
    
    socket.emit('reconnect user', { full_name, _id });
  }
});
  

  return (
    <section className="column">
      <MessageList messages={messages}  userId={userId}/>
      <div className="columns is-mobile has-background-white is-paddingless has-text-centered messageform">
        {!isLogin && <LoginForm setLogin={setIsLogin} setUserName={setUserName}  />}
        {isLogin && <MessageForm fullName={userName} messages={messages} userId={userId} />}
      </div>
    </section>
  );
}

export default ChatArea;
