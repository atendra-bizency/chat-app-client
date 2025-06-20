import React from 'react';
import ChatArea from "./ChatArea";
import ChatSidebar from "./ChatSidebar";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


function ChatMain() {

  const [agentDetails, setAgentDetails] = useState([]); // State to manage messages
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [userConversation, setUserConversation] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [userStatuses, setUserStatuses] = useState({});

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [sidebarWidth, setSidebarWidth] = useState(30); // in pixels
  const resizerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'ew-resize'; // Apply globally on drag start
  };

const handleMouseMove = (e) => {
  if (!isDragging.current) return;

  const totalWidth = window.innerWidth;
  const sidebarWidthPx = e.clientX;

  // Convert px to %
  const calculatedPercent = (sidebarWidthPx / totalWidth) * 100;

  // Clamp between 27% and 50%
  const clampedPercent = Math.min(Math.max(17, calculatedPercent), 50);

  setSidebarWidth(clampedPercent);
};



  const handleMouseUp = () => {
    isDragging.current = false;
     document.body.style.cursor = ''; // Reset to default cursor
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = ''; // Safety reset
    };
  }, []);

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
    <main className="columns" style={{ height: '94vh' }}>

       <div style={{ width: `${sidebarWidth}%` }} className="bg-white border-l overflow-auto  has-background-light">
      <ChatSidebar 
        sendAgentDetails={agentDetails}
        callFromUserListConversation={fetchConversationDetails}
        userStatuses={userStatuses} 

        sendUserConversation={userConversation}
        onAgentSelect={setSelectedAgent} />
        </div>
         <div
            ref={resizerRef}
            onMouseDown={handleMouseDown}
            className="cursor-ew-resize hover:bg-gray-500 transition-colors"
            style={{
              width: '2px',               // slightly wider for better grip
              backgroundColor: 'rgb(194 194 194)',
              zIndex: 10,
              cursor: 'ew-resize'         // ensures horizontal resize cursor
            }}
          ></div>
      <div style={{ width: `calc(100% - ${sidebarWidth}%)`,borderLeft: '1px solid #ccc' }} className="flex-grow overflow-auto bg-gray-100 ">
      
      <ChatArea 
        fetchConversationDetails={fetchConversationDetails}
        setUserStatuses={setUserStatuses}
        onGetAgentDetail={getAgentDetails}
        onGetUserConversation={getUserConversation}
        selectedAgent={selectedAgent}
        sendUserConversation={conversation} /></div>
       
      {/* <div style={{ width: `${sidebarWidth}%`, borderRight: '1px solid #ccc' }} className="bg-white border-l overflow-auto  has-background-light">
      <ChatSidebar 
        sendAgentDetails={agentDetails}
        callFromUserListConversation={fetchConversationDetails}
        sendUserConversation={userConversation}
        onAgentSelect={setSelectedAgent} />
        </div> */}
    </main>
  );
}

export default ChatMain;
