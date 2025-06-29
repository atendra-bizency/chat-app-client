import React, { useEffect, useState } from 'react';
import { useMessages, useMessagesDispatch } from '../contexts/MessagesContext';
import axios from 'axios';  // Make sure to import Axios
import socket from '../Socket';


function UserList({ sendAgentDetails, onAgentSelect , sendUserConversation, callFromUserListConversation , userStatuses}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user
  const [chatStatus, setchatStatus] = useState(true); // Track selected user
  const [SelectedUserDeatils, setSelectedUserDeatils] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const dispatch = useMessagesDispatch();
  const messages = useMessages();
  

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;


  //console.log(sendUserConversation,'from 00000');
  //console.log(sendUserConversation?.length,'from 00000');

  useEffect(() => {
    if (sendUserConversation?.messages?.length > 1 || sendUserConversation?.length == 1) {
      //console.log("sendUserConversation has no messages. Skipping user addition.");
      return;  // Exit early if there are no messages
    }

    //console.log(messages,'check for add user');
    
  
    // Add new users from real-time messages
    const newUsersFromMessages = messages
      .filter(msg => !users.some(user => (msg.type === "primary" ? user.userId : user.senderId) ===  (msg.type === "primary" ? msg.receiver : msg.senderId)))
      .map(msg => ({
        id: msg.type === "primary" ? msg.receiver : msg.senderId,
        fullName: msg.user?.username || 'Unknown',
        team: 'Unknown Team',
        isAvailable: true,
        lastActivity: new Date().toISOString(),
        userId: msg.type === "primary" ? msg.receiver : msg.senderId,
        role: msg.role || 'customer'
      }));
  
    if (newUsersFromMessages.length > 0) {
      setUsers(prevUsers => [...prevUsers, ...newUsersFromMessages]);
    }
  
    setLoading(false);
  }, [messages, sendUserConversation]);  // Added sendUserConversation as a dependency
  
  

  useEffect(() => {
    // Log to check what sendAgentDetails contains
    
    if (Array.isArray(sendAgentDetails) && sendAgentDetails.length > 0) {
      // Extract relevant agent details and setUsers
      //console.log('sendAgentDetails:', sendAgentDetails);
      const formattedUsers = sendAgentDetails.map(agent => ({
        id: agent._id,
        fullName: agent.username,
        team: agent.team,  // Include team info if needed
        isAvailable: agent.isAvailable,
        lastActivity: agent.lastActivity,
        userId: agent.userId,
        role:agent.role
      }));
      
  
      setUsers(formattedUsers);
    } else {
      // If no valid agents, set empty array
      setUsers([]);
    }
  
    setLoading(false);  // Set loading to false when data is processed
  }, [sendAgentDetails]); 
   // Re-run whenever sendAgentDetails changes


   const handleSelectUser = (user) => {
    //console.log(user, 'from handleSelectUser');
    
    callFromUserListConversation(user)
    
    setSelectedUserId(user.id);  // Set selected user
    onAgentSelect(user);  // Notify parent component
  };

useEffect(() => {
  const stored = localStorage.getItem('chatUser');
  if (stored) {
    const { token, user } = JSON.parse(stored);
    setLoggedInUser(user);
  }
}, []);

//console.log(loggedInUser, 'loggedInUser');

  //console.log(storedUser, 'from userList'  );
  

  const handleCloseChat = () => {
    //console.log(sendConversationId);  // Log the conversation ID
  
    // Send GET request to the API to close the chat and retrieve messages
    axios.get(`${BASE_URL}/getMessage/${sendUserConversation.conversation_id}`)
      .then(response => {
        // Handle the response data here
        const { customerId, message, agentId } = response.data;
         // Construct socket event payload
         const socketPayload = {
          conversationId: sendUserConversation.conversation_id,
          senderId: customerId,
          receiverId: agentId,
          message: "This conversation has been closed."
        };

        const loggedInUser = localStorage.getItem('chatUser');
        const { user, } = JSON.parse(loggedInUser);

        //console.log(user.role, 'from handleCloseChat ');

        socketPayload.role=user.role;
        //console.log(socketPayload);
        
        

        // Send a socket event to notify both sender and receiver
      socket.emit('close chat', socketPayload);
         console.log(`Chat closed by ${agentId}: ${message}`);
        // Dispatch new message after closing chat (if needed)
        dispatch({
          type: 'newmessage',
          message: {
            type: 'information', // Set your message type as needed
            chat:"This conversation has been closed.",
            user:agentId,
            senderId:agentId,
            receiver:customerId,
          },
        });

        setchatStatus(false);
  
        // Remove only the selected user from the users list
        //setUsers(users.filter(user => user.id !== selectedUserId)); // Remove selected user
  
        // Optionally, reset selected user if needed
        // setSelectedUserId(null); // Reset selected user
  
      })
      .catch(error => {
        console.error('Error closing chat:', error);
        // Handle error response if needed
      });
  };

  return (
    <div id="activeUsersList">
      <h2 className="has-text-left ml-4 is-size-6 is-marginless is-paddingless">
        Chats 
      </h2>

      {loading ? (
        <p className="has-text-centered">Loading users...</p>  
      ) : (
        <ul>
         {users.length > 0 ? (
  [...new Map(users.map(user => [user.id, user])).values()] // Remove duplicate users based on user.id
    .map((user, index) => (
      <li 
        key={user.id} 
        onClick={() => handleSelectUser(user)}
      >
        <div className={`user-card ${selectedUserId === user.id ? 'highlighted' : ''}`}>
          <i className="fa fa-user" aria-hidden="true"></i>&nbsp;
          <p className="user-name">{user.fullName}</p>
           {/* <span className={`w-2 h-2 rounded-full ${userStatuses[user.id] ? 'bg-green-500' : 'bg-gray-400'}`}></span> */}
           <span className={`status-dot ${userStatuses[user.id] ? 'online' : 'offline'}`}></span>

        </div>
      </li>
    ))
) : (
  <p>No agents available</p>
)}

        </ul>

        
      )}

      {/* Show Close Chat button only if selected user is an agent and conversation is not closed */}
     {loggedInUser?.role === "agent" &&
      selectedUserId &&
      users.find((user) => user.id === selectedUserId) && (
        sendUserConversation?.status === "closed" ? (
          <button className="button is-warning mt-2" >
            Reopen Chat
          </button>
        ) : (
          <div style={{ textAlign: "right", marginRight: "10px" }}>
            <button className="button is-danger mt-2" onClick={handleCloseChat} disabled={chatStatus==false}>
              Close Chat
            </button>
          </div>
        )
      )}


    </div>
  );
}

export default UserList;
