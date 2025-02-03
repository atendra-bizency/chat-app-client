import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import socket from '../Socket'
//import {} from 'react-router-dom'

function ChatSidebar({ onStartPrivateChat }) {
  const [roomName, setRoomName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showConfirmation, setShowConfrimation] = useState(false)
  const [conversations, setConversations] = useState(false)


  
  let user
    const storedUser = localStorage.getItem('chatUser');
    
  if (storedUser) {
       user = JSON.parse(storedUser);
  }


  const currentUser = 'YourName';
  useEffect(() => {

    socket.on('privateRoomJoined', (room) => {
      setRoomName(room);
      console.log(`Joined private room: ${room}`);
      //onStartPrivateChat(room, '92'); // Notify parent component
      if (onStartPrivateChat) {
        onStartPrivateChat(room, selectedUser); // Call the function
      }
    })

    return () => {
      socket.off('privateRoomJoined');
    }
  }, [onStartPrivateChat, selectedUser]);

  let loggedInUserId=user._id
  useEffect(()=>{
    const fetchConversations=async()=>{
      const res = await fetch(`https://localhost:1234/api/conversation/${loggedInUserId}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        }

      })
      const resData= await res.json();
      //console.log('resData=>>',resData);
      
      setConversations(resData)
    }
    fetchConversations()
  })

  //console.log('conversations===>',conversations);
  
  const handleUserClick = (user) => {
    setSelectedUser(user);

    setShowConfrimation(true); // Show confirmation dialog  
  }


  const handleStartPrivateChat = (user) => {

    socket.emit('joinPrivateRoom', { user1: '89', user2: '42' });
    setShowConfrimation(false); // close confirmation dialog
  }


  const handleCancelPrivateChat = () => {
    setShowConfrimation(false); // Close confirmation dialog
  };

  return (
    <aside className="column is-2 is-hidden-mobile has-background-light has-text-black">
      <UserList onUserClick={handleUserClick} />

      {roomName && (
        <div className="private-chat">
          <h2>Private Chat Room: {roomName}</h2>
          <p>Chatting with: {selectedUser}</p>
          {/* Add chat functionality here */}
        </div>
      )}


      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Do you want to start a private chat with {selectedUser}?</p>
          <button onClick={handleStartPrivateChat}>Yes</button>
          <button onClick={handleCancelPrivateChat}>No</button>
        </div>
      )}
    </aside>
  );
}

export default ChatSidebar;
