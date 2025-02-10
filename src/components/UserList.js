import React from 'react';
import { useEffect, useState } from 'react';
import socket from '../Socket';

function UserList({ conversations , onFetchMessage , users, onFetchUserId}) {
  //const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedUser, setSelectedUser] = useState(null); // To track selected user

  //console.log(onFetchUserId);
  
  
  //console.log(users);

  useEffect(() => {
    function onGetOnlineUser(onlineUsers) {
      //setUsers(onlineUsers);
    }

    function onNewUser(newUser) {
      //setUsers([...users, newUser]);
    }

    // Get online user
    socket.on('get online user', onGetOnlineUser);

    // New user
    socket.on('new user', onNewUser);

    return () => {
      socket.off('get online user', onGetOnlineUser);
      socket.off('new user', onNewUser);
    }
  }, [users]);


  
  let loggedInUser
    const storedUser = localStorage.getItem('chatUser');
    
  if (storedUser) {
       loggedInUser = JSON.parse(storedUser);
  }

  const fetchMessage=async(receiverId)=>{
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const res = await fetch(`https://localhost:1234/api/conversation/`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          senderId:loggedInUser._id,
          receiverId:receiverId
        })
  
      })   
      if (!res.ok) {
        throw new Error('Failed to fetch messages'); // Handle HTTP errors
      }   
      const resData= await res.json();
      
      //console.log(resData.message);
      
      setMessages(resData.data)
      if(resData.message){
        
        onFetchMessage(resData.data[0].messages); 
      }else{
        onFetchMessage([])
      }
      onFetchUserId(receiverId)
      //onFetchMessage(userId)
      //console.log(resData);
    } catch (error) {
      setError(error.message); // Set error message
      console.error('Error fetching messages:', error); 
    }finally {
      setLoading(false); // Stop loading
    }

    
  }

 // Only filter users when both the users list is available and the logged-in user exists
 const filteredUsers = loggedInUser && users.length > 0 
 ? users.filter(user => user._id !== loggedInUser._id) 
 : [];


   /*console.log(loggedInUser._id,'=====>loggedInUser._id');
   console.log(filteredUsers,'=====>loggedInUser._id');
   console.log(users,'=====>loggedInUser._id'); */
   

   return (
    <div id="activeUsersList">
      <h2 className="has-text-centered is-size-6 is-marginless is-paddingless">
        Online <span>({filteredUsers.length})</span>
      </h2>
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(({ full_name, _id }) => (
            <li key={_id}>
              <div
                className={`user-card ${selectedUser === _id ? 'highlighted' : ''}`} // Conditionally add 'highlighted' class
                onClick={() => {
                  setSelectedUser(_id); // Set the selected user ID
                  fetchMessage(_id); // Fetch messages for the selected user
                }}
              >
                <i className="fa fa-user" aria-hidden="true"></i>&nbsp;
                <p className="user-name">
                  {full_name}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className='text-center text-lg font-semibold'>No Chat</p>
        )}
      </ul>

      {/* Loading and Error States */}
      {loading && (
        <div className="mt-4 text-center text-blue-600">Loading messages...</div>
      )}
      {error && (
        <div className="mt-4 text-center text-red-600">Error: {error}</div>
      )}
    </div>
  );
}

export default UserList;
