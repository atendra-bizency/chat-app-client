import React from 'react';
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";
import { useEffect, useState } from 'react';
import axios from 'axios';


function ChatMain() {

  const [agentDetails, setAgentDetails] = useState([]); // State to manage messages
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [userConversation, setUserConversation] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [conversation, setConversation] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const getAgentDetails = (agentDetails) => {
    // Ensure agentDetails is valid before setting state
    if (agentDetails && typeof agentDetails === 'object') {
      setAgentDetails((prev) => [...prev, agentDetails]);
    } else {
      console.error('Invalid agent details:', agentDetails);
    }
  };

  const getUserConversation = (conversation) => {
    setUserConversation(conversation)
  };



  const fetchConversationDetails = async (customer) => {
    try {

      let customerId = customer._id;
      
      const loggedInUser = localStorage.getItem('chatUser');
      
      //console.log(conversation, 'from chatMAIN');
      let agentId;
      
      const { token, user } = JSON.parse(loggedInUser);
      const role = user.role;
      if (role === 'agent') {
      
        agentId = user._id;
        customerId = customer.id;
      } else if (role === 'customer') {
      
        
        agentId = customer.id;
        customerId = user._id;
      } else {
      
        console.error("Invalid role:", role);
        return;
      }

      //console.log(customerId, 'customerId');

      const response = await axios.post(`${BASE_URL}/conversation`, {
        customerId,
        agentId
      });


      //const response = await axios.get(`https://localhost:1234/api/conversation/${role}/${customerId}`);
      //console.log('API Response:', response.data);

      //console.log(response);


      if (response.data.message) {
        const conversations = response.data.data;

        //console.log(conversations, 'conversations from fetchConversationDetails');



        setConversation(conversations);
        //setUserConversation(conversations)

      } else {
        console.log('No conversation found for this customer.');
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };


  



  //console.log(userConversation, '=>>>>>conversationId');
  //console.log(conversation, '=>>>>>conversationId');

  return (
    <main className="columns">
      <ChatArea fetchConversationDetails={fetchConversationDetails}  onGetAgentDetail={getAgentDetails} onGetUserConversation={getUserConversation} selectedAgent={selectedAgent} sendUserConversation={conversation} />
      <ChatSidebar sendAgentDetails={agentDetails} callFromUserListConversation={fetchConversationDetails} sendUserConversation={userConversation} onAgentSelect={setSelectedAgent} />
    </main>
  );
}

export default ChatMain;
