import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';

function MessageForm({ fullName, LoggedInUser, selectedAgent, conversationId }) {
  const textareaRef = useRef(null);
  const emojiRef = useRef(null);
  const dispatch = useMessagesDispatch();
  const [respData, setRespData] = useState([]);

  //console.log(conversationId, 'from message form');


  const checkSubmit = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
      handleSubmit();
    }
  }

  //console.log(LoggedInUser);


  const handleSubmit = async () => {
    let textarea = textareaRef.current;
    const messageText = textarea.value.trim();

    if (!messageText) return; // Don't send empty messages


    // Determine role based on URL
    const currentPath = window.location.pathname;
    //const role = currentPath.includes('agent') ? 'agent' : 'customer';
    //const role = LoggedInUser.role;
    //console.log(respData, 'from message form');

    const loggedInUser = localStorage.getItem('chatUser');

    console.log(loggedInUser, 'from mess');
    

    const { token, user } = JSON.parse(loggedInUser);

    //console.log(user, 'from mess');
    
    const role = user.role;
    const userId = user._id;


    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const currentTime = new Date().toLocaleTimeString(); // Format as HH:MM:SS AM/PM  

    // Determine API endpoint based on role
    const apiUrl = role === 'agent'
      ? `https://localhost:1234/api/sendAgentMessage/`
      : `https://localhost:1234/api/sendMessage/`;

    // Define request payload
    const payload = {
      senderId:  userId,
      chat: textarea.value,
      role: role,
      date: currentDate,
      time: currentTime
    };

    // Add receiver only if it's an agent sending a message
    if (role === 'agent') {
      payload.conversationId = conversationId;
    }
    if (role === 'customer') {
      payload.conversationId = conversationId;
    }


    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error('Failed to fetch messages'); // Handle HTTP errors
      } else {

        const resData = await res.json();
        console.log(resData,'from resData');
        console.log(selectedAgent,'from selectedAgent');
        setRespData(resData)
        



        // Construct socket event payload
        const socketPayload = {
          user: user,
          senderId:  userId,
          receiver: selectedAgent?._id || resData.assignedAgent,
          chat: textarea.value,
          role: role,
          date: currentDate,
          timestamp: currentTime,
          conversationId:resData.conversationId 
        };

        
        
        // Add conversationId only for agents
        if (role === 'agent') {
          socketPayload.conversationId = resData.conversationId || 23; // Replace with actual conversation ID
        }
        console.log(socketPayload, 'from socketPayload');

        // Emit socket event
        socket.emit('send message', socketPayload);

        // Dispatch action to update state
        const messagePayload = {
          type: 'primary',
          user: resData.assignedAgentDetails,
          senderId:  userId,
          receiver: selectedAgent?._id || resData.assignedAgent,
          chat: textarea.value,
          role: role,
          date: currentDate,
          timestamp: currentTime,
          conversationId:resData.conversationId
        };

        // Add conversationId only for agents
        if (role === 'agent') {
          messagePayload.conversationId = resData.conversation_id || 23; // Replace with actual conversation ID
        }

      

        dispatch({
          type: 'newmessage',
          message: messagePayload
        });

      }


    } catch (error) {
      console.error('Error fetching messages:', error);

    }


    textarea.value = '';
  }

  const appendEmoji = (e) => {
    let emoji = e.target.textContent;
    const textarea = textareaRef.current;
    textarea.value += emoji;
  }

  useEffect(() => {
    let fragment = document.createDocumentFragment();
    let emojRange = [[128513, 128591], [128640, 128704]];

    for (let i = 0, length = emojRange.length; i < length; i++) {
      let range = emojRange[i];
      for (let x = range[0]; x < range[1]; x++) {
        let newEmoji = document.createElement('button');
        newEmoji.className = 'button is-white is-paddingless is-medium'
        newEmoji.innerHTML = '&#' + x + ';';
        newEmoji.addEventListener('click', appendEmoji);
        fragment.appendChild(newEmoji);
      }
    }

    emojiRef.current.appendChild(fragment);
  }, []);

  return (
    <>
      <div className="column is-paddingless">
        <textarea ref={textareaRef} autoFocus={true} className="textarea is-shadowless" rows="2" placeholder="Type a message" onKeyDown={checkSubmit}></textarea>
      </div>

      <div className="column is-2-mobile is-1-tablet is-paddingless">

        <div className="emoji-wrapper">
          <button className="button is-medium is-paddingless is-white" id="Emoji">
            <i className="far fa-smile"></i>
          </button>
          <div ref={emojiRef} id="EmojiList" className="popover has-background-white"></div>
        </div>

        <button className="button is-medium is-paddingless is-white" onClick={handleSubmit}><i className="far fa-paper-plane"></i></button>
      </div>
    </>
  );
}

export default MessageForm;
