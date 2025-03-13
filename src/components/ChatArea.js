import React, { useEffect, useState } from 'react';
import { useMessages, useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';
import LoginForm from './LoginForm';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import axios from 'axios';

function ChatArea({ onGetAgentDetail, selectedAgent, onGetUserConversation, fetchConversationDetails, sendUserConversation }) {
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [LoggedInUser, setLoggedInUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [agentDetails, setAgentDetails] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [ConversationId, setConversationId] = useState('');
  const [selectedUserConversation, setSelectedUserConversation] = useState([]);

  const [loginMessage, setLoginMessage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  
  

  const messages = useMessages();
  const dispatch = useMessagesDispatch();

  //console.log(LoggedInUser);



  useEffect(() => {
    // Only update ConversationId when selectedAgent or conversation changes

    
    //console.log('11111X');
    if (selectedAgent) {
      //console.log('2222');
      const agentConversation = conversation.find(
        conv => conv.agentDetails._id === selectedAgent.id
      );

      
      
      //console.log(agentConversation,'3333');
      if (agentConversation?.conversation_id) {
        //console.log(agentConversation.conversation_id,'444');
        setConversationId(agentConversation.conversation_id);
        onGetUserConversation(agentConversation);
        setSelectedUserConversation(agentConversation)
      }else{
        //console.log(sendUserConversation,'5555');
        onGetUserConversation(sendUserConversation);
        
        setConversationId(sendUserConversation[0]?.conversation_id);
      }
    }
  }, [selectedAgent, conversation, sendUserConversation]);

  // Fetch conversation details when the user logs in
  useEffect(() => {
    const loggedInUser = localStorage.getItem('chatUser');
    if (loggedInUser) {
      const { token, user } = JSON.parse(loggedInUser);
      console.log(user);
      
      socket.emit('restore session', token);
      setIsLogin(true);
      setUserName(user.username);
      setLoggedInUser(user);    

      fetchAllConversationOfUser(user._id);
      
     
    }
  }, []);

  // Function to fetch conversation details
  //console.log(LoggedInUser);
  
  const fetchAllConversationOfUser = async (customerId) => {
    try {
      const loggedInUser = localStorage.getItem('chatUser');

      const { token, user } = JSON.parse(loggedInUser);
      const role = user.role;

      //console.log(user, 'LoggedInUser');


      const response = await axios.get(`https://localhost:1234/api/conversation/${role}/${customerId}`);
      //console.log('API Response:', response.data);

      if (response.data.success) {
        const conversations = response.data.data;

        //console.log(conversations, 'conversations from fetchConversationDetails');


        // Extract agentDetails and teamDetails from each conversation
        const allAgentDetails = conversations.map(conv => conv.agentDetails);
        const allTeamDetails = conversations.map(conv => conv.teamDetails);

        //console.log(allAgentDetails, 'allAgentDetails');



        // For unique agents
        const uniqueAgents = [...new Map(allAgentDetails.map(item => [item._id, item])).values()];

        // For unique teams
        const uniqueTeams = [...new Map(allTeamDetails.map(item => [item._id, item])).values()];

        setAgentDetails(uniqueAgents);
        setTeamDetails(uniqueTeams);
        setConversation(conversations);
        //console.log(conversations.messages, 'conversations');


        // If you need to process agents for parent component
        allAgentDetails.forEach(agent => {
          onGetAgentDetail(agent);
        });
      } else {
        console.log('No conversation found for this customer.');
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };





  // Socket event listeners
  useEffect(() => {
    function onNewUser(newUser) {
      dispatch({
        type: 'newmessage',
        message: { type: 'information', user: newUser, text: 'logged in.' },
      });
    }

    function onExitUser(exitUser) {
      dispatch({
        type: 'newmessage',
        message: { type: 'information', user: exitUser, text: 'left.' },
      });
    }

    function onNewMessage(message) {
      console.log(message);
      //console.log(selectedAgent);



      dispatch({
        type: 'newmessage',
        message: {
          type: 'secondary', user: message.user, chat: message.chat, senderId: message.senderId,
          receiver: message.receiver, role: message.role, date: message.date, timestamp: message.timestamp,
          conversationId:message.conversationId
        },
      });
    }

    //console.log(selectedAgent);


    //socket.on('new user', onNewUser);

    socket.on('exit user', onExitUser);
    socket.on('new message', onNewMessage);

    return () => {
      //socket.off('new user', onNewUser);
      socket.off('exit user', onExitUser);
      socket.off('new message', onNewMessage);
    };
  }, [dispatch]);

  // Combine messages from API and real-time context
  const getCombinedMessages = () => {

    console.log('check enter or not');
    console.log(conversation, 'conversation');
    const isConversationAvailableOrNot = conversation.find(
      conv => conv.conversation_id === messages.conversationId
    );


    console.log(messages);
     // If no conversation exists, return only real-time messages
  if (!isConversationAvailableOrNot && !messages) {
    console.log('New conversation detected. Showing real-time messages only.');
    return messages.filter(msg => 
      msg.receiver === selectedAgent?.userId || 
      msg.senderId === selectedAgent?.userId
    );
  }

    
    
    
    if (!selectedAgent) return [];

    console.log(selectedAgent, 'selectedAgent');

    // Find conversation for selected agent
    const agentConversation = conversation.find(
      conv => conv.agentDetails._id === selectedAgent.id

    );

    if(!agentConversation){
      return messages
      
    }
    console.log(agentConversation, 'agentConversation');

    // Get messages from both sources
    const apiMessages = agentConversation?.messages || [];

    // Check if the conversation is closed and "chat closed" message isn't already added
    if (agentConversation.status === 'closed' &&
      !apiMessages.some(msg => msg.message_id === "closed_message")) {

      const closedMessage = {
        message_id: "closed_message",
        conversation_id: agentConversation.conversation_id,
        senderId: "system",
        receiver: selectedAgent.id,
        team: agentConversation.team,
        chat: "This conversation has been closed.",
        timestamp: new Date().toISOString(),
        status: "read",
        _id: "closed_message_id",
        type: 'information',
      };

      console.log(closedMessage, 'from closedMessage');
      

      apiMessages.push(closedMessage);  // Append the closed message ONLY if it's not already there
    }

    console.log(apiMessages, 'apiMessages');

    const realTimeMessages = messages.filter(
      (msg) => {

        console.log(msg);
        if (selectedAgent) {

          return msg.receiver === selectedAgent.id || msg.senderId === selectedAgent.id;
        }

      }
    );

    return [...apiMessages, ...realTimeMessages];
  };

  //console.log(selectedUserConversation);
  useEffect(() => {
    //console.log("Setting up chat close listener...");

    //console.log(selectedAgent);
    

    const handleChatClose = ({ conversationId, senderId, receiverId, message }) => {
      console.log(`Chat closed by ${senderId}: ${message}`);  // <-- Debug log

      // Dispatch new message after closing chat (if needed)
      dispatch({
        type: 'newmessage',
        message: {
          type: 'information', // Set your message type as needed
          chat: "This conversation has been closed.",
          //user:agentId,
          senderId: receiverId,
          receiver: senderId,
        },
      });

      //alert(message);
    };

    socket.on('chat closed', handleChatClose);
    //console.log("Chat close event listener added.");

    return () => {
      //console.log("Removing chat close event listener...");
      socket.off('chat closed', handleChatClose);
    };
  }, []);

  const setLoginUserdata =(loggedInUserData)=>{
    setLoggedInUser(loggedInUserData)
  }


  useEffect(() => {
    const fetchUserAndLogin = async () => {
      try {
        // Check if user is already stored in localStorage
        const storedUser = localStorage.getItem("chatUser");
  
        if (storedUser) {
          console.log("User already logged in, skipping API call.");
          setIsLogin(true);
          return;
        }
  
        // If no user is stored, proceed with fetching user data
        const userResponse = await axios.get(
          "https://localhost/bizencyProject/public/mis/get-user",
          { withCredentials: true }
        );
  
        if (userResponse.data) {
          console.log(userResponse.data);
          const role = userResponse.data.user.ishelpdesk === "1" ? "agent" : "customer";

  
          const loginData = {
            username: userResponse.data.user.username || "Hajar",
            role: role,
            password: userResponse.data.password || "122345",
          };
  
          try {
            const loginResponse = await axios.post(
              "https://localhost:1234/api/login",
              loginData
            );
            console.log(loginResponse.data.user);
  
            if (loginResponse.data.success) {
              localStorage.setItem("chatUser", JSON.stringify(loginResponse.data));
  
              const parsedUser = loginResponse.data.user;
              socket.emit("login", parsedUser.fullName, parsedUser.role, parsedUser.userId, parsedUser._id);
              setIsLogin(true);
  
              fetchAllConversationOfUser(parsedUser._id);
            } else {
              setLoginMessage(loginResponse.data.message);
            }
          } catch (loginError) {
            console.error("Login error:", loginError);
          }
        } else {
          console.warn("No user data received from Laravel API.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserAndLogin();
  }, []); // Run only once when the component mounts
  



  //console.log(selectedAgent, LoggedInUser?.role,selectedUserConversation, 'from ChatArea');
  



  return (
    <section className="column">
      <MessageList messages={getCombinedMessages()} />
      <div className="columns is-mobile has-background-white is-paddingless has-text-centered messageform">
        {!isLogin ? (
          <LoginForm getLoginUserData={setLoginUserdata} setLogin={setIsLogin} setUserName={setUserName} fetchAllConversationOfUser={fetchAllConversationOfUser} />
        ) : (
          //(Array.isArray(selectedUserConversation) && selectedUserConversation.length === 0 &&LoggedInUser?.role !== "agent") ||
          (Array.isArray(selectedUserConversation) && selectedUserConversation.length === 0 ) ||
            (selectedUserConversation?.status === "open") ? (
            <MessageForm
              conversationId={ConversationId}
              selectedAgent={selectedAgent}
              fullName={userName}
              LoggedInUser={LoggedInUser}
              fetchConversationDetails={fetchConversationDetails}
            />
          ) : null
        )}
      </div>
    </section>
  );
}

export default ChatArea;
